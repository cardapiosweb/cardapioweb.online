const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const DOMINIO_PLATAFORMA = "cardapiosweb.online"
const VALOR_PADRAO_PLANO = { basico: 39.90, premium: 49.90 }

function gerarSenhaTemporaria() {
  const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"
  let senha = ""
  for (let i = 0; i < 12; i++) senha += alfabeto[Math.floor(Math.random() * alfabeto.length)]
  return senha
}

function gerarSlug(texto) {
  return String(texto || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ erro: "Método não permitido." })
    return
  }

  const sbAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  // ---- 1. Confirma quem está chamando ----
  const authHeader = req.headers.authorization || ""
  const token = authHeader.replace("Bearer ", "")
  if (!token) { res.status(401).json({ erro: "Não autenticado." }); return }

  const { data: dadosToken, error: erroToken } = await sbAdmin.auth.getUser(token)
  if (erroToken || !dadosToken?.user) { res.status(401).json({ erro: "Sessão inválida." }); return }

  console.log("DEBUG user_id recebido:", dadosToken.user.id)
  console.log("DEBUG SUPABASE_URL definido:", !!SUPABASE_URL)
  console.log("DEBUG SERVICE_ROLE_KEY definido:", !!SERVICE_ROLE_KEY)

  const { data: admin, error: erroAdmin } = await sbAdmin
    .from("admins_plataforma")
    .select("id")
    .eq("user_id", dadosToken.user.id)
    .eq("ativo", true)
    .maybeSingle()

  console.log("DEBUG resultado admin:", admin)
  console.log("DEBUG erro admin:", erroAdmin)

  if (erroAdmin || !admin) {
    res.status(403).json({
      erro: "Você não tem permissão de administrador da plataforma.",
      debug: { userIdRecebido: dadosToken.user.id, erroAdmin: erroAdmin ? erroAdmin.message : null }
    })
    return
  }

  // ---- 2. Valida os dados recebidos ----
  const corpo = req.body || {}
  const nome = (corpo.nome || "").trim()
  const emailLojista = (corpo.emailLojista || "").trim().toLowerCase()
  const whatsapp = (corpo.whatsapp || "").replace(/[\s()\-+]/g, "")
  const chavePix = (corpo.chavePix || "").trim()
  const tema = corpo.tema || "generico"
  const corPrincipal = corpo.corPrincipal || null
  const modoLoja = corpo.modoLoja || {}
  const plano = corpo.plano === "premium" ? "premium" : "basico"
  const valor = Number(corpo.valor) || VALOR_PADRAO_PLANO[plano]
  const dataContratacao = corpo.dataContratacao
  const dataVencimento = corpo.dataVencimento
  const nomeLojista = (corpo.nomeLojista || "").trim()

  if (!nome || !emailLojista || !dataContratacao || !dataVencimento) {
    res.status(400).json({ erro: "Preencha nome da loja, e-mail do lojista e as datas." })
    return
  }

  let slug = gerarSlug(corpo.slug || nome) || "loja"
  let usuarioCriadoId = null
  let lojaCriadaId = null

  try {
    // ---- 3. Slug único ----
    let candidato = slug
    let contador = 2
    while (true) {
      const { data: existe } = await sbAdmin.from("lojas").select("id").eq("slug", candidato).maybeSingle()
      if (!existe) break
      candidato = `${slug}-${contador}`
      contador++
    }
    slug = candidato

    // ---- 4. Cria o usuário do lojista no Supabase Auth ----
    const senhaTemporaria = gerarSenhaTemporaria()
    const { data: usuarioCriado, error: erroUsuario } = await sbAdmin.auth.admin.createUser({
      email: emailLojista,
      password: senhaTemporaria,
      email_confirm: true
    })
    if (erroUsuario) { res.status(400).json({ erro: `Não foi possível criar o usuário: ${erroUsuario.message}` }); return }
    usuarioCriadoId = usuarioCriado.user.id

    // ---- 5. Cria a loja já vinculada ----
    const { data: lojaCriada, error: erroLoja } = await sbAdmin.from("lojas").insert({
      nome, slug, whatsapp, chave_pix: chavePix, tema,
      cor_principal: corPrincipal, modo_loja: modoLoja,
      owner_user_id: usuarioCriadoId, ativa: true
    }).select("id").single()
    if (erroLoja) throw new Error(`loja: ${erroLoja.message}`)
    lojaCriadaId = lojaCriada.id

    // ---- 6. Domínio (subdomínio da plataforma) ----
    const dominioCompleto = `${slug}.${DOMINIO_PLATAFORMA}`
    const { error: erroDominio } = await sbAdmin.from("dominios_loja").insert({ dominio: dominioCompleto, loja_id: lojaCriadaId })
    if (erroDominio) throw new Error(`domínio: ${erroDominio.message}`)

    // ---- 7. Assinatura vinculada ----
    const { error: erroAssinatura } = await sbAdmin.from("assinaturas").insert({
      nome_loja: nome, responsavel: nomeLojista, whatsapp,
      link_site: `https://${dominioCompleto}`, plano, valor,
      data_contratacao: dataContratacao, data_vencimento: dataVencimento,
      observacoes: `E-mail do lojista: ${emailLojista}`, ativo: true, loja_id: lojaCriadaId
    })
    if (erroAssinatura) throw new Error(`assinatura: ${erroAssinatura.message}`)

    // ---- 8. Sucesso ----
    res.status(200).json({
      ok: true, lojaId: lojaCriadaId, slug, dominio: dominioCompleto,
      linkSite: `https://${dominioCompleto}`,
      linkAdmin: `https://${dominioCompleto}/admin-loja.html`,
      emailLojista, senhaTemporaria
    })

  } catch (erro) {
    // ---- Desfaz o que já foi criado, pra não sobrar lixo ----
    if (lojaCriadaId) {
      await sbAdmin.from("dominios_loja").delete().eq("loja_id", lojaCriadaId)
      await sbAdmin.from("lojas").delete().eq("id", lojaCriadaId)
    }
    if (usuarioCriadoId) await sbAdmin.auth.admin.deleteUser(usuarioCriadoId)
    res.status(500).json({ erro: `Não foi possível concluir a criação: ${erro.message}` })
  }
}