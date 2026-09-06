window.aplicarConfiguracaoDaLoja = function (loja) {
    const nomeTema = loja.tema || "generico"
    const tema = (window.TEMAS && window.TEMAS[nomeTema]) || window.TEMAS.generico
    if (!window.TEMAS || !window.TEMAS[nomeTema]) {
        console.warn(`Tema "${nomeTema}" não encontrado em temas.js — usando "generico" como reserva.`)
    }
    window.TEMA_ATUAL = tema

    window.MODO_LOJA = loja.modoLoja || MODO_LOJA_PADRAO
    window.TEXTOS = loja.textos || TEXTOS_PADRAO
    window.ABAS_ADMIN = loja.abasAdmin || ABAS_ADMIN_PADRAO

    const raiz = document.documentElement.style
    raiz.setProperty("--laranja", loja.corPrincipal || tema.cores.principal)
    raiz.setProperty("--laranja-escuro", loja.corPrincipalEscura || tema.cores.principalEscura)
    raiz.setProperty("--laranja-claro", loja.corPrincipalClara || tema.cores.principalClara)
    raiz.setProperty("--carvao", tema.cores.base)
    raiz.setProperty("--carvao-suave", tema.cores.baseSuave)
    raiz.setProperty("--creme", loja.corBg || tema.cores.fundo)
    raiz.setProperty("--dourado", loja.corAcento || tema.cores.destaque)
    raiz.setProperty("--verde-manjericao", tema.cores.selo)
    raiz.setProperty("--linha", tema.cores.linha)

    raiz.setProperty("--tinta", loja.corPrincipal || tema.cores.principal)
    raiz.setProperty("--tinta-escura", loja.corPrincipalEscura || tema.cores.principalEscura)
    raiz.setProperty("--tinta-clara", loja.corPrincipalClara || tema.cores.principalClara)

    raiz.setProperty("--fonte-titulo", `'${tema.fontes.titulo}', serif`)
    raiz.setProperty("--fonte-texto", `'${tema.fontes.texto}', sans-serif`)
    raiz.setProperty("--fonte-script", `'${tema.fontes.script}', cursive`)

    const linkFontes = document.getElementById("fontes-tema")
    if (linkFontes) {
        const familias = [
            `${tema.fontes.titulo}:wght@500;600;700;800`,
            `${tema.fontes.texto}:wght@400;500;600;700`,
            `${tema.fontes.script}:wght@600;700`
        ].join("&family=")
        linkFontes.href = `https://fonts.googleapis.com/css2?family=${familias}&display=swap`
    }

    window.imagemFallbackProduto = function (img, tamanho = "480x360") {
        img.onerror = null
        const cor = (loja.corPrincipal || tema.cores.principal).replace("#", "")
        img.src = `https://placehold.co/${tamanho}/${cor}/white?text=${encodeURIComponent(tema.emojiPlaceholder)}`
    }

    const iconeFallback = document.querySelector("#header-banner .selo i")
    if (iconeFallback) {
        iconeFallback.className = `fa ${tema.iconeFallbackLogo} text-5xl`
        iconeFallback.style.color = "var(--laranja)"
    }
    const logoImg = document.getElementById("logo-img")
    if (logoImg) logoImg.setAttribute("alt", tema.textoAltLogo)

    aplicarTextos()

    function aplicarTextos() {
        // ... (mesmo corpo de antes, sem alterações)
    }
}