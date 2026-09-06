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

  try {
    const anonKey = process.env.SUPABASE_ANON_KEY
    if (!anonKey) return response

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // nunca segura a página por mais que 3s

    // 1 requisição só, com join embutido, em vez de duas sequenciais
    const supabaseUrl = 'https://bjnnkeutfilbzdhbqqij.supabase.co'
    const url = `${supabaseUrl}/rest/v1/dominios_loja?dominio=eq.${encodeURIComponent(hostname)}&select=loja_id,lojas(nome,tagline,logo_url)`
    const resp = await fetch(url, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      signal: controller.signal
    })
    clearTimeout(timeoutId)

    if (!resp.ok) return response
    const data = await resp.json()
    if (!Array.isArray(data) || !data.length || !data[0].lojas) return response

    const loja = data[0].lojas
    let html = await response.text()

    html = html.replace(
      /<title id="page-title">.*?<\/title>|<title>.*?<\/title>/,
      `<title>${loja.nome}</title>`
    )
    html = html.replace(/(<meta id="og-title"[^>]*content=")[^"]*(")/, `$1${loja.nome}$2`)
    html = html.replace(/(<meta id="og-description"[^>]*content=")[^"]*(")/, `$1${loja.tagline || `Peça já no ${loja.nome}!`}$2`)
    html = html.replace(/(<meta id="og-image"[^>]*content=")[^"]*(")/, `$1${loja.logo_url}$2`)

    const headers = new Headers(response.headers)
    headers.delete('content-length')
    headers.set('cache-control', 'no-store, must-revalidate')

    return new Response(html, { status: 200, headers })
  } catch (erro) {
    console.log('middleware meta-tags: falhou, servindo página padrão —', erro)
    return response // NUNCA deixa a página quebrar por causa disso
  }
}