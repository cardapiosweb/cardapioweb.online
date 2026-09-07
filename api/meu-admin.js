const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

module.exports = async (req, res) => {
  const sbAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
  const token = (req.headers.authorization || "").replace("Bearer ", "")
  if (!token) { res.status(401).json({ erro: "Não autenticado." }); return }

  const { data: dadosToken, error: erroToken } = await sbAdmin.auth.getUser(token)
  if (erroToken || !dadosToken?.user) { res.status(401).json({ erro: "Sessão inválida." }); return }

  const { data: admin, error } = await sbAdmin
    .from("admins_plataforma")
    .select("nome, role, ativo")
    .eq("user_id", dadosToken.user.id)
    .maybeSingle()

  if (error || !admin || !admin.ativo) {
    res.status(403).json({ erro: "Você não tem permissão de administrador da plataforma." })
    return
  }

  res.status(200).json({ ok: true, nome: admin.nome, role: admin.role })
}