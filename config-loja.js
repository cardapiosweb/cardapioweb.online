// ============================================================
// CONFIGURAÇÃO DESTE CLIENTE
// ------------------------------------------------------------
// Único arquivo que você precisa editar ao criar o site de um
// cliente novo (além de preencher os dados no admin.html).
//
// Escolha um dos temas cadastrados em temas.js:
//   "pizzaria", "churrascaria", "hamburgueria",
//   "doceria", "acaiteria", "generico"
//
// Pra criar um tema novo, edite temas.js — não precisa mexer
// no resto deste arquivo.
//
// Este arquivo é usado tanto pelo index.html (site público)
// quanto pelo admin.html (painel) — os dois carregam:
//   <script src="./temas.js"></script>
//   <script src="./config-loja.js"></script>
// ============================================================

const TEMA = "pizzaria"

// ------------------------------------------------------------
// MODO DE ATENDIMENTO DESTE CLIENTE
// ------------------------------------------------------------
// Controla quais opções de "Como quer receber?" aparecem no
// carrinho (site) e quais abas aparecem no painel admin. O modo
// Mesa em si (ativado pela URL ?mesa=) continua 100% automático,
// não precisa configurar nada aqui pra isso funcionar — usaMesa
// só decide se as abas de mesa aparecem no admin.
//
//   permiteDelivery: true  -> mostra a opção "Entrega" no carrinho
//   permiteRetirada: true  -> mostra a opção "Retirada na loja"
//   usaMesa: true           -> mostra Garçom/Mesas/Histórico Mesa no admin
//   usaDelivery: true       -> mostra a aba Delivery no admin
//   usaEncomenda: true      -> mostra a aba Encomendas no admin e o
//                              checkbox "Produto sob encomenda" no
//                              cadastro de produto
//
// Se só um dos dois (permiteDelivery/permiteRetirada) for true, a
// opção fica travada automaticamente no carrinho e o site já assume
// ela como padrão. Se os DOIS forem false (loja que só faz encomenda,
// sem entrega nem retirada configuradas), o carrinho assume retirada
// implícita — não pede endereço, o combinado é o cliente buscar na
// data agendada da encomenda.
const MODO_LOJA = {
    permiteDelivery: true,
    permiteRetirada: true,
    usaMesa: false,
    usaDelivery: true,
    usaEncomenda: false,
}
window.MODO_LOJA = MODO_LOJA

// ------------------------------------------------------------
// ABAS DO PAINEL ADMIN — ORDEM E POSIÇÃO
// ------------------------------------------------------------
// Controla a ordem de exibição e se cada aba aparece na barra
// inferior (nav) ou no menu (⋮) no canto superior direito.
// "Início" não entra nessa lista — ela é sempre a primeira aba da
// barra inferior, em toda loja.
//
//   posicao: "nav"  -> aparece na barra inferior
//   posicao: "menu" -> aparece no menu (⋮)
//   requer: null / "usaMesa" / "usaDelivery" -> some sozinha se a
//           respectiva flag do MODO_LOJA acima for false
//
// A ordem deste array é a ordem de exibição dentro de cada lugar
// (nav ou menu) — pra mudar a ordem, é só reordenar as linhas.
const ABAS_ADMIN = [
    { id: "garcom",            label: "Garçom",         icone: "fa-bell-concierge", posicao: "nav",  requer: "usaMesa",     bolinha: "bolinha-garcom" },
    { id: "mesas",              label: "Mesas",          icone: "fa-chair",          posicao: "nav",  requer: "usaMesa",     bolinha: "bolinha-mesas" },
    { id: "historico-delivery", label: "Delivery",       icone: "fa-motorcycle",     posicao: "nav",  requer: "usaDelivery", bolinha: "bolinha-historico-delivery" },
    { id: "encomendas",         label: "Encomendas",     icone: "fa-cake-candles",   posicao: "nav", requer: "usaEncomenda" },
    { id: "produtos",           label: "Produtos",       icone: "fa-utensils",       posicao: "nav",  requer: null },
    { id: "historico-mesa",     label: "Histórico Mesa", icone: "fa-receipt",        posicao: "menu", requer: "usaMesa" },
    { id: "dashboard",          label: "Dashboard",      icone: "fa-gauge",          posicao: "menu", requer: null },
    { id: "loja",               label: "Dados da loja",  icone: "fa-store",          posicao: "menu", requer: null },
]
window.ABAS_ADMIN = ABAS_ADMIN

