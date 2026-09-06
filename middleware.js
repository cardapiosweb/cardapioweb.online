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

  let html = await response.text()

  html = html.replace(
    /<title id="page-title">.*?<\/title>|<title>.*?<\/title>/,
    `<title>${loja.nome}</title>`
  )
  html = html.replace(
    /(<meta id="og-title"[^>]*content=")[^"]*(")/,
    `$1${loja.nome}$2`
  )
  html = html.replace(
    /(<meta id="og-description"[^>]*content=")[^"]*(")/,
    `$1${loja.tagline || `Peça já no ${loja.nome}!`}$2`
  )
  html = html.replace(
    /(<meta id="og-image"[^>]*content=")[^"]*(")/,
    `$1${loja.logo_url}$2`
  )

  const headers = new Headers(response.headers)
  headers.delete('content-length')

  return new Response(html, {
    status: response.status,
    headers
  })
}