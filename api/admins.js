const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

module.exports = async (req, res) => {
  const sbAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
  const token = (req.headers.authorization || "").replace("Bearer ", "")
  if (!token) { res.status(401).json({ erro: "Não autenticado." }); return }

  const { data: dadosToken, error: erroToken } = await sbAdmin.auth.getUser(token)
  if (erroToken || !dadosToken?.user) { res.status(401).json({ erro: "Sessão inválida." }); return }

  const { data: chamador, error: erroChamador } = await sbAdmin
    .from("admins_plataforma")
    .select("id, role, ativo")
    .eq("user_id", dadosToken.user.id)
    .maybeSingle()

  if (erroChamador || !chamador || !chamador.ativo || chamador.role !== "fundador") {
    res.status(403).json({ erro: "Apenas o administrador fundador pode gerenciar administradores." })
    return
  }

  if (req.method === "GET") {
    const { data: admins, error } = await sbAdmin
      .from("admins_plataforma")
      .select("id, user_id, nome, role, ativo, criado_em")
      .order("criado_em", { ascending: true })

    if (error) { res.status(500).json({ erro: error.message }); return }

    const comEmail = await Promise.all((admins || []).map(async (a) => {
      const { data } = await sbAdmin.auth.admin.getUserById(a.user_id)
      return { ...a, email: data?.user?.email || null }
    }))

    res.status(200).json({ ok: true, admins: comEmail })
    return
  }

  if (req.method === "POST") {
    const corpo = req.body || {}
    const nome = (corpo.nome || "").trim()
    const email = (corpo.email || "").trim().toLowerCase()
    const enviarConvite = !!corpo.enviarConvite
    const senhaEscolhida = (corpo.senha || "").trim()

    if (!nome || !email) { res.status(400).json({ erro: "Preencha nome e e-mail." }); return }
    if (!enviarConvite && senhaEscolhida.length < 6) {
      res.status(400).json({ erro: "Defina uma senha com pelo menos 6 caracteres, ou escolha enviar convite por e-mail." })
      return
    }

    let usuarioCriadoId = null
    try {
      if (enviarConvite) {
        const { data, error } = await sbAdmin.auth.admin.inviteUserByEmail(email)
        if (error) throw new Error(error.message)
        usuarioCriadoId = data.user.id
      } else {
        const { data, error } = await sbAdmin.auth.admin.createUser({
          email, password: senhaEscolhida, email_confirm: true
        })
        if (error) throw new Error(error.message)
        usuarioCriadoId = data.user.id
      }

      const { error: erroInsert } = await sbAdmin.from("admins_plataforma").insert({
        user_id: usuarioCriadoId, nome, role: "operacional", ativo: true
      })
      if (erroInsert) throw new Error(erroInsert.message)

      res.status(200).json({
        ok: true,
        conviteEnviado: enviarConvite,
        senhaTemporaria: enviarConvite ? null : senhaEscolhida
      })
    } catch (erro) {
      if (usuarioCriadoId) await sbAdmin.auth.admin.deleteUser(usuarioCriadoId)
      res.status(500).json({ erro: `Não foi possível criar o administrador: ${erro.message}` })
    }
    return
  }

  if (req.method === "PATCH") {
    const corpo = req.body || {}
    const id = corpo.id
    if (!id) { res.status(400).json({ erro: "ID do administrador não informado." }); return }

    const { data: alvo, error: erroAlvo } = await sbAdmin
      .from("admins_plataforma").select("id, user_id, role").eq("id", id).maybeSingle()
    if (erroAlvo || !alvo) { res.status(404).json({ erro: "Administrador não encontrado." }); return }
    if (alvo.role === "fundador") { res.status(403).json({ erro: "Não é possível editar o administrador fundador por aqui." }); return }

    const atualizacaoAdmin = {}
    if (typeof corpo.nome === "string") atualizacaoAdmin.nome = corpo.nome.trim()
    if (typeof corpo.ativo === "boolean") atualizacaoAdmin.ativo = corpo.ativo

    if (Object.keys(atualizacaoAdmin).length) {
      const { error } = await sbAdmin.from("admins_plataforma").update(atualizacaoAdmin).eq("id", id)
      if (error) { res.status(500).json({ erro: error.message }); return }
    }

    const atualizacaoAuth = {}
    if (typeof corpo.email === "string" && corpo.email.trim()) atualizacaoAuth.email = corpo.email.trim().toLowerCase()
    if (typeof corpo.novaSenha === "string" && corpo.novaSenha.trim()) atualizacaoAuth.password = corpo.novaSenha.trim()

    if (Object.keys(atualizacaoAuth).length) {
      const { error } = await sbAdmin.auth.admin.updateUserById(alvo.user_id, atualizacaoAuth)
      if (error) { res.status(500).json({ erro: `Dados salvos, mas houve erro ao atualizar login: ${error.message}` }); return }
    }

    res.status(200).json({ ok: true })
    return
  }

  if (req.method === "DELETE") {
    const corpo = req.body || {}
    const id = corpo.id
    if (!id) { res.status(400).json({ erro: "ID do administrador não informado." }); return }

    const { data: alvo, error: erroAlvo } = await sbAdmin
      .from("admins_plataforma").select("id, role").eq("id", id).maybeSingle()
    if (erroAlvo || !alvo) { res.status(404).json({ erro: "Administrador não encontrado." }); return }
    if (alvo.role === "fundador") { res.status(403).json({ erro: "O administrador fundador não pode ser removido." }); return }

    const { error } = await sbAdmin.from("admins_plataforma").delete().eq("id", id)
    if (error) { res.status(500).json({ erro: error.message }); return }

    res.status(200).json({ ok: true })
    return
  }

  res.status(405).json({ erro: "Método não permitido." })
}