// ------------------------------------------------------------
// TEXTOS DO SITE — CONTEÚDO EDITÁVEL DESTA LOJA
// ------------------------------------------------------------
// Tudo que é texto "de marketing" da página (diferenciais, passos
// do "como funciona", CTA final, labels dos botões do hero e da
// tela de apresentação) fica centralizado aqui. O index.html só
// tem a estrutura (divs/classes) — quem preenche o conteúdo é a
// função aplicarTextos() lá embaixo neste arquivo.
//
// Pra trocar qualquer texto do site desta loja, edite só aqui —
// não precisa mexer no index.html.
const TEXTOS = {
    diferenciais: [
        { icone: "fa fa-fire",         titulo: "Forno a lenha",        desc: "Pizzas assadas na hora do seu pedido, no ponto certo." },
        { icone: "fa fa-leaf",         titulo: "Ingredientes frescos", desc: "Selecionados todos os dias antes de ir pro forno." },
        { icone: "fa fa-wallet",       titulo: "Pague como quiser",    desc: "Pix, dinheiro ou cartão na entrega ou retirada." },
        { icone: "fab fa-whatsapp",    titulo: "Fala com a gente",     desc: "Dúvida em algum sabor? É só chamar no WhatsApp." },
    ],

    comoFunciona: {
        titulo: "Como funciona",
        subtitulo: "Peça em poucos passos, sem complicação.",
        passos: [
            { icone: "fa fa-pizza-slice",  titulo: "Monte seu pedido",     desc: "Escolha as pizzas no cardápio e adicione ao carrinho." },
            { icone: "fa fa-route",        titulo: "Escolha como receber", desc: "Entrega, retirada no balcão ou direto da sua mesa." },
            { icone: "fab fa-whatsapp",    titulo: "Confirme no WhatsApp", desc: "Seu pedido segue direto pra cozinha." },
        ],
    },

    ctaFinal: {
        titulo: "Bateu aquela fome?",
        desc: "Sua pizza favorita está a poucos toques de distância. Monte seu pedido agora.",
        botao: "Ver meu pedido",
    },

    heroCtas: {
        primaria: "Ver cardápio",
        secundaria: "Chamar no WhatsApp",
    },

    // Selo "carimbo" decorativo no canto do logo. Deixe como null pra
    // não mostrar nenhum carimbo nesta loja.
    seloCarimbo: {
        linha1: "100%",
        linha2: "Qualidade",
    },

    apresentacao: {
        botaoPrincipal: "Ver cardápio completo",
        passos: [
            { icone: "fa fa-pizza-slice", titulo: "Monte seu pedido",     desc: "Escolha as pizzas no cardápio e adicione ao carrinho." },
            { icone: "fa fa-route",       titulo: "Escolha como receber", desc: "Entrega, retirada no balcão ou direto da sua mesa." },
            { icone: "fab fa-whatsapp",   titulo: "Confirme no WhatsApp", desc: "Seu pedido segue direto pra cozinha." },
        ],
    },
}
window.TEXTOS = TEXTOS

// ------------------------------------------------------------
// A partir daqui é só aplicação — não precisa editar.
// ------------------------------------------------------------
;(function () {
    const tema = (window.TEMAS && window.TEMAS[TEMA]) || window.TEMAS.generico

    if (!window.TEMAS || !window.TEMAS[TEMA]) {
        console.warn(`Tema "${TEMA}" não encontrado em temas.js — usando "generico" como reserva.`)
    }

    // Deixa acessível globalmente (ex: pro script.js saber o emoji do tema)
    window.TEMA_ATUAL = tema

    // ---- Variáveis CSS de cor (usadas pelo index.html) ----
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

    // ---- Mesmas cores, com os nomes que o admin.html usa ----
    // (o admin tem seu próprio CSS com nomes de variável diferentes;
    // isso permite os dois arquivos usarem este mesmo config-loja.js
    // sem duplicar nada nem precisar renomear o CSS do admin)
    raiz.setProperty("--tinta", tema.cores.principal)
    raiz.setProperty("--tinta-escura", tema.cores.principalEscura)
    raiz.setProperty("--tinta-clara", tema.cores.principalClara)

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

    // ---- Função usada pelas fotos de produto que falham ao carregar ----
    // (chamada via onerror="imagemFallbackProduto(this)" ou
    // onerror="imagemFallbackProduto(this, '112x112')" no HTML/JS,
    // conforme o tamanho da imagem que estiver falhando)
    window.imagemFallbackProduto = function (img, tamanho = "480x360") {
        img.onerror = null
        const cor = tema.cores.principal.replace("#", "")
        img.src = `https://placehold.co/${tamanho}/${cor}/white?text=${encodeURIComponent(tema.emojiPlaceholder)}`
    }

    // ---- Ícone de fallback do logo + alt text (só existe no index.html;
    // no admin.html essas buscas simplesmente não encontram nada e são ignoradas) ----
    document.addEventListener("DOMContentLoaded", () => {
        const iconeFallback = document.querySelector("#header-banner .selo i")
        if (iconeFallback) {
            iconeFallback.className = `fa ${tema.iconeFallbackLogo} text-5xl`
            iconeFallback.style.color = "var(--laranja)"
        }
        const logoImg = document.getElementById("logo-img")
        if (logoImg) logoImg.setAttribute("alt", tema.textoAltLogo)

        aplicarTextos()
    })

    // ------------------------------------------------------------
    // APLICAÇÃO DOS TEXTOS (TEXTOS acima) NO index.html
    // ------------------------------------------------------------
    // Preenche os textos do hero, diferenciais, como funciona, CTA
    // final e tela de apresentação a partir do objeto TEXTOS.
    // Só existe no index.html — no admin.html essas buscas não
    // encontram nada e a função sai sem fazer nada (guardas abaixo).
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
})()