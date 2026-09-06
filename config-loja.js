// ============================================================
// CONFIGURAÇÃO DA LOJA — versão multi-tenant (piloto)
// ------------------------------------------------------------
// Antes: TEMA / MODO_LOJA / TEXTOS / ABAS_ADMIN eram constantes
// fixas neste arquivo — um arquivo por cliente/repositório.
// Agora: esses dados vêm do banco (colunas tema / modo_loja /
// textos / abas_admin na tabela "lojas") e chegam pelo
// supabase-loader.js, que chama window.aplicarConfiguracaoDaLoja(loja)
// assim que a busca termina.
//
// Este arquivo continua sendo carregado nos mesmos dois lugares de
// sempre (index.html e admin.html), na mesma ordem (depois de
// temas.js) — só deixou de rodar sozinho no <head> e passou a
// esperar ser chamado.
//
// IMPORTANTE — ordem de carregamento / "flash" de tema:
// Como o tema agora depende de uma busca assíncrona no banco, ele
// não pode mais ser aplicado antes da primeira pintura da página
// (como acontecia quando TEMA era uma constante conhecida na hora
// do carregamento). Isso significa um pequeno instante com o tema
// genérico/reserva até os dados da loja chegarem — normalmente
// imperceptível, já que a busca é rápida, mas é uma troca real da
// nova arquitetura, não um detalhe escondido. Se um dia isso
// incomodar, dá pra amenizar guardando o último tema usado por
// hostname no localStorage e aplicando ele otimisticamente antes
// da busca confirmar.
// ============================================================

// Usados quando a loja não tem "textos"/"abas_admin" configurado no
// banco (colunas nulas) — cobre o caso de uma loja nova, cadastrada
// só com o essencial, sem precisar preencher tudo de cara.
const TEXTOS_PADRAO = {
    diferenciais: [],
    comoFunciona: null,
    ctaFinal: null,
    heroCtas: { primaria: "Ver cardápio", secundaria: "Chamar no WhatsApp" },
    seloCarimbo: null,
    apresentacao: { botaoPrincipal: "Ver cardápio completo", passos: [] },
}

const ABAS_ADMIN_PADRAO = [
    { id: "historico-delivery", label: "Delivery", icone: "fa-motorcycle", posicao: "nav", requer: "usaDelivery", bolinha: "bolinha-historico-delivery" },
    { id: "produtos", label: "Produtos", icone: "fa-utensils", posicao: "nav", requer: null },
    { id: "dashboard", label: "Dashboard", icone: "fa-gauge", posicao: "menu", requer: null },
    { id: "loja", label: "Dados da loja", icone: "fa-store", posicao: "menu", requer: null },
]

// ------------------------------------------------------------
// PONTO DE ENTRADA — chamado pelo supabase-loader.js assim que os
// dados da loja (incluindo tema/modoLoja/textos/abasAdmin) chegam.
// ------------------------------------------------------------
window.aplicarConfiguracaoDaLoja = function (loja) {
    const tema = (window.TEMAS && window.TEMAS[loja.tema]) || window.TEMAS.generico
    if (!window.TEMAS || !window.TEMAS[loja.tema]) {
        console.warn(`Tema "${loja.tema}" não encontrado em temas.js — usando "generico" como reserva.`)
    }

    window.TEMA_ATUAL = tema
    window.MODO_LOJA = loja.modoLoja
    window.TEXTOS = { ...TEXTOS_PADRAO, ...(loja.textos || {}) }
    window.ABAS_ADMIN = loja.abasAdmin || ABAS_ADMIN_PADRAO

    aplicarVariaveisCss(tema)
    aplicarFontesGoogle(tema)
    aplicarIconeFallbackLogo(tema)
    aplicarTextos()

    // As funções abaixo só existem no admin.html (definidas no
    // <script> principal dele). No index.html (site público) elas
    // não existem e são simplesmente ignoradas aqui.
    if (window.renderizarAbasAdmin) window.renderizarAbasAdmin()
    if (window.aplicarModoAcessoRapido) window.aplicarModoAcessoRapido()
    if (window.aplicarModoFormularioProduto) window.aplicarModoFormularioProduto()
    if (window.aplicarModoCamposLoja) window.aplicarModoCamposLoja()
}

