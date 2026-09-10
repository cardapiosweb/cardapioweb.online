// ============================================================
// CONFIGURAÇÃO DE LOJA — CÓDIGO COMPARTILHADO POR TODAS AS LOJAS
// ------------------------------------------------------------
// Este arquivo não tem mais dados fixos de nenhuma loja. Quem
// chama window.aplicarConfiguracaoDaLoja(loja) é o
// supabase-loader.js, depois de buscar a linha da loja no Supabase
// (ver o final desse arquivo: document.dispatchEvent(new
// Event("dadosDaLojaProntos")) dispara depois disso).
//
// "loja" é o objeto já tratado pelo supabase-loader.js (camelCase),
// com os campos: tema, modoLoja, textos, abasAdmin, corPrincipal,
// corPrincipalEscura, corPrincipalClara, corBg, corAcento, etc.
//
// Se modoLoja / textos / abasAdmin vierem null do banco (loja
// ainda não migrada), os padrões abaixo são usados no lugar.
// ============================================================

const MODO_LOJA_PADRAO = {
    permiteDelivery: true,
    permiteRetirada: true,
    usaMesa: false,
    usaDelivery: true,
    usaEncomenda: false,
}

// TEXTOS_PADRAO agora é gerado a partir do tema escolhido, em vez de um
// objeto fixo único: o ícone do primeiro diferencial passa a ser o
// mesmo ícone do tema (tema.iconeFallbackLogo), em vez de uma estrela
// genérica igual pra todo mundo. Se algum tema precisar de textos
// completamente diferentes no futuro, basta declarar um campo
// "textosPadrao" dentro dele em temas.js — essa função usa ele no
// lugar do padrão gerado aqui, sem precisar mudar nada neste arquivo.
function gerarTextosPadrao(tema) {
    if (tema.textosPadrao) return tema.textosPadrao

    return {
        diferenciais: [
            { icone: `fa ${tema.iconeFallbackLogo}`, titulo: "Qualidade", desc: "Produtos selecionados com cuidado." },
            { icone: "fa fa-clock", titulo: "Rapidez", desc: "Seu pedido pronto no menor tempo possível." },
            { icone: "fa fa-wallet", titulo: "Pague como quiser", desc: "Pix, dinheiro ou cartão na entrega ou retirada." },
            { icone: "fab fa-whatsapp", titulo: "Fala com a gente", desc: "Dúvida em algo? É só chamar no WhatsApp." },
        ],
        comoFunciona: {
            titulo: "Como funciona",
            subtitulo: "Peça em poucos passos, sem complicação.",
            passos: [
                { icone: "fa fa-list", titulo: "Monte seu pedido", desc: "Escolha os itens do cardápio e adicione ao carrinho." },
                { icone: "fa fa-route", titulo: "Escolha como receber", desc: "Entrega, retirada no balcão ou direto da sua mesa." },
                { icone: "fab fa-whatsapp", titulo: "Confirme no WhatsApp", desc: "Seu pedido segue direto pra cozinha." },
            ],
        },
        ctaFinal: {
            titulo: "Bateu aquela vontade?",
            desc: "Monte seu pedido agora, é rapidinho.",
            botao: "Ver meu pedido",
        },
        heroCtas: { primaria: "Ver cardápio", secundaria: "Chamar no WhatsApp" },
        seloCarimbo: null,
        rodapeDescricao: "Produtos selecionados com cuidado, prontos pra pedir pelo delivery e chegar rapidinho até você.",
        apresentacao: {
            botaoPrincipal: "Ver cardápio completo",
            passos: [
                { icone: "fa fa-list", titulo: "Monte seu pedido", desc: "Escolha os itens do cardápio e adicione ao carrinho." },
                { icone: "fa fa-route", titulo: "Escolha como receber", desc: "Entrega, retirada no balcão ou direto da sua mesa." },
                { icone: "fab fa-whatsapp", titulo: "Confirme no WhatsApp", desc: "Seu pedido segue direto pra cozinha." },
            ],
        },
    }
}

