// ============================================================
// ROTEADOR POR HOSTNAME — Cardápios Web
// Usado tanto por index.html quanto por admin.html (cada um chama
// esse mesmo arquivo, passando via data-pagina-loja qual HTML de
// loja buscar: "index-loja.html" ou "admin-loja.html").
//
// LOJA (qualquer hostname que não seja da própria plataforma):
//   1) remove de vez o conteúdo institucional/Painel de Aluguéis
//      do DOM (não só esconde — evita IDs duplicados, ex: os dois
//      admin.html/admin-loja.html têm #tela-login, #btn-entrar etc.)
//   2) mostra a tela de carregamento
//   3) busca o HTML da loja (fetch, texto puro)
//   4) transplanta pro <head> atual: <title>, <link rel=stylesheet>,
//      <link id="fontes-tema">, <style> e os <script src="./temas.js">
//      / <script src="./config-loja.js"> (nessa ordem — é isso que
//      aplica o tema antes de qualquer coisa aparecer)
//   5) injeta o <body> da loja (sem os <script>) dentro de #app-loja-root
//   6) roda os <script> do <body> da loja em ordem (externos e
//      inline), do jeito que apareceriam se a página fosse carregada
//      direto
//   7) esconde a tela de carregamento
//
// PLATAFORMA (cardapiosweb.online e afins): não faz nada — só
// garante que a tela de carregamento/raiz da loja fiquem escondidas
// (por segurança, caso venham visíveis por engano no HTML).
// ============================================================
;(function () {
    "use strict"

    function ehHostnamePlataforma(hostname) {
        var HOSTS_PLATAFORMA = [
            "cardapiosweb.online",
            "www.cardapiosweb.online",
            "cardapiowebonline.vercel.app",
            "localhost",
            "127.0.0.1"
        ]
        if (HOSTS_PLATAFORMA.indexOf(hostname) !== -1) return true
        // qualquer preview/branch da Vercel deste projeto
        // (ex: cardapioweb-online-git-algumacoisa.vercel.app)
        if (hostname.indexOf(".vercel.app") !== -1) return true
        return false
    }

    // Se um script inline no <head> já calculou isso mais cedo (ver
    // comentário no index.html/admin.html — precisa existir ANTES do
    // script antigo da plataforma, que também depende dessa variável
    // pra saber se deve rodar ou não), reaproveita o valor. Senão,
    // calcula agora mesmo.
    var EH_LOJA = (typeof window.CARDAPIOS_WEB_EH_LOJA === "boolean")
        ? window.CARDAPIOS_WEB_EH_LOJA
        : !ehHostnamePlataforma(window.location.hostname)
    window.CARDAPIOS_WEB_EH_LOJA = EH_LOJA

    // document.currentScript só é válido durante a execução síncrona
    // deste próprio <script> — precisa ser lido AQUI, fora de qualquer
    // callback assíncrono (dentro do DOMContentLoaded ele já seria null).
    var scriptAtual = document.currentScript
    var paginaLoja = scriptAtual ? scriptAtual.getAttribute("data-pagina-loja") : null

    document.addEventListener("DOMContentLoaded", function () {
        var telaCarregamento = document.getElementById("tela-carregamento-loja")
        var raizLoja = document.getElementById("app-loja-root")
        var conteudoPlataforma = document.getElementById("conteudo-plataforma")

        if (!EH_LOJA) {
            // Hostname da própria plataforma: garante que os elementos
            // da loja fiquem fora do caminho, caso existam no HTML.
            if (telaCarregamento) telaCarregamento.style.display = "none"
            if (raizLoja) raizLoja.style.display = "none"
            return
        }

        if (!paginaLoja || !raizLoja) {
            console.error("Roteador Cardápios Web: faltou data-pagina-loja ou #app-loja-root.")
            return
        }

        // Remove (não só esconde) o conteúdo da plataforma — evita IDs
        // duplicados entre a página institucional/Painel de Aluguéis e
        // a página da loja que vai ser injetada.
        if (conteudoPlataforma) conteudoPlataforma.remove()

        if (telaCarregamento) telaCarregamento.style.display = "flex"

        carregarPaginaDaLoja(paginaLoja, raizLoja, telaCarregamento)
    })

    async function carregarPaginaDaLoja(url, raizLoja, telaCarregamento) {
        try {
            const resposta = await fetch(url)
            if (!resposta.ok) throw new Error("HTTP " + resposta.status)
            const html = await resposta.text()

            const doc = new DOMParser().parseFromString(html, "text/html")

            if (doc.title) document.title = doc.title

            // ---- Transplanta assets de <head> (estilos, fontes, tema) ----
            // Ordem importa: temas.js precisa rodar antes de config-loja.js
            // (é config-loja.js que lê TEMAS e aplica as variáveis CSS).
            const seletoresHead = [
                'link[rel="preconnect"]',
                'link[rel="stylesheet"]',
                'link#fontes-tema',
                'style'
            ]
            seletoresHead.forEach(seletor => {
                doc.head.querySelectorAll(seletor).forEach(no => {
                    document.head.appendChild(no.cloneNode(true))
                })
            })

            // Scripts do <head> (temas.js, config-loja.js) — em ordem,
            // aguardando cada um carregar antes do próximo.
            const scriptsHead = Array.from(doc.head.querySelectorAll("script"))
            for (const original of scriptsHead) {
                await executarScriptClonado(original, document.head)
            }

            // ---- Injeta o <body> da loja (sem os <script>, que rodam à parte) ----
            const bodyClone = doc.body.cloneNode(true)
            bodyClone.querySelectorAll("script").forEach(s => s.remove())
            // Copia as classes do <body> da loja (ex: "pb-16 apresentacao-ativa")
            // pro elemento onde o conteúdo é injetado, já que não podemos trocar
            // o <body> real da página (ele já contém a tela de carregamento).
            if (bodyClone.className) raizLoja.className = bodyClone.className
            raizLoja.innerHTML = bodyClone.innerHTML

            // Tema já aplicado, conteúdo já no DOM — pode esconder a
            // tela de carregamento agora. O que ainda falta (produtos,
            // login etc.) é responsabilidade dos scripts da própria loja,
            // que já mostram seu próprio esqueleto/carregamento interno.
            if (telaCarregamento) telaCarregamento.style.display = "none"
            raizLoja.style.display = ""

            // ---- Roda os <script> do <body> da loja, em ordem ----
            const scriptsBody = Array.from(doc.body.querySelectorAll("script"))
            for (const original of scriptsBody) {
                await executarScriptClonado(original, document.body)
            }
        } catch (erro) {
            console.error("Erro ao carregar a página da loja:", erro)
            if (telaCarregamento) {
                telaCarregamento.innerHTML =
                    '<p style="color:#B23A2E;font-family:sans-serif;padding:20px;text-align:center;">' +
                    "Não foi possível carregar esta loja. Tente novamente em instantes." +
                    "</p>"
            }
        }
    }

    // Cria uma cópia "de verdade" de um <script> (src ou inline) e
    // aguarda ele terminar — clonar um <script> com cloneNode() ou
    // jogar via innerHTML NUNCA executa o script; só cria um elemento
    // novo com createElement("script") e anexa é que o navegador roda.
    function executarScriptClonado(original, containerDestino) {
        return new Promise((resolve, reject) => {
            const novo = document.createElement("script")
            Array.from(original.attributes).forEach(attr => {
                novo.setAttribute(attr.name, attr.value)
            })

            if (original.src) {
                novo.onload = () => resolve()
                novo.onerror = () => reject(new Error("Falha ao carregar " + original.src))
                containerDestino.appendChild(novo)
            } else {
                novo.textContent = original.textContent
                containerDestino.appendChild(novo)
                resolve() // script inline roda de forma síncrona ao ser anexado
            }
        })
    }
})()