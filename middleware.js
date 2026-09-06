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

function headersLimpos(originais) {
  const h = new Headers(originais)
  h.delete('content-length')
  h.delete('etag')
  h.delete('last-modified')
  h.delete('accept-ranges')
  h.set('cache-control', 'no-store, must-revalidate')
  return h
}

export default async function middleware(request) {
  const hostname = request.headers.get('host')?.split(':')[0] || ''
  if (ehHostnamePlataforma(hostname)) {
    return next()
  }
  const response = await next()

  try {
    const anonKey = process.env.SUPABASE_ANON_KEY
    if (!anonKey) {
      const h = headersLimpos(response.headers)
      h.set('x-cw-debug', 'sem-anon-key')
      return new Response(await response.text(), { status: 200, headers: h })
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)

    const supabaseUrl = 'https://bjnnkeutfilbzdhbqqij.supabase.co'
    const url = `${supabaseUrl}/rest/v1/dominios_loja?dominio=eq.${encodeURIComponent(hostname)}&select=loja_id,lojas(nome,tagline,logo_url)`
    const resp = await fetch(url, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      signal: controller.signal
    })
    clearTimeout(timeoutId)

    if (!resp.ok) {
      const h = headersLimpos(response.headers)
      h.set('x-cw-debug', 'supabase-http-' + resp.status)
      return new Response(await response.text(), { status: 200, headers: h })
    }

    const data = await resp.json()
    if (!Array.isArray(data) || !data.length || !data[0].lojas) {
      const h = headersLimpos(response.headers)
      h.set('x-cw-debug', 'sem-match-dominio-hostname:' + hostname)
      return new Response(await response.text(), { status: 200, headers: h })
    }

    const loja = data[0].lojas
    let html = await response.text()

    html = html.replace(
      /<title id="page-title">.*?<\/title>|<title>.*?<\/title>/,
      `<title>${loja.nome}</title>`
    )
    html = html.replace(/(<meta id="og-title"[^>]*content=")[^"]*(")/, `$1${loja.nome}$2`)
    html = html.replace(/(<meta id="og-description"[^>]*content=")[^"]*(")/, `$1${loja.tagline || `Peça já no ${loja.nome}!`}$2`)

    // og:image precisa ser URL absoluta (o valor no banco já costuma vir
    // completo, tipo o da Pizzaria Natureza — mas blindando pro caso de
    // vir relativo ou vazio)
    const imagemAbsoluta = loja.logo_url && loja.logo_url.startsWith('http')
      ? loja.logo_url
      : `https://${hostname}/assets/img/logo.png`
    html = html.replace(/(<meta id="og-image"[^>]*content=")[^"]*(")/, `$1${imagemAbsoluta}$2`)

    const headers = headersLimpos(response.headers)
    headers.set('x-cw-debug', 'ok-reescreveu')

    return new Response(html, { status: 200, headers })
  } catch (erro) {
    const h = headersLimpos(response.headers)
    h.set('x-cw-debug', 'erro:' + String(erro).slice(0, 100))
    return new Response(await response.text(), { status: 200, headers: h })
  }
}