const ABAS_ADMIN_PADRAO = [
    { id: "garcom", label: "Garçom", icone: "fa-bell-concierge", posicao: "nav", requer: "usaMesa", bolinha: "bolinha-garcom" },
    { id: "mesas", label: "Mesas", icone: "fa-chair", posicao: "nav", requer: "usaMesa", bolinha: "bolinha-mesas" },
    { id: "historico-delivery", label: "Delivery", icone: "fa-motorcycle", posicao: "nav", requer: "usaDelivery", bolinha: "bolinha-historico-delivery" },
    { id: "encomendas", label: "Encomendas", icone: "fa-cake-candles", posicao: "nav", requer: "usaEncomenda" },
    { id: "produtos", label: "Produtos", icone: "fa-utensils", posicao: "nav", requer: null },
    { id: "historico-mesa", label: "Histórico Mesa", icone: "fa-receipt", posicao: "menu", requer: "usaMesa" },
    { id: "dashboard", label: "Dashboard", icone: "fa-gauge", posicao: "menu", requer: null },
    { id: "loja", label: "Dados da loja", icone: "fa-store", posicao: "menu", requer: null },
]

// ------------------------------------------------------------
// Lê um campo aceitando tanto o nome em camelCase (formato que o
// supabase-loader.js do site público entrega) quanto snake_case
// (formato bruto, direto do Supabase — usado pelo admin-loja.html,
// que não faz nenhuma transformação antes de chamar esta função).
// ------------------------------------------------------------
function campoLoja(loja, nomeCamel, nomeSnake) {
    if (loja[nomeCamel] !== undefined && loja[nomeCamel] !== null) return loja[nomeCamel]
    return loja[nomeSnake]
}

