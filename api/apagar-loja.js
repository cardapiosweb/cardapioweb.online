import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, erro: 'Método não permitido' })

  // Reconfirma que quem está chamando é um fundador ativo — mesma
  // checagem que /api/admins.js já faz, nunca confia só na interface.
  const token = (req.headers.authorization || '').replace('Bearer ', '')
  const { data: { user }, error: erroToken } = await supabaseAdmin.auth.getUser(token)
  if (erroToken || !user) return res.status(401).json({ ok: false, erro: 'Não autenticado' })

  const { data: admin } = await supabaseAdmin
    .from('admins_plataforma')
    .select('role, ativo')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!admin || !admin.ativo || admin.role !== 'fundador') {
    return res.status(403).json({ ok: false, erro: 'Só o fundador pode apagar lojas' })
  }

  const { lojaId, nomeConfirmado } = req.body
  if (!lojaId || !nomeConfirmado) return res.status(400).json({ ok: false, erro: 'Dados incompletos' })

  const { data: loja, error: erroLoja } = await supabaseAdmin
    .from('lojas')
    .select('id, nome, owner_user_id')
    .eq('id', lojaId)
    .maybeSingle()

  if (erroLoja || !loja) return res.status(404).json({ ok: false, erro: 'Loja não encontrada' })
  if (loja.nome !== nomeConfirmado) {
    return res.status(400).json({ ok: false, erro: 'Nome de confirmação não confere' })
  }

  const erros = []

  // 1) Storage — tudo salvo sob o prefixo `{lojaId}/...` (logo, banner,
  //    fotos de produto, referência de encomenda)
  try {
    const { data: arquivos } = await supabaseAdmin.storage.from('midia').list(lojaId, { limit: 1000 })
    if (arquivos && arquivos.length) {
      const caminhos = arquivos.map(a => `${lojaId}/${a.name}`)
      const { error } = await supabaseAdmin.storage.from('midia').remove(caminhos)
      if (error) erros.push(`storage: ${error.message}`)
    }
  } catch (err) {
    erros.push(`storage: ${err.message}`)
  }

  // 2) Tabelas operacionais (best effort — segue mesmo se alguma não existir)
  const tabelas = ['produtos', 'pedidos_mesa', 'relatorio_dia', 'comandas_finalizadas', 'pedidos_encomenda', 'funcionarios', 'agendamentos']
  for (const tabela of tabelas) {
    const { error } = await supabaseAdmin.from(tabela).delete().eq('loja_id', lojaId)
    if (error && !/does not exist|schema cache/i.test(error.message || '')) erros.push(`${tabela}: ${error.message}`)
  }

  // 3) Domínio(s)
  const { error: erroDominios } = await supabaseAdmin.from('dominios_loja').delete().eq('loja_id', lojaId)
  if (erroDominios) erros.push(`dominios_loja: ${erroDominios.message}`)

  // 4) Assinatura — mantém o histórico financeiro, só desvincula da loja
  const { error: erroAssinatura } = await supabaseAdmin.from('assinaturas').update({ loja_id: null }).eq('loja_id', lojaId)
  if (erroAssinatura) erros.push(`assinaturas: ${erroAssinatura.message}`)

  // 5) A loja em si — precisa vir ANTES de apagar o login do lojista,
  //    já que owner_user_id é FK para auth.users: apagar o usuário
  //    primeiro, com a loja ainda referenciando ele, é rejeitado pelo
  //    Postgres (erro genérico "Database error deleting user" do GoTrue).
  const { error: erroDelete } = await supabaseAdmin.from('lojas').delete().eq('id', lojaId)
  if (erroDelete) erros.push(`lojas: ${erroDelete.message}`)

  // 6) Só agora, com a loja já removida, apaga a conta de login do
  //    lojista (se existir e não for compartilhada com outra loja)
  if (!erroDelete && loja.owner_user_id) {
    const { data: outrasLojas } = await supabaseAdmin.from('lojas').select('id').eq('owner_user_id', loja.owner_user_id).neq('id', lojaId)
    if (!outrasLojas || outrasLojas.length === 0) {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(loja.owner_user_id)
      if (error) erros.push(`login do lojista: ${error.message}`)
    }
  }

  return res.status(200).json({ ok: erros.length === 0, erros })
}