function aplicarVariaveisCss(tema) {
    const raiz = document.documentElement.style
    raiz.setProperty("--laranja", tema.cores.principal)
    raiz.setProperty("--laranja-escuro", tema.cores.principalEscura)
    raiz.setProperty("--laranja-claro", tema.cores.principalClara)
    raiz.setProperty("--carvao", tema.cores.base)
    raiz.setProperty("--carvao-suave", tema.cores.baseSuave)
    raiz.setProperty("--creme", tema.cores.fundo)
    raiz.setProperty("--dourado", tema.cores.destaque)
    raiz.setProperty("--verde-manjericao", tema.cores.selo)
    raiz.setProperty("--linha", tema.cores.linha)

    // Mesmas cores, com os nomes que o admin.html usa (o admin tem
    // seu próprio CSS com nomes de variável diferentes; isso evita
    // duplicar o CSS ou renomear variáveis lá).
    raiz.setProperty("--tinta", tema.cores.principal)
    raiz.setProperty("--tinta-escura", tema.cores.principalEscura)
    raiz.setProperty("--tinta-clara", tema.cores.principalClara)

    raiz.setProperty("--fonte-titulo", `'${tema.fontes.titulo}', serif`)
    raiz.setProperty("--fonte-texto", `'${tema.fontes.texto}', sans-serif`)
    raiz.setProperty("--fonte-script", `'${tema.fontes.script}', cursive`)
}

function aplicarFontesGoogle(tema) {
    const linkFontes = document.getElementById("fontes-tema")
    if (!linkFontes) return
    const familias = [
        `${tema.fontes.titulo}:wght@500;600;700;800`,
        `${tema.fontes.texto}:wght@400;500;600;700`,
        `${tema.fontes.script}:wght@600;700`
    ].join("&family=")
    linkFontes.href = `https://fonts.googleapis.com/css2?family=${familias}&display=swap`
}

// Ícone de fallback do logo + alt text — só existe no index.html;
// no admin.html essas buscas simplesmente não encontram nada.
function aplicarIconeFallbackLogo(tema) {
    const iconeFallback = document.querySelector("#header-banner .selo i")
    if (iconeFallback) {
        iconeFallback.className = `fa ${tema.iconeFallbackLogo} text-5xl`
        iconeFallback.style.color = "var(--laranja)"
    }
    const logoImg = document.getElementById("logo-img")
    if (logoImg) logoImg.setAttribute("alt", tema.textoAltLogo)
}

// Usado pelas fotos de produto que falham ao carregar (chamado via
// onerror="imagemFallbackProduto(this)" no HTML/JS). Lê o tema atual
// em vez de depender de uma constante fixa.
window.imagemFallbackProduto = function (img, tamanho = "480x360") {
    img.onerror = null
    const tema = window.TEMA_ATUAL || (window.TEMAS && window.TEMAS.generico)
    const cor = (tema ? tema.cores.principal : "#A9321E").replace("#", "")
    const emoji = tema ? tema.emojiPlaceholder : "🍽️"
    img.src = `https://placehold.co/${tamanho}/${cor}/white?text=${encodeURIComponent(emoji)}`
}

// ------------------------------------------------------------
// APLICAÇÃO DOS TEXTOS (window.TEXTOS) NO index.html
// ------------------------------------------------------------
// Preenche os textos do hero, diferenciais, como funciona, CTA
// final e tela de apresentação a partir de window.TEXTOS (montado
// acima a partir do banco + TEXTOS_PADRAO). Só existe efeito no
// index.html — no admin.html essas buscas não encontram nada e a
// função sai sem fazer nada (guardas abaixo).
// Corpo idêntico ao da versão anterior — só a fonte dos dados mudou.
// ------------------------------------------------------------
function aplicarTextos() {
    const t = window.TEXTOS
    if (!t) return

    // ---- Hero (botões "Ver cardápio" / "Chamar no WhatsApp") ----
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

    // ---- Diferenciais ----
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

    // ---- Como funciona (seção completa, se existir no HTML) ----
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

    // ---- Selo "carimbo" no logo (opcional) ----
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

    // ---- CTA final ----
    const ctaTitulo = document.querySelector(".cta-final-titulo")
    const ctaDesc = document.querySelector(".cta-final-desc")
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

    // ---- Tela de apresentação (splash) ----
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