// ------------------------------------------------------------
// FUNÇÃO PRINCIPAL — chamada pelo supabase-loader.js e pelo admin-loja.html
// ------------------------------------------------------------
window.aplicarConfiguracaoDaLoja = function (loja) {
    try {
        const nomeTema = loja.tema || "generico"
        const tema = (window.TEMAS && window.TEMAS[nomeTema]) || window.TEMAS.generico
        if (!window.TEMAS || !window.TEMAS[nomeTema]) {
            console.warn(`Tema "${nomeTema}" não encontrado em temas.js — usando "generico" como reserva.`)
        }
        window.TEMA_ATUAL = tema

        window.MODO_LOJA = campoLoja(loja, "modoLoja", "modo_loja") || MODO_LOJA_PADRAO
        window.TEXTOS = loja.textos || gerarTextosPadrao(tema)
        window.ABAS_ADMIN = campoLoja(loja, "abasAdmin", "abas_admin") || ABAS_ADMIN_PADRAO

        // ---- Variáveis CSS de cor ----
        const corPrincipal = campoLoja(loja, "corPrincipal", "cor_principal")
        const corPrincipalEscura = campoLoja(loja, "corPrincipalEscura", "cor_principal_escura")
        const corPrincipalClara = campoLoja(loja, "corPrincipalClara", "cor_principal_clara")
        const corBg = campoLoja(loja, "corBg", "cor_bg")
        const corAcento = campoLoja(loja, "corAcento", "cor_acento")

        const raiz = document.documentElement.style
        raiz.setProperty("--laranja", corPrincipal || tema.cores.principal)
        raiz.setProperty("--laranja-escuro", corPrincipalEscura || tema.cores.principalEscura)
        raiz.setProperty("--laranja-claro", corPrincipalClara || tema.cores.principalClara)
        raiz.setProperty("--carvao", tema.cores.base)
        raiz.setProperty("--carvao-suave", tema.cores.baseSuave)
        raiz.setProperty("--creme", corBg || tema.cores.fundo)
        raiz.setProperty("--dourado", corAcento || tema.cores.destaque)
        raiz.setProperty("--verde-manjericao", tema.cores.selo)
        raiz.setProperty("--linha", tema.cores.linha)

        raiz.setProperty("--tinta", corPrincipal || tema.cores.principal)
        raiz.setProperty("--tinta-escura", corPrincipalEscura || tema.cores.principalEscura)
        raiz.setProperty("--tinta-clara", corPrincipalClara || tema.cores.principalClara)

        // ---- Formas (raio de borda / espessura) ----
        const formas = tema.formas || { raioBase: "14px", raioGrande: "20px", raioPill: "999px", bordaEspessura: "1.5px", bordaEstilo: "solid" }
        raiz.setProperty("--raio-base", formas.raioBase)
        raiz.setProperty("--raio-grande", formas.raioGrande)
        raiz.setProperty("--raio-pill", formas.raioPill)
        raiz.setProperty("--borda-espessura", formas.bordaEspessura)
        raiz.setProperty("--borda-estilo", formas.bordaEstilo)

        // ---- Fontes ----
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

        // ---- Fallback de foto de produto ----
        window.imagemFallbackProduto = function (img, tamanho = "480x360") {
            img.onerror = null
            const cor = (corPrincipal || tema.cores.principal).replace("#", "")
            img.src = `https://placehold.co/${tamanho}/${cor}/white?text=${encodeURIComponent(tema.emojiPlaceholder)}`
        }

        // ---- Ícone de fallback do logo + alt text ----
        const iconeFallback = document.querySelector("#header-banner .selo i")
        if (iconeFallback) {
            iconeFallback.className = `fa ${tema.iconeFallbackLogo} text-5xl`
            iconeFallback.style.color = "var(--laranja)"
        }
        const logoImg = document.getElementById("logo-img")
        if (logoImg) logoImg.setAttribute("alt", tema.textoAltLogo)

        // ---- Favicon herdado do emoji do tema (SVG gerado na hora,
        //      sem depender de link externo tipo icons8) ----
        const faviconLink = document.getElementById("favicon-tema")
        if (faviconLink) {
            const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="76">${tema.emojiPlaceholder}</text></svg>`
            faviconLink.href = `data:image/svg+xml,${encodeURIComponent(svgFavicon)}`
        }

        // ---- Ícones que seguem o mesmo símbolo do tema (mesmo
        //      iconeFallbackLogo do logo/selo): botão "Ver cardápio" do
        //      topo, botão da tela de apresentação e marca do rodapé ----
        document.querySelectorAll("#hero-cta-icone, #apresentacao-btn-icone, #rodape-marca-icone-i")
            .forEach(icone => { icone.className = `fa ${tema.iconeFallbackLogo}` })

        aplicarTextos()
    } catch (erro) {
        // Nunca deixa a página quebrada sem explicação — se algo
        // falhar aqui, pelo menos aparece no console em vez de
        // sumir texto silenciosamente.
        console.error("Erro em aplicarConfiguracaoDaLoja:", erro)
    }

    // ------------------------------------------------------------
    // APLICAÇÃO DOS TEXTOS (window.TEXTOS) NO index-loja.html
    // ------------------------------------------------------------
    function aplicarTextos() {
        const t = window.TEXTOS
        if (!t) return

        const heroPrimaria = document.querySelector(".hero-cta-primaria")
        const heroSecundaria = document.querySelector(".hero-cta-secundaria")
        if (heroPrimaria && t.heroCtas) {
            const icone = heroPrimaria.querySelector("i")
            heroPrimaria.innerHTML = ""
            if (icone) heroPrimaria.appendChild(icone)
            heroPrimaria.append(" " + t.heroCtas.primaria)
        }
        if (heroSecundaria && t.heroCtas) {
            const icone = heroSecundaria.querySelector("i")
            heroSecundaria.innerHTML = ""
            if (icone) heroSecundaria.appendChild(icone)
            heroSecundaria.append(" " + t.heroCtas.secundaria)
        }

        const diferenciaisGrid = document.querySelector("#diferenciais .diferenciais-grid")
        if (diferenciaisGrid && Array.isArray(t.diferenciais)) {
            diferenciaisGrid.innerHTML = t.diferenciais.map(item => `
                <div class="diferencial-card">
                    <span class="diferencial-icone"><i class="${item.icone}"></i></span>
                    <p class="diferencial-titulo">${item.titulo}</p>
                    <p class="diferencial-desc">${item.desc}</p>
                </div>
            `).join("")
        }

        const comoFuncionaTitulo = document.querySelector("#como-funciona .secao-titulo")
        const comoFuncionaSubtitulo = document.querySelector("#como-funciona .secao-subtitulo")
        const comoFuncionaGrid = document.querySelector("#como-funciona .passos-grid")
        if (t.comoFunciona) {
            if (comoFuncionaTitulo) comoFuncionaTitulo.textContent = t.comoFunciona.titulo
            if (comoFuncionaSubtitulo) comoFuncionaSubtitulo.textContent = t.comoFunciona.subtitulo
            if (comoFuncionaGrid && Array.isArray(t.comoFunciona.passos)) {
                comoFuncionaGrid.innerHTML = t.comoFunciona.passos.map((passo, i) => `
                    <div class="passo-card">
                        <span class="passo-numero">${String(i + 1).padStart(2, "0")}</span>
                        <span class="passo-icone"><i class="${passo.icone}"></i></span>
                        <p class="passo-titulo">${passo.titulo}</p>
                        <p class="passo-desc">${passo.desc}</p>
                    </div>
                `).join("")
            }
        }

        const seloCarimbo = document.querySelector(".selo-carimbo")
        if (seloCarimbo) {
            if (t.seloCarimbo && (t.seloCarimbo.linha1 || t.seloCarimbo.linha2)) {
                const span = seloCarimbo.querySelector("span")
                if (span) span.innerHTML = [t.seloCarimbo.linha1, t.seloCarimbo.linha2].filter(Boolean).join("<br>")
                seloCarimbo.style.display = "flex"
            } else {
                seloCarimbo.style.display = "none"
            }
        }

        const ctaTitulo = document.querySelector(".cta-final-titulo")
        const ctaDesc = document.querySelector(".cta-final-desc")
        const rodapeDescricao = document.getElementById("rodape-descricao")
        if (rodapeDescricao && t.rodapeDescricao) {
            rodapeDescricao.textContent = t.rodapeDescricao
        }
        const ctaBotao = document.querySelector(".cta-final-btn")
        if (t.ctaFinal) {
            if (ctaTitulo) ctaTitulo.textContent = t.ctaFinal.titulo
            if (ctaDesc) ctaDesc.textContent = t.ctaFinal.desc
            if (ctaBotao) {
                const icone = ctaBotao.querySelector("i")
                ctaBotao.innerHTML = ""
                if (icone) ctaBotao.appendChild(icone)
                ctaBotao.append(" " + t.ctaFinal.botao)
            }
        }

        const apresentacaoBotao = document.getElementById("apresentacao-ver-cardapio")
        const apresentacaoPassos = document.querySelector(".apresentacao-passos")
        if (t.apresentacao) {
            if (apresentacaoBotao) {
                const icone = apresentacaoBotao.querySelector("i")
                apresentacaoBotao.innerHTML = ""
                if (icone) apresentacaoBotao.appendChild(icone)
                apresentacaoBotao.append(" " + t.apresentacao.botaoPrincipal)
            }
            if (apresentacaoPassos && Array.isArray(t.apresentacao.passos)) {
                apresentacaoPassos.innerHTML = t.apresentacao.passos.map(passo => `
                    <div class="apresentacao-passo-card">
                        <span class="apresentacao-passo-icone"><i class="${passo.icone}"></i></span>
                        <span class="apresentacao-passo-textos">
                            <p class="apresentacao-passo-titulo">${passo.titulo}</p>
                            <p class="apresentacao-passo-desc">${passo.desc}</p>
                        </span>
                    </div>
                `).join("")
            }
        }
    }
}