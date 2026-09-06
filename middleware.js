import { next } from '@vercel/edge'

export const config = {
  matcher: ['/', '/admin.html']
}

const HOSTS_PLATAFORMA = [
  'cardapiosweb.online',
  'www.cardapiosweb.online',
  'cardapiowebonline.vercel.app',
  'localhost',
  '127.0.0.1'
]

function ehHostnamePlataforma(hostname) {
  if (HOSTS_PLATAFORMA.indexOf(hostname) !== -1) return true
  if (hostname.indexOf('.vercel.app') !== -1) return true
  return false
}

export default async function middleware(request) {
  const hostname = request.headers.get('host')?.split(':')[0] || ''

  if (ehHostnamePlataforma(hostname)) {
    return next()
  }

  const response = await next()

  const supabaseUrl = 'https://bjnnkeutfilbzdhbqqij.supabase.co'
  const anonKey = process.env.SUPABASE_ANON_KEY

  const dominioResp = await fetch(
    `${supabaseUrl}/rest/v1/dominios_loja?dominio=eq.${hostname}&select=loja_id`,
    { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } }
  )
  const dominioData = await dominioResp.json()
  if (!dominioData.length) return response

  const lojaId = dominioData[0].loja_id

  const lojaResp = await fetch(
    `${supabaseUrl}/rest/v1/lojas?id=eq.${lojaId}&select=nome,tagline,logo_url`,
    { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } }
  )
  const lojaData = await lojaResp.json()
  if (!lojaData.length) return response

  const loja = lojaData[0]

  return new HTMLRewriter()
    .on('title', { element(el) { el.setInnerContent(loja.nome) } })
    .on('meta[property="og:title"]', { element(el) { el.setAttribute('content', loja.nome) } })
    .on('meta[property="og:description"]', { element(el) { el.setAttribute('content', loja.tagline || `Peça já no ${loja.nome}!`) } })
    .on('meta[property="og:image"]', { element(el) { el.setAttribute('content', loja.logo_url) } })
    .transform(response)
}