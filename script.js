// ===========================
// ÍCONES POR CATEGORIA (fallback caso o produto não informe "icone")
// ===========================
const ICONE_PADRAO = "fa-star"

// ===========================
// SKELETON DE CARREGAMENTO (menu)
// Mostra "cards fantasma" enquanto os dados da loja ainda não
// chegaram do Supabase, em vez de deixar a tela em branco.
// Some sozinho assim que renderizarProdutos() roda de verdade.
// ===========================
function renderizarSkeletonMenu() {
    const menu = document.getElementById("menu")
    const cards = Array.from({ length: 4 }).map(() => `
        <div class="flex gap-6" style="animation:pulse 1.6s ease-in-out infinite;">
            <div class="w-28 h-28 rounded-md" style="background:var(--linha);"></div>
            <div class="product-info" style="gap:8px;display:flex;flex-direction:column;">
                <div style="height:16px;width:70%;border-radius:6px;background:var(--linha);"></div>
                <div style="height:12px;width:45%;border-radius:6px;background:var(--linha);"></div>
                <div style="height:18px;width:30%;border-radius:6px;background:var(--linha);margin-top:auto;"></div>
            </div>
        </div>
    `).join("")

    menu.innerHTML = `
        <main class="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-10 mx-auto max-w-7xl px-4 mb-12">
            ${cards}
        </main>
    `
}

renderizarSkeletonMenu()

// ===========================
// ABRIR LINK EXTERNO COMO CLIQUE DE VERDADE
// window.open("", "_blank") + location.href depois é tratado pelo
// Android/Chrome como navegação "de script", e por isso mostra aquela
// confirmação extra ("Continuar com WhatsApp Business?") antes de abrir
// o app. Um <a> real com .click() simulado é reconhecido como clique
// genuíno do usuário, e o app abre direto na maioria dos casos.
// ===========================
function abrirLinkWhats(url) {
    const link = document.createElement("a")
    link.href = url
    link.target = "_blank"
    link.rel = "noopener"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

// ===========================
// ROLAGEM SUAVE MANUAL
// (mais confiável que window.scrollTo({behavior:"smooth"}), que
// costuma travar/pular em alguns navegadores e celulares)
// ===========================
function scrollSuavePara(destinoY, duracao = 500) {
    const inicioY = window.scrollY
    const distancia = destinoY - inicioY
    let inicioTempo = null

    function passo(tempoAtual) {
        if (inicioTempo === null) inicioTempo = tempoAtual
        const decorrido = tempoAtual - inicioTempo
        const progresso = Math.min(decorrido / duracao, 1)
        // easing suave (ease-in-out)
        const facilitado = progresso < 0.5
            ? 2 * progresso * progresso
            : 1 - Math.pow(-2 * progresso + 2, 2) / 2
        window.scrollTo(0, inicioY + distancia * facilitado)
        if (decorrido < duracao) {
            requestAnimationFrame(passo)
        }
    }
    requestAnimationFrame(passo)
}

// ===========================
// SEGURANÇA — escapar texto antes de inserir via innerHTML
// Mesmo cuidado do painel admin: evita que nome/descrição de produto
// quebrem pra fora do template e injetem HTML/JS, caso a conta do
// lojista seja comprometida no futuro.
// ===========================
function escaparHtml(valor) {
    return String(valor === null || valor === undefined ? "" : valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
}

// Abre um link (esquema whatsapp:// ou https://wa.me/...) simulando um
// clique real de usuário — mais confiável que window.location.href ou
// window.open() pra abrir o app do WhatsApp direto no celular, e evita
// travar em about:blank quando usa o esquema whatsapp://.
function abrirLinkWhats(url) {
    const link = document.createElement("a")
    link.href = url
    link.target = "_blank"
    link.rel = "noopener"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

// ===========================
// "ESGOTADO": manual x automático
// Um produto aparece esgotado pro cliente se o lojista marcou
// manualmente no cadastro (produto.esgotado) OU se o estoque
// controlado numericamente chegou a zero — sem misturar as duas
// coisas na mesma coluna do banco. Isso evita que o ajuste
// automático de estoque (baixa/devolução) desmarque sem querer um
// "Esgotado" que o lojista definiu de propósito.
// ===========================
function produtoEstaEsgotado(produto) {
    const estoqueZerado = produto.estoque !== null && produto.estoque !== undefined && produto.estoque <= 0
    return !!produto.esgotado || estoqueZerado
}

// ===========================
// TEXTO DO HORÁRIO DE HOJE (gerado automaticamente a partir de loja.horario)
// Mostra só o intervalo do dia atual (ex: "18:00 - 23:59"), igual ao
// que já decide se a loja está aberta (checkStoreOpen) — os dois usam
// a MESMA fonte de dados, então nunca mais ficam desincronizados.
// ===========================
const DIAS_SEMANA_ORDEM = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"]

// Converte um valor de horário (número = hora cheia do formato antigo,
// ou texto "HH:MM" do formato novo) pra minutos desde a meia-noite —
// única forma de comparar/formatar os dois formatos sem duplicar lógica.
function paraMinutos(valor, padraoMinutos) {
    if (valor === null || valor === undefined || valor === "") return padraoMinutos
    if (typeof valor === "number") return valor * 60
    const partes = String(valor).split(":")
    const h = parseInt(partes[0], 10)
    const m = parseInt(partes[1], 10) || 0
    if (isNaN(h)) return padraoMinutos
    return h * 60 + m
}

function formatarHoraExibicao(valor) {
    const totalMinutos = paraMinutos(valor, 0)
    const h = Math.floor(totalMinutos / 60)
    const m = totalMinutos % 60
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

function textoHorarioHoje(horario) {
    if (!horario) return ""
    const diaDeHoje = DIAS_SEMANA_ORDEM[new Date().getDay()]

    const bruto = horario[diaDeHoje]
    const intervalos = Array.isArray(bruto) ? bruto : (bruto ? [bruto] : null)

    if (!intervalos || !intervalos.length) return "Fechado hoje"

    return intervalos
        .map(i => `${formatarHoraExibicao(i.abre)} - ${formatarHoraExibicao(i.fecha)}`)
        .join(" e ")
}

// ===========================
// APLICAR DADOS DA LOJA NA PÁGINA
// (lê o objeto `loja` de dados-loja.js)
// ===========================
function aplicarDadosDaLoja() {
    document.title = loja.nome

    document.getElementById("header-banner").style.backgroundImage = `url('${loja.banner}')`
    document.getElementById("logo-img").src = loja.logo
    document.getElementById("logo-img").alt = `Logo ${loja.nome}`
    document.getElementById("loja-nome").textContent = loja.nome
    document.getElementById("loja-tagline").textContent = loja.tagline
    document.getElementById("loja-endereco").textContent = `Endereço: ${loja.endereco}`

    // Tela de apresentação (splash inicial) — reaproveita os mesmos
    // dados do cabeçalho, sem precisar de campo novo nenhum no admin.
    document.getElementById("apresentacao-logo-img").src = loja.logo
    document.getElementById("apresentacao-logo-img").alt = `Logo ${loja.nome}`
    document.getElementById("apresentacao-nome").textContent = loja.nome
    document.getElementById("apresentacao-tagline").textContent = loja.tagline
    document.getElementById("apresentacao-fundo").style.backgroundImage = `url('${loja.banner}')`

    if (loja.seloConfianca) {
        document.getElementById("apresentacao-selo-texto").textContent = loja.seloConfianca
        document.getElementById("apresentacao-selo-sub").textContent = loja.seloConfiancaSub || ""
        document.getElementById("apresentacao-selo").style.display = "flex"
    }

    // Se ainda não tiver o horário estruturado configurado,
    // cai pro texto manual antigo — não quebra clientes já no ar.
    document.getElementById("loja-horario").textContent = textoHorarioHoje(loja.horario) || loja.textoHorario
    document.getElementById("titulo-secao-menu").textContent = loja.tituloSecaoMenu

    if (loja.seloConfianca) {
        document.getElementById("selo-confianca-texto").textContent = loja.seloConfianca
        document.getElementById("selo-confianca-sub").textContent = loja.seloConfiancaSub || ""
        document.getElementById("selo-confianca").style.display = "flex"
    }

    document.getElementById("whats-flutuante").href = `https://wa.me/${loja.whatsapp}`

    // Aplica a cor principal da loja nas variáveis CSS — só se a loja
    // tiver cor customizada salva no admin. Se não tiver (null/vazio),
    // mantém a cor que o tema (config-loja.js/temas.js) já aplicou.
    if (loja.corPrincipal) {
        document.documentElement.style.setProperty("--laranja", loja.corPrincipal)
        document.documentElement.style.setProperty("--laranja-escuro", loja.corPrincipalEscura)
        document.documentElement.style.setProperty("--laranja-claro", loja.corPrincipalClara)
    }
}

// ===========================
// COR PARA OS TOASTS (Toastify)
// Usa a cor personalizada da loja quando existe; senão cai pra cor
// que o tema já aplicou na variável CSS --laranja (nunca fica sem
// cor / com o cinza padrão do navegador).
// ===========================
function corDoToast() {
    if (loja.corPrincipal) return loja.corPrincipal
    const corTema = getComputedStyle(document.documentElement).getPropertyValue("--laranja").trim()
    return corTema || "#A9321E"
}


// ===========================
// RENDERIZAR PRODUTOS
// (lê o array `produtos` de dados-produtos.js e monta o HTML)
//
// Campo opcional em cada produto: esgotado: true
// Quando presente, o produto aparece riscado, com um selo
// "Esgotado" e não pode ser adicionado ao carrinho.
// ===========================
function renderizarProdutos() {
    const menu = document.getElementById("menu")
    const nav = document.getElementById("categorias-nav")
    menu.innerHTML = ""
    if (nav) nav.innerHTML = ""

    // Modo delivery esconde produtos "só retirada"
    let produtosVisiveis = modoMesa
        ? produtos
        : produtos.filter(p => !p.retirada_apenas)

    // Loja configurada pra esconder esgotados (padrão): tira da lista em
    // vez de mostrar riscado — evita ocupar espaço com algo que não dá
    // pra comprar mesmo.
    if (loja.esconderEsgotados) {
        produtosVisiveis = produtosVisiveis.filter(p => !produtoEstaEsgotado(p))
    }

    // Agrupa produtos por categoria
    const produtosPorCategoria = {}

    produtosVisiveis.forEach(produto => {
        if (!produtosPorCategoria[produto.categoria]) {
            produtosPorCategoria[produto.categoria] = []
        }
        produtosPorCategoria[produto.categoria].push(produto)
    })

    // Ordem de exibição vem do objeto "categorias" (declarado em
    // dados-produtos.js). Categorias com produtos mas não declaradas
    // ali ainda aparecem, jogadas no final, como rede de segurança.
    const categoriasComProdutos = Object.keys(produtosPorCategoria)
    const ordemDeclarada = Object.keys(categorias).filter(c => categoriasComProdutos.includes(c))
    const ordemNaoDeclarada = categoriasComProdutos.filter(c => !ordemDeclarada.includes(c))
    const ordemFinal = [...ordemDeclarada, ...ordemNaoDeclarada]

    ordemFinal.forEach((categoria, index) => {
        const icone = (categorias[categoria] && categorias[categoria].icone) || ICONE_PADRAO
        const gridId = `categoria-grid-${index}`
        const tituloId = `categoria-titulo-${index}`

        // Título da categoria (clicável)
        const tituloWrapper = document.createElement("div")
        tituloWrapper.id = tituloId
        tituloWrapper.className = "mx-auto max-w-7xl px-4 mb-4 cursor-pointer select-none"
        tituloWrapper.innerHTML = `
            <h2 class="font-bold text-2xl category-title flex items-center gap-2">
                <i class="fa fa-chevron-down category-chevron"></i>
                <i class="fa ${escaparHtml(icone)}" style="color: var(--laranja);"></i> ${escaparHtml(categoria)}
            </h2>
        `
        menu.appendChild(tituloWrapper)

        // Grade de produtos da categoria
        const grid = document.createElement("main")
        grid.id = gridId
        grid.className = "grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-10 mx-auto max-w-7xl px-4 mb-12 categoria-grid"

        produtosPorCategoria[categoria].forEach(produto => {
            grid.appendChild(criarCardProduto(produto))
        })

        menu.appendChild(grid)

        // O estado inicial (aberta ou fechada) agora é escolhido pelo
        // lojista por categoria, no admin ("Abrir automático" em Dados
        // da loja > Categorias do cardápio). Sem marcar nada, a categoria
        // já nasce fechada — o cliente sempre pode abrir/fechar clicando
        // no título, independente desse estado inicial.
        const abrirAutomatico = !!(categorias[categoria] && categorias[categoria].aberta_por_padrao)
        if (!abrirAutomatico) {
            grid.classList.add("categoria-fechada")
            grid.style.maxHeight = "0px"
            tituloWrapper.querySelector(".category-chevron").classList.add("chevron-fechado")
        }

        // Clique no título esconde/mostra os produtos dessa categoria
        tituloWrapper.addEventListener("click", () => {
            const chevron = tituloWrapper.querySelector(".category-chevron")
            const estaAberta = !grid.classList.contains("categoria-fechada")

            if (estaAberta) {
                // Fechar: fixa a altura atual antes de animar pra 0
                grid.style.maxHeight = grid.scrollHeight + "px"
                requestAnimationFrame(() => {
                    grid.classList.add("categoria-fechada")
                    grid.style.maxHeight = "0px"
                })
            } else {
                // Abrir: anima até a altura real do conteúdo
                grid.classList.remove("categoria-fechada")
                grid.style.maxHeight = grid.scrollHeight + "px"
            }

            chevron.classList.toggle("chevron-fechado")
        })

        // Botão de atalho na barra de categorias
        if (nav) {
            const navBtn = document.createElement("button")
            navBtn.className = "categoria-nav-btn"
            navBtn.type = "button"
            navBtn.textContent = categoria
            navBtn.addEventListener("click", () => {
                nav.querySelectorAll(".categoria-nav-btn").forEach(b => b.classList.remove("ativa"))
                navBtn.classList.add("ativa")

                // Se a categoria estiver fechada, abre ela também
                if (grid.classList.contains("categoria-fechada")) {
                    tituloWrapper.click()
                }

                // Rolagem manual e suave (mais confiável do que o
                // comportamento nativo do navegador)
                const alvo = document.getElementById(tituloId)
                const posicao = alvo.getBoundingClientRect().top + window.scrollY - 16
                scrollSuavePara(posicao)
            })
            nav.appendChild(navBtn)
        }
    })
}

// ===========================
// TEXTO DA ANTECEDÊNCIA (selo no card do produto)
// Converte horas em texto mais natural — dias quando for múltiplo
// exato de 24h (ex: 48h -> "2 dias"), senão mostra em horas mesmo.
// ===========================
function formatarAntecedencia(horas) {
    if (horas % 24 === 0) {
        const dias = horas / 24
        return `Mín. ${dias} dia${dias > 1 ? "s" : ""} de antecedência`
    }
    return `Mín. ${horas}h de antecedência`
}

function criarCardProduto(produto) {
    const precoFormatado = produto.preco.toFixed(2).replace(".", ",")
    const esgotado = produtoEstaEsgotado(produto)
    const semSetas = !!produto.esconder_setas
    const esconderPreco = produto.preco === 0
    const badgeOferta = produto.oferta ? `<span class="badge-oferta">Oferta</span>` : ""
    const badgeEsgotado = esgotado ? `<span class="badge-esgotado">Esgotado</span>` : ""
    const badgeEncomenda = (produto.sob_encomenda && produto.antecedencia_minima_horas)
        ? `<span class="badge-encomenda"><i class="fa fa-clock"></i> ${formatarAntecedencia(produto.antecedencia_minima_horas)}</span>`
        : ""

    const card = document.createElement("div")
    card.className = "flex gap-6" + (esgotado ? " produto-esgotado" : "")
    card.innerHTML = `
        <img src="${escaparHtml(produto.fotos[0] || '')}" alt="${escaparHtml(produto.nome)}"
            class="w-28 h-28 rounded-md object-cover hover:scale-110 hover:rotate-2 duration-200 product-clickable"
            onerror="imagemFallbackProduto(this, '112x112')"
        />
        <div class="product-info">
            <p class="font-bold product-name-clickable">
                ${escaparHtml(produto.nome)}
                ${badgeOferta}
                ${badgeEsgotado}
                ${badgeEncomenda}
            </p>
            <p class="text-sm text-gray-600">${escaparHtml(produto.desc)}</p>
            <div class="product-footer">
                ${esconderPreco ? "<span></span>" : `<p class="font-bold text-lg text-laranja">R$ ${precoFormatado}</p>`}
                <div class="product-footer-actions">
                    ${produto.mostrar_botao_duvida ? `
                    <button class="whats-duvida-btn" data-id="${produto.id}" title="Tirar dúvida no WhatsApp">
                        <i class="fab fa-whatsapp"></i><span>&nbsp;Dúvida</span>
                    </button>` : ""}
                    ${(semSetas || esgotado) ? "" : `
                    <div class="qty-selector" data-qty="1">
                        <button class="qty-btn qty-decrease" type="button">−</button>
                        <span class="qty-value">1</span>
                        <button class="qty-btn qty-increase" type="button">+</button>
                    </div>`}
                    <button class="add-to-cart-btn${esgotado ? " esgotado-btn" : ""}" data-id="${produto.id}" data-name="${escaparHtml(produto.nome)}" data-price="${produto.preco}" data-esgotado="${esgotado}">
                        <i class="fa ${esgotado ? "fa-ban" : "fa-cart-plus"} text-lg"></i>
                    </button>
                </div>
            </div>
        </div>
    `

    // Clique na imagem e no nome abrem o modal do produto
    // (mesmo esgotado, o cliente pode ver os detalhes)
    const img = card.querySelector("img")
    const nome = card.querySelector(".product-name-clickable")
    const abrir = () => abrirProduto(produto)
    img.addEventListener("click", abrir)
    nome.addEventListener("click", abrir)

    return card
}



// ===========================
// SELETORES (elementos fixos da página)
// ===========================
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressRua = document.getElementById("address-rua")
const addressNumero = document.getElementById("address-numero")
const addressBairro = document.getElementById("address-bairro")
const addressReferencia = document.getElementById("address-referencia")
const addressWarn = document.getElementById("address-warn")
const addressSection = document.getElementById("address-section")
const optEntrega = document.getElementById("opt-entrega")
const optRetirada = document.getElementById("opt-retirada")
const addMoreItemsBtn = document.getElementById("add-more-items-btn")

addMoreItemsBtn.addEventListener("click", fecharModalCarrinho)

document.getElementById("modal-qty-increase").addEventListener("click", () => {
    const seletor = document.getElementById("modal-qty-selector")
    const qtdAtual = parseInt(seletor.getAttribute("data-qty"), 10)
    const disponivel = estoqueDisponivel(produtoAtual.id)

    if (qtdAtual + 1 > disponivel) {
        avisarEstoqueInsuficiente(disponivel)
        return
    }

    const qtd = qtdAtual + 1
    seletor.setAttribute("data-qty", qtd)
    document.getElementById("modal-qty-value").textContent = qtd
    atualizarBotaoAdicionarModal()
})
document.getElementById("modal-qty-decrease").addEventListener("click", () => {
    const seletor = document.getElementById("modal-qty-selector")
    const qtd = Math.max(1, parseInt(seletor.getAttribute("data-qty"), 10) - 1)
    seletor.setAttribute("data-qty", qtd)
    document.getElementById("modal-qty-value").textContent = qtd
    atualizarBotaoAdicionarModal()
})

// ===========================
// MODO MESA (?mesa=NN na URL)
// Quando presente, o site sabe que o pedido é de uma mesa
// específica: esconde entrega/retirada, endereço e pagamento.
//
// CORRIGIDO (segurança): o valor de "mesa" vem direto da URL pública
// — qualquer pessoa pode montar um link com qualquer texto nesse
// parâmetro (inclusive HTML/JS) e mandar pra alguém, inclusive pro
// próprio lojista. Esse valor acaba gravado no banco (pedidos_mesa)
// e mais tarde é exibido no painel admin. Por isso ele é validado e
// limitado aqui, na origem, antes de ser usado em qualquer lugar:
// só letras, números, espaço, hífen e underline são aceitos, com um
// tamanho máximo curto (compatível com "01", "Mesa 12", "Varanda 3"
// etc.). Qualquer coisa fora disso é tratada como link inválido.
// ===========================
function sanitizarNumeroMesa(valorBruto) {
    if (!valorBruto) return null
    const limpo = String(valorBruto).trim().slice(0, 20)
    const valido = /^[\p{L}0-9 _-]+$/u.test(limpo)
    return valido ? limpo : null
}

// Sem bairro cadastrado, mantém o campo de texto livre de sempre —
// "Taxa a combinar", igual já era. Com bairros cadastrados, troca pro
// select (com a opção "Não encontrei meu bairro" pro caso de faltar
// algum na lista — nesse caso a taxa volta a ser "a combinar").
function popularSelectBairros() {
    const select = document.getElementById("address-bairro-select")
    const input = document.getElementById("address-bairro")
    if (!select || !input) return

    const temBairros = loja.bairrosTaxa && loja.bairrosTaxa.length > 0

    if (!temBairros) {
        select.style.display = "none"
        input.style.display = ""
        return
    }

    select.innerHTML = `<option value="">Selecione seu bairro</option>` +
        loja.bairrosTaxa
            .slice()
            .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
            .map(b => `<option value="${escaparHtml(b.nome)}" data-taxa="${b.taxa}">${escaparHtml(b.nome)} — R$ ${Number(b.taxa).toFixed(2).replace(".", ",")}</option>`)
            .join("") +
        `<option value="__outro__">Não encontrei meu bairro</option>`

    select.style.display = ""
    input.style.display = "none"
    input.value = ""
}

function bairroPendenteSelecao() {
    const select = document.getElementById("address-bairro-select")
    return !!(select && select.style.display !== "none" && select.value === "")
}

const paramsUrl = new URLSearchParams(window.location.search)
const mesaAtual = sanitizarNumeroMesa(paramsUrl.get("mesa"))
const modoMesa = !!mesaAtual

function aplicarModoMesa() {
    if (!modoMesa) return

    document.getElementById("delivery-type-section")?.classList.add("oculto-modo")
    document.getElementById("address-section")?.classList.add("oculto-modo")
    document.getElementById("payment-section")?.classList.add("oculto-modo")

    tipoEntrega = "mesa"
    atualizarLinhaTaxa()
}

// ===========================
// MESA MANUAL (loja só-mesa, acessada sem QR Code)
// Quando a loja não trabalha com delivery nem retirada (config-loja.js:
// MODO_LOJA.permiteDelivery e permiteRetirada ambos false) e o cliente
// abriu o link geral do cardápio — sem vir de um QR Code de mesa, que já
// traria ?mesa= na URL — pede o número da mesa direto no carrinho, em
// vez de mostrar entrega/retirada/pagamento, que não se aplicam aqui.
// ===========================
const somenteMesaSemQr = !modoMesa
    && !!(window.MODO_LOJA && window.MODO_LOJA.usaMesa)
    && !(window.MODO_LOJA && (window.MODO_LOJA.permiteDelivery || window.MODO_LOJA.permiteRetirada))

function aplicarMesaManual() {
    if (!somenteMesaSemQr) return

    document.getElementById("delivery-type-section")?.classList.add("oculto-modo")
    document.getElementById("address-section")?.classList.add("oculto-modo")
    document.getElementById("payment-section")?.classList.add("oculto-modo")
    document.getElementById("mesa-manual-section")?.classList.remove("oculto-modo")

    tipoEntrega = "mesa"
    atualizarLinhaTaxa()
}

// Valida o número digitado contra o total de mesas cadastrado na loja
// (aba Dados da loja, admin). Retorna o número validado (string) ou
// null se estiver vazio/fora do intervalo — e nesse caso já mostra o
// aviso de erro embaixo do campo (texto diferente pra campo vazio x
// número que não existe) e um toast, pra chamar mais atenção.
function validarMesaManual() {
    const input = document.getElementById("mesa-manual-input")
    const erro = document.getElementById("mesa-manual-erro")
    const maximo = loja.numeroMesas
    const valor = parseInt(input.value, 10)

    // Sem número de mesas configurado em Dados da loja (null/0), não dá
    // pra validar contra nada — bloqueia o pedido em vez de aceitar
    // qualquer número digitado, mesmo tabela vazia (mesa 999 passaria).
    if (!maximo || maximo < 1) {
        const mensagemSemConfig = "Esta mesa não existe, ou ainda não foi adicionada. Chame um atendente."
        erro.textContent = mensagemSemConfig
        erro.classList.remove("hidden")
        input.classList.add("border-red-500")
        Toastify({
            text: `😕 ${mensagemSemConfig}`,
            duration: 2500,
            gravity: "top",
            position: "right",
            style: { background: "#ef4444", borderRadius: "8px" },
        }).showToast()
        return null
    }

    const vazio = !valor || valor < 1
    const foraDoIntervalo = !vazio && valor > maximo
    const invalido = vazio || foraDoIntervalo

    let mensagem = `Informe um número de mesa válido (1 a ${maximo}).`
    if (foraDoIntervalo) {
        mensagem = `Essa mesa não existe. Este local tem ${maximo} mesa${maximo > 1 ? "s" : ""}.`
    }

    erro.textContent = mensagem
    erro.classList.toggle("hidden", !invalido)
    input.classList.toggle("border-red-500", invalido)

    if (invalido) {
        Toastify({
            text: `😕 ${mensagem}`,
            duration: 2500,
            gravity: "top",
            position: "right",
            style: { background: "#ef4444", borderRadius: "8px" },
        }).showToast()
        return null
    }

    return String(valor)
}

document.getElementById("address-bairro-select")?.addEventListener("change", function () {
    const input = document.getElementById("address-bairro")
    this.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")

    if (this.value === "__outro__") {
        input.style.display = ""
        input.value = ""
        input.placeholder = "Digite seu bairro"
        input.focus()
        taxaEntregaAtual = null
    } else if (this.value === "") {
        input.style.display = "none"
        input.value = ""
        taxaEntregaAtual = null
    } else {
        input.style.display = "none"
        input.value = this.value
        taxaEntregaAtual = parseFloat(this.options[this.selectedIndex].dataset.taxa) || 0
    }

    updateCartModal()
})

document.getElementById("mesa-manual-input")?.addEventListener("input", function () {
    if (this.value.trim() === "") return
    document.getElementById("mesa-manual-erro").classList.add("hidden")
    this.classList.remove("border-red-500")
})

// ===========================
// MODO DE ATENDIMENTO (config-loja.js: MODO_LOJA)
// Algumas lojas trabalham só com delivery, outras só com retirada.
// Se só uma das duas opções estiver liberada, esconde o toggle
// "Entrega / Retirada na loja" e já trava o tipo certo — sem
// mexer no modo mesa, que continua 100% automático via ?mesa=.
// ===========================
function aplicarModoAtendimento() {
    if (modoMesa || somenteMesaSemQr) return // mesa (via QR ou manual) já cuida de tudo sozinha

    const config = window.MODO_LOJA || { permiteDelivery: true, permiteRetirada: true }

    if (config.permiteDelivery && !config.permiteRetirada) {
        document.getElementById("delivery-type-section")?.classList.add("oculto-modo")
        selecionarEntrega("entrega")
    } else if (!config.permiteDelivery && config.permiteRetirada) {
        document.getElementById("delivery-type-section")?.classList.add("oculto-modo")
        selecionarEntrega("retirada")
    } else if (!config.permiteDelivery && !config.permiteRetirada) {
        // Loja que não habilitou nem entrega nem retirada (ex: só faz
        // encomenda, e o combinado é sempre o cliente buscar na data
        // marcada) — trata como retirada implícita. Evita pedir
        // endereço de alguém que a loja nunca vai entregar nada.
        document.getElementById("delivery-type-section")?.classList.add("oculto-modo")
        selecionarEntrega("retirada")
    }
    // Se os dois forem true (padrão), não faz nada — mantém o toggle normal.
}

// ===========================
// ESTADO
// ===========================
let cart = []
let tipoEntrega = "entrega"
let tipoPagamento = null // null = cliente ainda não escolheu — obrigatório antes de finalizar
let taxaEntregaAtual = null // null = "a combinar" (loja sem bairros cadastrados, ou "Não encontrei meu bairro")

// Gera um id de pedido no navegador do cliente. Usa crypto.randomUUID()
// quando disponível (a maioria dos navegadores atuais); em navegadores
// muito antigos, cai num gerador simples de reserva.
function gerarIdPedido() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID()
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0
        const v = c === "x" ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

// ===========================
// MODO DARK
// ===========================
const darkToggle = document.getElementById("dark-toggle")
const darkIcon = document.getElementById("dark-icon")

if (localStorage.getItem("dark") === "true") {
    document.body.classList.add("dark")
    darkIcon.classList.replace("fa-moon", "fa-sun")
}

darkToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark")
    const isDark = document.body.classList.contains("dark")
    localStorage.setItem("dark", isDark)
    darkIcon.classList.toggle("fa-moon", !isDark)
    darkIcon.classList.toggle("fa-sun", isDark)
})

function restaurarOverflowBody() {
    const algumModalAberto =
        cartModal.style.display === "flex" ||
        document.getElementById("product-modal").classList.contains("open") ||
        document.getElementById("address-modal").classList.contains("open") ||
        document.getElementById("pix-modal").classList.contains("open")

    document.body.style.overflow = algumModalAberto ? "hidden" : ""
}

// ===========================
// MODAL DO CARRINHO
// ===========================
cartBtn.addEventListener("click", function () {
    updateCartModal()
    const modalJaAberto = cartModal.style.display === "flex"
    cartModal.style.display = "flex"
    document.body.style.overflow = "hidden"

    // Empilha estado apenas uma vez se não estiver aberto
    if (!modalJaAberto) {
        history.pushState({ carrinhoModalAberto: true }, "")
    }
})

function fecharModalCarrinho() {
    limparReferenciaEncomendaOrfa()

    cartModal.style.display = "none"
    restaurarOverflowBody()

    // Remove estado do histórico se existir
    if (history.state && history.state.carrinhoModalAberto) {
        history.back()
    }
}

cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        fecharModalCarrinho()
    }
})

closeModalBtn.addEventListener("click", function () {
    fecharModalCarrinho()
})

document.getElementById("cart-modal-close-btn")?.addEventListener("click", function () {
    fecharModalCarrinho()
})


// ===========================
// ENTREGA OU RETIRADA
// CORRIGIDO: "addressInput" não existia mais (sobrou de uma versão
// anterior, antes do endereço virar vários campos — rua, número,
// bairro, referência). Toda vez que o cliente clicava em "Retirada
// na loja" isso gerava um erro no console. Agora limpa o aviso e o
// destaque vermelho dos campos de endereço reais.
// ===========================
function selecionarEntrega(tipo) {
    tipoEntrega = tipo

    if (tipo === "entrega") {
        optEntrega.classList.add("selected")
        optRetirada.classList.remove("selected")
    } else {
        optRetirada.classList.add("selected")
        optEntrega.classList.remove("selected")
        addressWarn.classList.add("hidden")
        addressRua.classList.remove("border-red-500")
        addressBairro.classList.remove("border-red-500")
    }

    atualizarCartaoEndereco()
    updateCartModal()
}

// A linha "Taxa de entrega" no resumo só faz sentido no modo entrega —
// some na retirada (cliente busca na loja) e no modo mesa (fecha com
// o garçom, não tem esse conceito).
function atualizarLinhaTaxa() {
    const linha = document.getElementById("resumo-taxa-linha")
    if (!linha) return
    linha.style.display = (tipoEntrega === "entrega") ? "" : "none"

    const valorTaxa = document.getElementById("resumo-taxa")
    if (valorTaxa) {
        valorTaxa.textContent = (tipoEntrega === "entrega" && taxaEntregaAtual !== null)
            ? `R$ ${taxaEntregaAtual.toFixed(2).replace(".", ",")}`
            : "A combinar"
    }
}


// ===========================
// FORMA DE PAGAMENTO
// ===========================
function selecionarPagamento(tipo) {
    tipoPagamento = tipo
    document.getElementById("pag-pix").classList.toggle("selected", tipo === "Pix")
    document.getElementById("pag-dinheiro").classList.toggle("selected", tipo === "Dinheiro")
    document.getElementById("pag-cartao").classList.toggle("selected", tipo === "Cartão na entrega")

    // Some com o aviso assim que o cliente escolhe uma opção
    const erroPagamento = document.getElementById("pagamento-erro")
    if (erroPagamento) erroPagamento.classList.add("hidden")
}

// Valida se o cliente já escolheu uma forma de pagamento. Só se aplica
// ao fluxo delivery/retirada — no modo mesa a conta fecha com o garçom,
// então essa etapa nem aparece (ver aplicarModoMesa/aplicarMesaManual).
function validarFormaPagamento() {
    if (modoMesa || somenteMesaSemQr) return true

    const erroPagamento = document.getElementById("pagamento-erro")
    if (!tipoPagamento) {
        if (erroPagamento) erroPagamento.classList.remove("hidden")
        Toastify({
            text: "Escolha uma forma de pagamento antes de finalizar.",
            duration: 2500,
            gravity: "top",
            position: "right",
            style: { background: "#ef4444", borderRadius: "8px" },
        }).showToast()
        return false
    }

    if (erroPagamento) erroPagamento.classList.add("hidden")
    return true
}


// ===========================
// MODAL DE CONFIRMAÇÃO PIX
// Só é usado quando o pagamento escolhido é "Pix" E a loja tem uma
// chave cadastrada (aba Dados da loja, admin). Se a loja não tiver
// chave, o fluxo antigo (pedido vai só pro WhatsApp, sem esse passo
// extra) continua normal — ver checkoutBtn.
// ===========================
function abrirModalPix(total, urlWhats) {
    const totalFormatado = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    document.getElementById("pix-total").textContent = totalFormatado
    document.getElementById("pix-chave-texto").textContent = loja.chavePix

    // Copia a chave primeiro e só então abre o WhatsApp com o pedido —
    // isso acontece no clique do próprio botão (ação genuína do
    // usuário), então não corre risco de bloqueio de pop-up mesmo que
    // esse clique venha depois de outros passos assíncronos.
    document.getElementById("pix-comprovante-btn").onclick = async function () {
        try {
            await navigator.clipboard.writeText(loja.chavePix || "")
        } catch (err) {
            const textarea = document.createElement("textarea")
            textarea.value = loja.chavePix || ""
            textarea.style.position = "fixed"
            textarea.style.opacity = "0"
            document.body.appendChild(textarea)
            textarea.select()
            try { document.execCommand("copy") } catch (err2) { console.error("Falha ao copiar", err2) }
            document.body.removeChild(textarea)
        }
        abrirLinkWhats(urlWhats)
    }

    document.getElementById("pix-modal").classList.add("open")
    document.body.style.overflow = "hidden"
    history.pushState({ pixModalAberto: true }, "")
}

function fecharModalPix() {
    document.getElementById("pix-modal").classList.remove("open")
    restaurarOverflowBody()
    if (history.state && history.state.pixModalAberto) {
        history.back()
    }
}

function fecharModalPixSeOverlay(event) {
    if (event.target === document.getElementById("pix-modal")) {
        fecharModalPix()
    }
}

document.getElementById("pix-fechar-btn").addEventListener("click", fecharModalPix)

document.getElementById("pix-copiar-btn").addEventListener("click", async function () {
    const chave = loja.chavePix || ""
    const btn = document.getElementById("pix-copiar-btn")
    const textoOriginal = btn.innerHTML

    try {
        await navigator.clipboard.writeText(chave)
    } catch (err) {
        // Navegador antigo / sem permissão: usa o método antigo como reserva
        const textarea = document.createElement("textarea")
        textarea.value = chave
        textarea.style.position = "fixed"
        textarea.style.opacity = "0"
        document.body.appendChild(textarea)
        textarea.select()
        try { document.execCommand("copy") } catch (err2) { console.error("Falha ao copiar", err2) }
        document.body.removeChild(textarea)
    }

    btn.innerHTML = `<i class="fa fa-check"></i> Copiado!`
    setTimeout(() => { btn.innerHTML = textoOriginal }, 1800)
})


// ===========================
// VALIDAÇÃO DE ESTOQUE EM TEMPO REAL
// Calcula quanto ainda pode ser adicionado de um produto,
// descontando o que já está no carrinho (soma todas as variantes/
// opções desse mesmo produto, já que compartilham o mesmo estoque).
// Produtos com estoque = null/undefined não são controlados (Infinity).
// ===========================
function estoqueDisponivel(produtoId) {
    const produto = produtos.find(p => String(p.id) === String(produtoId))
    if (!produto || produto.estoque === null || produto.estoque === undefined) return Infinity

    const jaNoCarrinho = cart
        .filter(item => String(item.id) === String(produtoId))
        .reduce((soma, item) => soma + item.quantity, 0)

    return produto.estoque - jaNoCarrinho
}

function avisarEstoqueInsuficiente(disponivel) {
    Toastify({
        text: disponivel > 0
            ? `😕 Só temos ${disponivel} unidade(s) disponível(is) desse produto.`
            : `😕 Esse produto está esgotado no momento.`,
        duration: 2200,
        gravity: "top",
        position: "right",
        style: { background: "#6b7280", borderRadius: "8px" },
    }).showToast()
}

// ===========================
// ENCOMENDA (data desejada + foto de referência)
// Só aparece no carrinho quando pelo menos um item é sob_encomenda.
// A antecedência mínima usada é a MAIOR entre os itens sob encomenda
// do carrinho (a regra mais rígida vence).
// ===========================
let referenciaImagemEncomendaUrl = null

function produtoTemSobEncomenda(produtoId) {
    const produto = produtos.find(p => String(p.id) === String(produtoId))
    return !!(produto && produto.sob_encomenda)
}

function itensSobEncomendaNoCarrinho() {
    return cart.filter(item => produtoTemSobEncomenda(item.id))
}

function antecedenciaMinimaHorasCarrinho() {
    const horas = itensSobEncomendaNoCarrinho().map(item => {
        const produto = produtos.find(p => String(p.id) === String(item.id))
        return (produto && produto.antecedencia_minima_horas) || 0
    })
    return horas.length ? Math.max(...horas) : 0
}

function atualizarVisibilidadeEncomenda() {
    const secao = document.getElementById("encomenda-section")
    if (!secao) return

    const temEncomenda = itensSobEncomendaNoCarrinho().length > 0
    secao.classList.toggle("oculto-modo", !temEncomenda)
    if (!temEncomenda) return

    const antecedenciaHoras = antecedenciaMinimaHorasCarrinho()
    const dataMinima = new Date(Date.now() + antecedenciaHoras * 60 * 60 * 1000)
    const dataMinimaISO = dataMinima.toISOString().slice(0, 10)
    const input = document.getElementById("encomenda-data")
    input.min = dataMinimaISO

    // Preenche a data automaticamente com a primeira data válida —
    // poupa o cliente de calcular a antecedência na mão. Só sobrescreve
    // quando o campo ainda está vazio ou quando a data escolhida ficou
    // inválida por causa de um item novo no carrinho (ex: cliente já
    // tinha marcado uma data, adicionou um item com antecedência maior,
    // a data antiga não serve mais). Uma data ainda válida escolhida
    // pelo cliente nunca é sobrescrita.
    if (!input.value || input.value < dataMinimaISO) {
        input.value = dataMinimaISO
    }
}

// Valida a data escolhida contra a antecedência mínima do carrinho —
// mesmo padrão do validarMesaManual() (mensagem de erro embaixo do campo).
function validarDataEncomenda() {
    if (itensSobEncomendaNoCarrinho().length === 0) return true

    const input = document.getElementById("encomenda-data")
    const erro = document.getElementById("encomenda-data-erro")
    const antecedenciaHoras = antecedenciaMinimaHorasCarrinho()
    const dataMinima = new Date(Date.now() + antecedenciaHoras * 60 * 60 * 1000)
    dataMinima.setHours(0, 0, 0, 0)

    const valorDigitado = input.value ? new Date(input.value + "T00:00:00") : null
    const invalido = !valorDigitado || valorDigitado < dataMinima

    if (invalido) {
        erro.textContent = antecedenciaHoras > 0
            ? `Escolha uma data com pelo menos ${antecedenciaHoras}h de antecedência.`
            : "Escolha a data desejada."
        erro.classList.remove("hidden")
        input.classList.add("border-red-500")
        return false
    }

    erro.classList.add("hidden")
    input.classList.remove("border-red-500")
    return true
}

document.getElementById("encomenda-data")?.addEventListener("input", function () {
    // Valida na hora, não só no fechamento do pedido — se o cliente
    // tentar adiantar a data pra antes da antecedência mínima, o aviso
    // já aparece embaixo do campo enquanto ele ainda está escolhendo,
    // sem precisar chegar em "Finalizar pedido" pra descobrir.
    if (this.value) {
        validarDataEncomenda()
    } else {
        document.getElementById("encomenda-data-erro").classList.add("hidden")
        this.classList.remove("border-red-500")
    }
})

// Apaga do Storage uma referência que nunca chegou a virar pedido de
// verdade (cliente trocou de foto, ou fechou o carrinho sem finalizar)
// — mesmo espírito do apagarImagemAntiga do admin, rodando como anon.
async function apagarImagemClienteAntiga(url) {
    if (!url) return
    try {
        const partes = url.split("/midia/")
        if (partes.length < 2) return
        const caminho = decodeURIComponent(partes[1])
        await supabaseClient.storage.from("midia").remove([caminho])
    } catch (err) {
        console.error("Erro ao apagar imagem de referência órfã", url, err)
    }
}

function limparReferenciaEncomendaOrfa() {
    if (referenciaImagemEncomendaUrl) {
        apagarImagemClienteAntiga(referenciaImagemEncomendaUrl)
        referenciaImagemEncomendaUrl = null
    }
    const input = document.getElementById("encomenda-referencia-arquivo")
    const preview = document.getElementById("encomenda-referencia-preview")
    const status = document.getElementById("encomenda-referencia-status")
    if (input) input.value = ""
    if (preview) preview.style.display = "none"
    if (status) status.textContent = ""
}

document.getElementById("encomenda-referencia-arquivo")?.addEventListener("change", async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const status = document.getElementById("encomenda-referencia-status")
    status.textContent = "Enviando..."

    if (!file.type.startsWith("image/")) { status.textContent = "Escolha uma imagem (jpg, png, webp...)"; return }
    if (file.size > 5 * 1024 * 1024) { status.textContent = "Imagem muito grande (máximo 5MB)"; return }

    try {
        const urlAnterior = referenciaImagemEncomendaUrl
        const extensao = file.name.split(".").pop().toLowerCase()
        const caminho = `${loja.id}/encomenda-ref-${Date.now()}.${extensao}`
        const { error } = await supabaseClient.storage.from("midia").upload(caminho, file, { upsert: true })
        if (error) throw error

        const { data } = supabaseClient.storage.from("midia").getPublicUrl(caminho)
        referenciaImagemEncomendaUrl = data.publicUrl

        document.getElementById("encomenda-referencia-preview").src = referenciaImagemEncomendaUrl
        document.getElementById("encomenda-referencia-preview").style.display = "block"
        status.textContent = "Enviado ✓"

        // Trocou de foto no meio do caminho — a anterior fica órfã, apaga na hora.
        if (urlAnterior) apagarImagemClienteAntiga(urlAnterior)
    } catch (err) {
        status.textContent = "Erro: " + err.message
    }
})


// ===========================
// ADICIONAR AO CARRINHO
// (usa "delegação de evento" no #menu, funciona mesmo com os
// cards sendo criados dinamicamente pelo renderizarProdutos)
// ===========================
document.getElementById("menu").addEventListener("click", function (event) {
    const duvidaBtn = event.target.closest(".whats-duvida-btn")
    if (duvidaBtn) {
        const id = duvidaBtn.getAttribute("data-id")
        const produto = produtos.find(p => String(p.id) === id)
        if (produto) {
            const precoFormatado = produto.preco.toFixed(2).replace(".", ",")
            const msg = encodeURIComponent(`Quero saber mais sobre: ${produto.nome} - R$ ${precoFormatado} (${produto.categoria})`)
            window.open(`https://wa.me/${loja.whatsapp}?text=${msg}`, "_blank")
        }
        return
    }

    const increaseBtn = event.target.closest(".qty-increase")
    const decreaseBtn = event.target.closest(".qty-decrease")
    if (increaseBtn || decreaseBtn) {
        const seletor = event.target.closest(".qty-selector")
        const btnCarrinho = seletor.closest(".product-footer")?.querySelector(".add-to-cart-btn")
        const produtoId = btnCarrinho ? btnCarrinho.getAttribute("data-id") : null

        let qtd = parseInt(seletor.getAttribute("data-qty"), 10)

        if (increaseBtn) {
            const disponivel = estoqueDisponivel(produtoId)
            if (qtd + 1 > disponivel) {
                avisarEstoqueInsuficiente(disponivel)
                return
            }
            qtd += 1
        } else {
            qtd = Math.max(1, qtd - 1)
        }

        seletor.setAttribute("data-qty", qtd)
        seletor.querySelector(".qty-value").textContent = qtd
        return
    }

    let parentButton = event.target.closest(".add-to-cart-btn")
    if (parentButton) {
        // Produto esgotado: avisa e não adiciona
        if (parentButton.getAttribute("data-esgotado") === "true") {
            Toastify({
                text: "😕 Esse produto está esgotado no momento.",
                duration: 1000,
                gravity: "top",
                position: "right",
                style: { background: "#6b7280", borderRadius: "8px" },
            }).showToast()
            return
        }

        const id = parentButton.getAttribute("data-id")
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        const seletor = parentButton.closest(".product-footer").querySelector(".qty-selector")
        const qtd = seletor ? parseInt(seletor.getAttribute("data-qty"), 10) : 1

        const produtoCompleto = produtos.find(p => String(p.id) === id)

        // Produtos com opções não têm mais um modal próprio — as opções
        // ficam dentro do modal de produto. Então clicar no botão do
        // carrinho direto na lista, pra esses produtos, só abre o modal
        // (onde o cliente escolhe as opções e confirma por lá).
        if (produtoCompleto && produtoCompleto.opcoes && produtoCompleto.opcoes.length) {
            abrirProduto(produtoCompleto)
        } else {
            addToCart(id, name, price, parentButton, qtd)
        }

        if (seletor) {
            seletor.setAttribute("data-qty", "1")
            seletor.querySelector(".qty-value").textContent = "1"
        }
    }
})

function addToCart(id, name, price, btnElement, quantity = 1, opcoesSelecionadas = null, observacao = "") {
    const disponivel = estoqueDisponivel(id)
    if (quantity > disponivel) {
        avisarEstoqueInsuficiente(disponivel)
        return
    }

    const precoAdicional = opcoesSelecionadas
        ? opcoesSelecionadas.reduce((soma, item) => soma + item.preco_adicional * (item.quantidade || 1), 0)
        : 0
    const precoFinal = price + precoAdicional

    // Itens com opções (incluindo quantidade de cada uma) ou observação
    // diferentes viram linhas separadas no carrinho.
    const partesChave = []
    if (opcoesSelecionadas && opcoesSelecionadas.length) {
        partesChave.push(opcoesSelecionadas.map(o => `${o.nome}:${o.quantidade || 1}`).sort().join(","))
    }
    if (observacao) partesChave.push(`obs:${observacao}`)
    const chave = partesChave.length ? `${id}__${partesChave.join("|")}` : id

    const produtoRef = produtos.find(p => String(p.id) === String(id))
    const foto = produtoRef && produtoRef.fotos ? produtoRef.fotos[0] : ""

    const existingItem = cart.find(item => item.chave === chave)

    if (existingItem) {
        existingItem.quantity += quantity
    } else {
        cart.push({ id, chave, name, price: precoFinal, quantity, opcoes: opcoesSelecionadas, foto, observacao })
    }

    updateCartModal()

    if (btnElement) {
        btnElement.classList.add("cart-animate")
        setTimeout(() => btnElement.classList.remove("cart-animate"), 600)
    }

    cartCounter.classList.add("counter-animate")
    setTimeout(() => cartCounter.classList.remove("counter-animate"), 400)

    Toastify({
        text: `✅ "${name}" adicionado!`,
        duration: 1000,
        gravity: "top",
        position: "right",
        stopOnFocus: false,
        style: {
            background: corDoToast(),
            borderRadius: "8px",
            fontSize: "14px",
        },
    }).showToast()
}


// ===========================
// ATUALIZAR MODAL DO CARRINHO
// ===========================
function updateCartModal() {
    atualizarVisibilidadeEncomenda()
    atualizarLinhaTaxa()

    cartItemsContainer.innerHTML = ""
    let subtotal = 0

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center py-6 text-gray-400">
                <i class="fa fa-shopping-cart text-4xl mb-2 block"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `
        cartTotal.textContent = "R$ 0,00"
        document.getElementById("resumo-subtotal").textContent = "R$ 0,00"
        cartCounter.textContent = "0"
        addMoreItemsBtn.style.display = "none"
        return
    }

    addMoreItemsBtn.style.display = "flex"

    cart.forEach(item => {
        const cartItemElement = document.createElement("div")
        cartItemElement.className = "cart-item-card"

        const opcoesTexto = item.opcoes && item.opcoes.length
            ? `<p class="text-xs text-gray-500 mb-1">${agruparOpcoesPorGrupo(item.opcoes).join(" · ")}</p>`
            : ""
        const obsTexto = item.observacao
            ? `<p class="text-xs italic text-gray-500 mb-1">Obs: ${escaparHtml(item.observacao)}</p>`
            : ""

        cartItemElement.innerHTML = `
            <img src="${item.foto || ''}" alt="" onerror="imagemFallbackProduto(this, '56x56')" />
            <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                    <p class="font-bold text-sm">${item.name}</p>
                    <button class="remove-from-cart-btn cart-item-remove" data-chave="${item.chave}" title="Remover">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
                ${opcoesTexto}
                ${obsTexto}
                <div class="flex items-center justify-between mt-1">
                    <div class="flex items-center gap-2">
                        <button class="decrease-btn w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100" data-chave="${item.chave}">−</button>
                        <span class="font-bold w-5 text-center">${item.quantity}</span>
                        <button class="increase-btn w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100" data-chave="${item.chave}">+</button>
                    </div>
                    <p class="font-bold text-sm" style="color: var(--laranja);">
                        R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}
                    </p>
                </div>
            </div>
        `

        subtotal += item.price * item.quantity
        cartItemsContainer.appendChild(cartItemElement)
    })

    const taxaAplicavel = (tipoEntrega === "entrega" && taxaEntregaAtual !== null) ? taxaEntregaAtual : 0
    const totalFinal = subtotal + taxaAplicavel

    document.getElementById("resumo-subtotal").textContent = subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    cartTotal.textContent = totalFinal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

    const totalItens = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCounter.textContent = totalItens
}


// ===========================
// CONTROLES DE QUANTIDADE E REMOÇÃO
// ===========================
cartItemsContainer.addEventListener("click", function (event) {
    const removeBtn = event.target.closest(".remove-from-cart-btn")
    const increaseBtn = event.target.closest(".increase-btn")
    const decreaseBtn = event.target.closest(".decrease-btn")

    if (removeBtn) removeItemCart(removeBtn.getAttribute("data-chave"))
    if (increaseBtn) increaseItem(increaseBtn.getAttribute("data-chave"))
    if (decreaseBtn) decreaseItem(decreaseBtn.getAttribute("data-chave"))
})

function increaseItem(chave) {
    const item = cart.find(i => i.chave === chave)
    if (!item) return

    const disponivel = estoqueDisponivel(item.id)
    if (disponivel < 1) {
        avisarEstoqueInsuficiente(0)
        return
    }

    item.quantity += 1
    updateCartModal()
}

function decreaseItem(chave) {
    const item = cart.find(i => i.chave === chave)
    if (item) {
        if (item.quantity > 1) { item.quantity -= 1; updateCartModal() }
        else { removeItemCart(chave) }
    }
}

function removeItemCart(chave) {
    const index = cart.findIndex(item => item.chave === chave)
    if (index !== -1) { cart.splice(index, 1); updateCartModal() }
}


// ===========================
// CARTÃO DE ENDEREÇO + MODAL DE EDIÇÃO
// No modo entrega, o cartão mostra o endereço já preenchido (ou o
// convite pra preencher) e abre o modal de edição ao ser tocado. No
// modo retirada, mostra o endereço da própria loja e não abre nada.
// ===========================
const enderecoCard = document.getElementById("endereco-card")
const enderecoCardIcone = document.getElementById("endereco-card-icone")
const enderecoCardLabel = document.getElementById("endereco-card-label")
const enderecoCardValor = document.getElementById("endereco-card-valor")
const enderecoCardSeta = document.getElementById("endereco-card-seta")
const addressModal = document.getElementById("address-modal")

function atualizarCartaoEndereco() {
    if (tipoEntrega === "retirada") {
        enderecoCard.classList.add("modo-retirada", "somente-info")
        enderecoCardIcone.innerHTML = `<i class="fa fa-store"></i>`
        enderecoCardLabel.textContent = "RETIRAR NA LOJA"
        enderecoCardValor.textContent = loja.endereco || "Endereço não informado"
        enderecoCardSeta.style.display = "none"
        return
    }

    enderecoCard.classList.remove("modo-retirada", "somente-info")
    enderecoCardIcone.innerHTML = `<i class="fa fa-location-dot"></i>`
    enderecoCardLabel.textContent = "ENTREGAR EM"
    enderecoCardSeta.style.display = ""

    const rua = addressRua.value.trim()
    const bairro = addressBairro.value.trim()
    if (rua || bairro) {
        const numero = addressNumero.value.trim()
        enderecoCardValor.textContent = `${rua}${numero ? ", " + numero : ""}${bairro ? " - " + bairro : ""}`
    } else {
        enderecoCardValor.textContent = "Toque para informar o endereço"
    }
}

enderecoCard.addEventListener("click", () => {
    if (tipoEntrega === "retirada") return
    abrirModalEndereco()
})

function abrirModalEndereco() {
    addressModal.classList.add("open")
    document.body.style.overflow = "hidden"
    history.pushState({ enderecoModalAberto: true }, "")
}

function fecharModalEndereco() {
    addressModal.classList.remove("open")
    restaurarOverflowBody()
    if (history.state && history.state.enderecoModalAberto) {
        ignorarProximoPopstate = true
        history.back()
    }
}

function fecharModalEnderecoSeOverlay(event) {
    if (event.target === addressModal) fecharModalEndereco()
}

document.getElementById("address-close-btn").addEventListener("click", fecharModalEndereco)

document.getElementById("address-salvar-btn").addEventListener("click", () => {
    const bairroPendente = bairroPendenteSelecao()

    if (addressRua.value.trim() === "" || addressBairro.value.trim() === "" || bairroPendente) {
        addressWarn.textContent = bairroPendente
            ? "Selecione o seu bairro na lista!"
            : "Preencha ao menos a rua e o bairro!"
        addressWarn.classList.remove("hidden")

        if (addressRua.value.trim() === "") addressRua.classList.add("border-red-500")
        if (bairroPendente) {
            document.getElementById("address-bairro-select").classList.add("border-red-500")
        } else if (addressBairro.value.trim() === "") {
            addressBairro.classList.add("border-red-500")
        }

        const campoParaFoco = addressRua.value.trim() === ""
            ? addressRua
            : (bairroPendente ? document.getElementById("address-bairro-select") : addressBairro)
        campoParaFoco.focus()
        return
    }
    atualizarCartaoEndereco()
    updateCartModal()
    fecharModalEndereco()
})

function limparAvisoEndereco() {
    if (addressRua.value.trim() !== "" && addressBairro.value.trim() !== "") {
        addressRua.classList.remove("border-red-500")
        addressBairro.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
}
addressRua.addEventListener("input", limparAvisoEndereco)
addressBairro.addEventListener("input", limparAvisoEndereco)


// ===========================
// AJUSTE DE ESTOQUE SEM CONDIÇÃO DE CORRIDA
// CORRIGIDO: antes, o padrão "ler estoque → calcular → gravar" podia
// perder atualizações quando dois pedidos do mesmo produto chegavam
// quase ao mesmo tempo (ex: duas mesas pedindo a mesma bebida) — os
// dois liam o mesmo valor antes de qualquer um gravar, e o segundo
// gravava por cima do primeiro, perdendo um dos descontos.
// Agora a gravação só é aceita se o estoque no banco ainda for
// exatamente o valor que foi lido (.eq("estoque", estoqueLido)). Se
// outro pedido escreveu no meio do caminho, a gravação não afeta
// nenhuma linha e a função tenta de novo com o valor mais recente,
// até um limite de tentativas.
// ===========================
async function ajustarEstoqueComRetentativa(cliente, produtoId, delta, maxTentativas = 5) {
    for (let tentativa = 0; tentativa < maxTentativas; tentativa++) {
        const { data: prod, error: erroBusca } = await cliente
            .from("produtos")
            .select("estoque")
            .eq("id", produtoId)
            .single()

        if (erroBusca || !prod || prod.estoque === null || prod.estoque === undefined) {
            return { sucesso: false }
        }

        const estoqueLido = prod.estoque
        const faltouEstoque = delta < 0 && (estoqueLido + delta) < 0 // pediu mais do que tinha disponível
        const novoEstoque = Math.max(0, estoqueLido + delta)
        // O status de "esgotado" agora é sempre CALCULADO a partir do
        // estoque (ver produtoEstaEsgotado) — o ajuste automático de
        // estoque nunca mais grava/apaga essa coluna, pra não sobrescrever
        // um "Esgotado" marcado manualmente pelo lojista no cadastro do
        // produto (ex: acabou a matéria-prima mas o campo estoque ainda
        // não foi zerado).
        const atualizacao = { estoque: novoEstoque }

        const { data: linhasAfetadas, error: erroUpdate } = await cliente
            .from("produtos")
            .update(atualizacao)
            .eq("id", produtoId)
            .eq("estoque", estoqueLido)
            .select("id")

        if (!erroUpdate && linhasAfetadas && linhasAfetadas.length > 0) {
            return { sucesso: true, novoEstoque, faltouEstoque }
        }

        await new Promise(r => setTimeout(r, 80 + Math.random() * 120))
    }

    console.error("Não foi possível ajustar o estoque do produto após várias tentativas (concorrência alta)", produtoId)
    return { sucesso: false }
}

// ===========================
// BAIXA DE ESTOQUE
// Roda no momento em que um pedido é finalizado (mesa, delivery
// ou retirada). Recebe o carrinho e desconta a quantidade comprada
// do estoque de cada produto. Produtos com estoque = null não são
// controlados, então são ignorados. Ao chegar a 0, marca esgotado
// automaticamente (assim o produto já aparece indisponível pro
// próximo cliente, sem precisar o lojista mexer no admin).
//
// CORRIGIDO: também atualiza o array local "produtos" com o novo
// valor de estoque/esgotado. Antes, só o banco era atualizado — se
// o mesmo cliente tentasse comprar o mesmo item de novo na mesma
// visita (sem recarregar a página), estoqueDisponivel() continuava
// enxergando o número antigo e podia deixar passar mais unidades
// do que o estoque real permitia.
// ===========================
async function baixarEstoque(itensCarrinho) {
    // Processa todos os itens em paralelo em vez de um por vez — cada
    // item já tem sua própria leitura+gravação; fazer isso em sequência
    // era uma das causas do "travamento" no checkout.
    const resultados = await Promise.all(itensCarrinho.map(async (item) => {
        try {
            const resultado = await ajustarEstoqueComRetentativa(supabaseClient, item.id, -item.quantity)
            if (!resultado.sucesso) return null

            const produtoLocal = produtos.find(p => String(p.id) === String(item.id))
            if (produtoLocal) produtoLocal.estoque = resultado.novoEstoque

            return resultado.faltouEstoque ? { id: item.id, name: item.name } : null
        } catch (err) {
            console.error("Erro ao baixar estoque do produto", item.id, err)
            return null
        }
    }))

    return resultados.filter(Boolean)
}

// ============================================================
// GRAVAÇÃO COM RETENTATIVA + FILA LOCAL DE PENDÊNCIAS
// Corrige pedidos que iam pro WhatsApp mas não apareciam no
// Histórico Delivery do painel: antes, se o insert em
// "comandas_finalizadas"/"relatorio_dia" falhasse (rede instável do
// cliente), o erro só ia pro console e o pedido seguia pro WhatsApp
// mesmo assim — sem nenhum registro no painel e sem ninguém saber
// que faltou.
// Agora: tenta de novo algumas vezes (com pequena espera crescente).
// Se mesmo assim falhar, guarda o registro no localStorage do
// cliente e tenta reenviar automaticamente na próxima vez que o
// cardápio for aberto nesse mesmo aparelho.
// ============================================================
const CHAVE_FILA_PENDENTES = "fila-pendentes-historico"

async function registrarErroCliente(contexto, erro) {
    if (!loja || !loja.id) return
    try {
        const { error } = await supabaseClient.from("logs_erro_cliente").insert({
            loja_id: loja.id,
            contexto,
            mensagem_erro: erro ? `${erro.code || ""} ${erro.message || erro}`.trim() : "erro desconhecido"
        })
        if (error) console.error("Não foi possível registrar o log de erro", error)
    } catch (err) {
        console.error("Erro de rede ao registrar log de erro", err)
    }
}

async function gravarComRetentativa(tabela, registro, maxTentativas = 4) {
    let ultimoErro = null
    for (let tentativa = 0; tentativa < maxTentativas; tentativa++) {
        // CORRIGIDO: sem "returning: minimal", o insert também pedia a
        // linha de volta (RETURNING) — e como o cliente anônimo não tem
        // permissão de SELECT nessas tabelas, o Postgres barrava o INSERT
        // inteiro com erro de row-level security (42501), mesmo a policy
        // de INSERT estando liberada pra ele.
        const { error } = await supabaseClient.from(tabela).insert(registro, { returning: "minimal" })
        if (!error) return true
        ultimoErro = error
        console.error(`Erro ao gravar em "${tabela}" (tentativa ${tentativa + 1}/${maxTentativas})`, error)
        if (tentativa < maxTentativas - 1) {
            await new Promise(r => setTimeout(r, 500 * (tentativa + 1)))
        }
    }
    await registrarErroCliente(tabela, ultimoErro)
    return false
}

async function gravarComRetentativaDetalhado(tabela, registro, maxTentativas = 4) {
    let ultimoErro = null
    for (let tentativa = 0; tentativa < maxTentativas; tentativa++) {
        // CORRIGIDO: mesma causa do erro 42501 em "relatorio_dia" e
        // "comandas_finalizadas" — o insert pedia a linha de volta
        // (RETURNING) e esbarrava na policy de SELECT, que não libera o
        // cliente anônimo. "returning: minimal" evita esse RETURNING.
        const { error } = await supabaseClient.from(tabela).insert(registro, { returning: "minimal" })
        if (!error) return { sucesso: true, erro: null }
        ultimoErro = error
        console.error(`Erro ao gravar em "${tabela}" (tentativa ${tentativa + 1}/${maxTentativas})`, error)
        if (tentativa < maxTentativas - 1) {
            await new Promise(r => setTimeout(r, 500 * (tentativa + 1)))
        }
    }
    await registrarErroCliente(tabela, ultimoErro)
    return { sucesso: false, erro: ultimoErro }
}

function guardarRegistroPendente(tabela, registro) {
    try {
        const fila = JSON.parse(localStorage.getItem(CHAVE_FILA_PENDENTES) || "[]")
        fila.push({ tabela, registro, criadoEm: Date.now() })
        localStorage.setItem(CHAVE_FILA_PENDENTES, JSON.stringify(fila))
    } catch (err) {
        console.error("Não foi possível guardar o registro pendente localmente", err)
    }
}

// Roda ao carregar o cardápio: tenta reenviar qualquer pedido que
// tenha ficado pendente numa visita anterior. Best effort — se falhar
// de novo, permanece na fila pra tentar na próxima visita.
async function tentarReenviarRegistrosPendentes() {
    let fila
    try {
        fila = JSON.parse(localStorage.getItem(CHAVE_FILA_PENDENTES) || "[]")
    } catch (err) {
        return
    }
    if (!fila.length) return

    const restantes = []
    for (const pendente of fila) {
        const ok = await gravarComRetentativa(pendente.tabela, pendente.registro, 2)
        if (!ok) restantes.push(pendente)
    }

    try {
        localStorage.setItem(CHAVE_FILA_PENDENTES, JSON.stringify(restantes))
    } catch (err) { /* ignora */ }
}

// ===========================
// FINALIZAR PEDIDO
// Modo delivery/retirada: comportamento de sempre, manda pro WhatsApp.
// Modo mesa: grava o pedido em `pedidos_mesa` no Supabase, sem WhatsApp;
// o atendimento acompanha e finaliza a comanda pelo painel admin (é lá
// que a baixa de estoque da mesa acontece, na finalização da comanda).
//
// CORRIGIDO: o botão de finalizar agora fica desabilitado durante todo
// o processamento (não só no modo mesa) — evita que um duplo clique/
// duplo toque envie o pedido duas vezes pro WhatsApp, grave duas
// entradas no relatório/histórico e baixe o estoque em dobro.
// ===========================
checkoutBtn.addEventListener("click", async function () {
    if (checkoutBtn.disabled) return

    const isOpen = checkStoreOpen()
    if (!isOpen) {
        Toastify({
            text: "Ops! A loja está fechada no momento.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: { background: "#ef4444", borderRadius: "8px" },
        }).showToast()
        return
    }

    if (cart.length === 0) {
        Toastify({
            text: "Adicione produtos ao carrinho primeiro!",
            duration: 2500,
            gravity: "top",
            position: "right",
            style: { background: "#f59e0b", borderRadius: "8px" },
        }).showToast()
        return
    }

    // ---- MODO MESA (via QR Code) OU MESA MANUAL (loja só-mesa, sem
    // delivery/retirada, cliente digitou o número): grava no banco, não
    // vai pro WhatsApp. (a baixa de estoque da mesa acontece só quando a
    // comanda é finalizada no painel admin, não a cada pedido enviado daqui)
    if (modoMesa || somenteMesaSemQr) {
        const mesaParaPedido = modoMesa ? mesaAtual : validarMesaManual()

        if (!mesaParaPedido) {
            document.getElementById("mesa-manual-input")?.focus()
            return
        }

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

        checkoutBtn.disabled = true

        // Gera o id aqui mesmo, no navegador do cliente, e já manda ele
        // no insert — assim não depende de nenhuma permissão de SELECT
        // liberada pra chave anônima (que pode não existir hoje) só pra
        // descobrir qual linha acabou de ser criada.
        const idPedido = gerarIdPedido()

        const registroPedidoMesa = {
            id: idPedido,
            loja_id: loja.id,
            mesa: mesaParaPedido,
            itens: cart,
            total
        }
        const pedidoMesaOk = await gravarComRetentativa("pedidos_mesa", registroPedidoMesa)

        if (!pedidoMesaOk) {
            checkoutBtn.disabled = false
            Toastify({
                text: "Erro ao enviar pedido, tente de novo.",
                duration: 2500,
                gravity: "top",
                position: "right",
                style: { background: "#ef4444", borderRadius: "8px" },
            }).showToast()
            return
        }

        // Desconta do estoque JÁ, no momento do pedido — não espera a
        // mesa fechar a comanda inteira, senão outras mesas pedindo o
        // mesmo produto não veriam o estoque real enquanto essa mesa
        // continua aberta.
        const itensEmFalta = await baixarEstoque(cart)

        if (itensEmFalta.length) {
            // Marca no próprio pedido quais itens ficaram sem estoque
            // suficiente. Se essa segunda escrita falhar (ex: falta
            // permissão de UPDATE pra chave anônima), o pedido em si já
            // foi enviado normalmente — só o aviso extra que não aparece
            // pro garçom, sem travar o cliente.
            const itensComAlerta = cart.map(item => ({
                ...item,
                alerta_estoque: itensEmFalta.some(f => String(f.id) === String(item.id))
            }))
            const { error: erroAlerta } = await supabaseClient.from("pedidos_mesa")
                .update({ itens: itensComAlerta })
                .eq("id", idPedido)

            if (erroAlerta) console.error("Não foi possível marcar o alerta de estoque no pedido", erroAlerta)

            Toastify({
                text: `⚠️ Pedido enviado, mas "${itensEmFalta.map(f => f.name).join(", ")}" pode estar em falta. O atendimento vai confirmar.`,
                duration: 4500,
                gravity: "top",
                position: "right",
                style: { background: "#f59e0b", borderRadius: "8px" },
            }).showToast()
        } else {
            Toastify({
                text: "✅ Pedido enviado pra cozinha!",
                duration: 2000,
                gravity: "top",
                position: "right",
                style: { background: corDoToast(), borderRadius: "8px" },
            }).showToast()
        }

        // Só reabilita o botão (e limpa o carrinho) depois que TODO o
        // trabalho assíncrono terminou — evita a janela de duplo clique
        // reenviando o mesmo carrinho como um segundo pedido.
        checkoutBtn.disabled = false
        cart = []
        const inputMesaManual = document.getElementById("mesa-manual-input")
        if (inputMesaManual) inputMesaManual.value = ""
        updateCartModal()
        fecharModalCarrinho()
        return
    }

    // ---- MODO DELIVERY/RETIRADA: fluxo original, vai pro WhatsApp ----
    const bairroPendenteCheckout = tipoEntrega === "entrega" && bairroPendenteSelecao()
    if (tipoEntrega === "entrega" && (addressRua.value.trim() === "" || addressBairro.value.trim() === "" || bairroPendenteCheckout)) {
        abrirModalEndereco()
        addressWarn.textContent = bairroPendenteCheckout
            ? "Selecione o seu bairro na lista!"
            : "Preencha ao menos a rua e o bairro!"
        addressWarn.classList.remove("hidden")

        if (addressRua.value.trim() === "") addressRua.classList.add("border-red-500")
        if (bairroPendenteCheckout) {
            document.getElementById("address-bairro-select").classList.add("border-red-500")
        } else if (addressBairro.value.trim() === "") {
            addressBairro.classList.add("border-red-500")
        }
        return
    }

    if (!validarDataEncomenda()) {
        document.getElementById("encomenda-data")?.focus()
        return
    }

    if (!validarFormaPagamento()) {
        document.getElementById("payment-section")?.scrollIntoView({ behavior: "smooth", block: "center" })
        return
    }

    checkoutBtn.disabled = true

    try {
        const cartItems = cart.map(item => {
            const linhaOpcoes = item.opcoes && item.opcoes.length
                ? "\n  " + agruparOpcoesPorGrupo(item.opcoes).join("\n  ")
                : ""
            const linhaObs = item.observacao ? `\n  Obs: ${item.observacao}` : ""
            const produtoRef = produtos.find(p => String(p.id) === String(item.id))
            const esconderQtd = produtoRef && produtoRef.esconder_setas && item.quantity === 1
            const linhaQtd = esconderQtd ? "" : `Qtd: ${item.quantity} | `
            return `- ${item.name}${linhaOpcoes}${linhaObs}\n  ${linhaQtd}R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}`
        }).join("\n")

        const subtotalPedido = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const taxaEntregaPedido = (tipoEntrega === "entrega" && taxaEntregaAtual !== null) ? taxaEntregaAtual : 0
        const total = subtotalPedido + taxaEntregaPedido
        const totalFormatado = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

        const agora = new Date()
        const dataHoraFormatada = agora.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })

        const linhaRuaNumero = addressRua.value.trim() + (addressNumero.value.trim() ? ` - nº ${addressNumero.value.trim()}` : "")

        const enderecoCompleto = [
            `Endereço: ${linhaRuaNumero}`,
            addressBairro.value.trim() ? `Bairro: ${addressBairro.value.trim()}` : "",
            addressReferencia.value.trim() ? `Referência: ${addressReferencia.value.trim()}` : ""
        ].filter(Boolean).join("\n")

        const modoEntrega = tipoEntrega === "entrega"
            ? `*Entrega*\n${enderecoCompleto}`
            : `*Retirada na loja*`

        const linhaPagamento = `\n*Pagamento:* ${tipoPagamento}`

        const itensEncomenda = itensSobEncomendaNoCarrinho()
        const linhaEncomenda = itensEncomenda.length
            ? `\n*Data desejada:* ${new Date(document.getElementById("encomenda-data").value + "T00:00:00").toLocaleDateString("pt-BR")}` +
              (referenciaImagemEncomendaUrl ? `\n*Referência anexada:* ${referenciaImagemEncomendaUrl}` : "")
            : ""

        // Baixa o estoque ANTES de abrir o WhatsApp — assim, se algum
        // item ficou sem estoque suficiente no meio do caminho, a própria
        // mensagem que vai pro WhatsApp da loja já sai com o aviso.
        const itensEmFalta = await baixarEstoque(cart)

        const avisoEstoque = itensEmFalta.length
            ? `\n⚠️ *Atenção:* conferir estoque de: ${itensEmFalta.map(i => i.name).join(", ")}\n`
            : ""

        const linhaTaxaMensagem = taxaEntregaPedido > 0
            ? `Subtotal: ${subtotalPedido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n` +
              `Taxa de entrega: ${taxaEntregaPedido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`
            : ""

        const message =
            `*Pedido - ${loja.nome}*\n` +
            `Data/Hora: ${dataHoraFormatada}\n` +
            `--------------------------------\n` +
            `${cartItems}\n` +
            `--------------------------------\n` +
            linhaTaxaMensagem +
            `*Total: ${totalFormatado}*\n` +
            avisoEstoque +
            `\n${modoEntrega}\n` +
            linhaPagamento +
            linhaEncomenda

        const urlWhats = `https://wa.me/${loja.whatsapp}?text=${encodeURIComponent(message)}`

        // CORRIGIDO: os registros no banco (relatorio_dia e
        // comandas_finalizadas/pedidos_encomenda — o que alimenta o
        // Dashboard e o Histórico Delivery do painel admin) agora rodam
        // e são aguardados (await) ANTES de abrir o WhatsApp, não depois.
        // No celular, navegar pro app do WhatsApp suspende a aba de
        // origem — se o INSERT ainda estivesse em andamento nesse
        // momento, ele era interrompido no meio do caminho e o pedido
        // nunca aparecia no painel, mesmo tendo sido enviado normalmente
        // pro WhatsApp. Gravando antes, o pedido só é considerado
        // "pronto" depois que já está salvo no banco.
        const itensSomados = {}
        cart.forEach(item => {
            const chave = item.chave || item.name
            if (!itensSomados[chave]) itensSomados[chave] = { name: item.name, opcoes: item.opcoes, quantity: 0, price: item.price }
            itensSomados[chave].quantity += item.quantity
        })

        const registroRelatorio = {
            loja_id: loja.id,
            origem: tipoEntrega,   // 'entrega' ou 'retirada'
            itens: itensSomados,
            total
        }

        const registroSecundario = itensEncomenda.length
            ? {
                tabela: "pedidos_encomenda",
                registro: {
                    loja_id: loja.id,
                    data_desejada: document.getElementById("encomenda-data").value,
                    referencia_imagem_url: referenciaImagemEncomendaUrl,
                    mensagem: message,
                    total,
                    itens: itensSomados
                }
            }
            : {
                tabela: "comandas_finalizadas",
                registro: {
                    loja_id: loja.id,
                    origem: "delivery",
                    mesa: null,
                    mensagem: message,
                    total,
                    itens: itensSomados
                }
            }

        // Roda os dois inserts em paralelo em vez de um depois do outro.
        // maxTentativas=2 aqui: esses dois registros já têm rede de
        // segurança (fila local + reenvio automático via "online" e o
        // setInterval de 60s) — não vale a pena travar o cliente
        // esperando 4 tentativas síncronas pra algo que não é a
        // confirmação do pedido em si.
        const [resultadoRelatorio, resultadoSecundario] = await Promise.all([
            gravarComRetentativaDetalhado("relatorio_dia", registroRelatorio, 2),
            gravarComRetentativaDetalhado(registroSecundario.tabela, registroSecundario.registro, 2)
        ])

        const relatorioOk = resultadoRelatorio.sucesso
        const secundarioOk = resultadoSecundario.sucesso

        if (!relatorioOk) guardarRegistroPendente("relatorio_dia", registroRelatorio)
        if (!secundarioOk) guardarRegistroPendente(registroSecundario.tabela, registroSecundario.registro)

        // Antes, se a gravação falhasse, o cliente via "Pedido enviado!"
        // como se tivesse dado tudo certo. Agora avisa quando cai pra
        // fila local, em vez de mentir sucesso — e mostra o erro real
        // direto no toast, pra dar pra ler sem precisar de DevTools.
        if (!relatorioOk || !secundarioOk) {
            const detalhesErro = [resultadoRelatorio, resultadoSecundario]
                .filter(r => !r.sucesso && r.erro)
                .map(r => `${r.erro.code || ""} ${r.erro.message || r.erro}`.trim())
                .join(" | ")

            Toastify({
                text: `⚠️ Pedido enviado, mas não salvou no painel ainda.${detalhesErro ? " Erro: " + detalhesErro : ""}`,
                duration: 10000,
                close: true,
                gravity: "top",
                position: "right",
                style: { background: "#f59e0b", borderRadius: "8px" },
            }).showToast()
        }

        // Só agora, com o pedido já salvo no banco, abre o WhatsApp. Usa
        // https://wa.me/ (em vez do esquema whatsapp://) porque funciona
        // tanto no celular (abre o app) quanto no computador (abre o
        // WhatsApp Web) — o esquema whatsapp:// trava numa aba em branco
        // quando não existe um app instalado que saiba tratar esse
        // protocolo, como acontece testando no navegador do PC sem o
        // WhatsApp Desktop.
        if (tipoPagamento === "Pix" && loja.chavePix) {
            abrirModalPix(total, urlWhats)
        } else {
            abrirLinkWhats(urlWhats)
        }

        if (itensEmFalta.length) {
            Toastify({
                text: `⚠️ Pedido enviado, mas "${itensEmFalta.map(i => i.name).join(", ")}" pode estar em falta.`,
                duration: 4000,
                gravity: "top",
                position: "right",
                style: { background: "#f59e0b", borderRadius: "8px" },
            }).showToast()
        }

        cart = []
        tipoEntrega = "entrega"
        tipoPagamento = null
        addressRua.value = ""
        addressNumero.value = ""
        addressBairro.value = ""
        addressReferencia.value = ""
        taxaEntregaAtual = null
        popularSelectBairros() // reseta o select de bairro (e a taxa) pro próximo pedido
        selecionarEntrega("entrega")
        document.getElementById("pag-pix")?.classList.remove("selected")
        document.getElementById("pag-dinheiro")?.classList.remove("selected")
        document.getElementById("pag-cartao")?.classList.remove("selected")
        referenciaImagemEncomendaUrl = null // já foi salva no pedido — zera só a referência local, não apaga do storage
        document.getElementById("encomenda-data").value = ""
        document.getElementById("encomenda-referencia-preview").style.display = "none"
        document.getElementById("encomenda-referencia-status").textContent = ""
        updateCartModal()
        fecharModalCarrinho()
    } catch (err) {
        console.error("Erro ao finalizar pedido", err)
        Toastify({
            text: "Erro ao enviar pedido, tente de novo.",
            duration: 2500,
            gravity: "top",
            position: "right",
            style: { background: "#ef4444", borderRadius: "8px" },
        }).showToast()
    } finally {
        checkoutBtn.disabled = false
    }
})


// ===========================
// VERIFICAR HORÁRIO DA LOJA
// ===========================
function checkStoreOpen() {
    const dias = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"]
    const agora = new Date()
    const diaDeHoje = dias[agora.getDay()]
    const minutosAgora = agora.getHours() * 60 + agora.getMinutes()
    let intervalosHoje = loja.horario[diaDeHoje]

    if (!intervalosHoje) return false

    // Compatibilidade: se vier no formato antigo (objeto único),
    // transforma em array de 1 item
    if (!Array.isArray(intervalosHoje)) {
        intervalosHoje = [intervalosHoje]
    }

    return intervalosHoje.some(({ abre, fecha }) => {
        const minutosAbre = paraMinutos(abre, 0)
        const minutosFecha = paraMinutos(fecha, 0)
        if (minutosAbre === minutosFecha) return false
        if (minutosFecha < minutosAbre) {
            return minutosAgora >= minutosAbre || minutosAgora < minutosFecha
        }
        return minutosAgora >= minutosAbre && minutosAgora < minutosFecha
    })
}

function aplicarStatusLoja() {
    const pill = document.getElementById("status-loja-pill")
    const texto = document.getElementById("status-loja-texto")
    const isOpen = checkStoreOpen()

    pill.classList.toggle("fechada", !isOpen)
    texto.textContent = isOpen ? "Aberto agora" : "Fechado"
}


// ===========================
// MODAL DE PRODUTO
// ===========================
let produtoAtual = null
let fotosAtual = []

function abrirProduto(produto) {
    produtoAtual = produto
    fotosAtual = produto.fotos

    document.getElementById("modal-observacao").value = ""
    document.getElementById("modal-observacao-wrap").style.display = produto.esconder_observacao ? "none" : "block"

    document.getElementById("modal-qty-selector").setAttribute("data-qty", "1")
    document.getElementById("modal-qty-value").textContent = "1"
    document.getElementById("modal-qty-selector").style.display = (produto.esconder_setas || produtoEstaEsgotado(produto)) ? "none" : "flex"

    const modalJaAberto = document.getElementById("product-modal").classList.contains("open")

    document.getElementById("modal-main-img").src = fotosAtual[0]
    document.getElementById("modal-main-img").alt = produto.nome

    // Monta a galeria com quantas fotos o produto tiver (1, 2, 3...).
    // Se só tiver 1 foto, não mostra miniaturas.
    const galeria = document.getElementById("modal-gallery")
    galeria.innerHTML = ""
    if (fotosAtual.length > 1) {
        fotosAtual.forEach((foto, i) => {
            const thumb = document.createElement("img")
            thumb.src = foto
            thumb.alt = `Foto ${i + 1}`
            if (i === 0) thumb.classList.add("active")
            thumb.onerror = function () { imagemFallbackProduto(thumb, "200x200") }
            thumb.addEventListener("click", () => trocarFoto(i))
            galeria.appendChild(thumb)
        })
    }

    document.getElementById("modal-name").textContent = produto.nome
    document.getElementById("modal-desc").textContent = produto.desc

    const esconderPrecoModal = produto.preco === 0
    document.getElementById("modal-price").textContent = esconderPrecoModal ? "" : "R$ " + produto.preco.toFixed(2).replace(".", ",")

    renderizarOpcoesProduto(produto)

    const modalAddBtn = document.getElementById("modal-add-btn")
    if (produtoEstaEsgotado(produto)) {
        modalAddBtn.classList.add("esgotado-btn")
        modalAddBtn.innerHTML = `<i class="fa fa-ban"></i> Esgotado`
        modalAddBtn.onclick = function () {
            Toastify({
                text: "😕 Esse produto está esgotado no momento.",
                duration: 2500,
                gravity: "top",
                position: "right",
                style: { background: "#6b7280", borderRadius: "8px" },
            }).showToast()
        }
    } else {
        modalAddBtn.classList.remove("esgotado-btn")
        atualizarBotaoAdicionarModal()
        modalAddBtn.onclick = function () {
            const qtd = parseInt(document.getElementById("modal-qty-selector").getAttribute("data-qty"), 10)
            const observacao = document.getElementById("modal-observacao").value.trim()

            if (produto.opcoes && produto.opcoes.length) {
                if (!gruposObrigatoriosCompletos(produto)) {
                    Toastify({
                        text: "Escolha as opções obrigatórias antes de continuar.",
                        duration: 2000,
                        gravity: "top",
                        position: "right",
                        style: { background: "#ef4444", borderRadius: "8px" },
                    }).showToast()
                    return
                }
                const todasOpcoes = Object.values(opcoesEscolhidas).flat()
                addToCart(produtoAtual.id, produtoAtual.nome, produtoAtual.preco, null, qtd, todasOpcoes, observacao)
            } else {
                addToCart(produtoAtual.id, produtoAtual.nome, produtoAtual.preco, null, qtd, null, observacao)
            }

            fecharModalProduto()
        }
    }

    document.getElementById("modal-whats-btn").onclick = function () {
        const precoFormatado = produto.preco.toFixed(2).replace(".", ",")
        const msg = encodeURIComponent(`Quero saber mais sobre: ${produto.nome} - R$ ${precoFormatado} (${produto.categoria})`)
        window.open(`https://wa.me/${loja.whatsapp}?text=${msg}`, "_blank")
    }

    document.getElementById("modal-share-btn").onclick = function () {
        const precoFormatado = produto.preco.toFixed(2).replace(".", ",")
        const siteUrl = window.location.href
        const msg =
            `Olha esse produto que achei na ${loja.nome}!\n\n` +
            `*${produto.nome}*\n` +
            `Preco: R$ ${precoFormatado}\n` +
            `Categoria: ${produto.categoria}\n\n` +
            `Acesse: ${siteUrl}`
        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank")
    }

    document.getElementById("product-modal").classList.add("open")
    document.body.style.overflow = "hidden"

    // Empilha uma marcação no histórico só na abertura (não de novo se
    // o usuário clicar em outro produto com o modal já aberto)
    if (!modalJaAberto) {
        history.pushState({ produtoModalAberto: true }, "")
    }
}

function trocarFoto(index) {
    document.getElementById("modal-main-img").src = fotosAtual[index]
    const thumbs = document.getElementById("modal-gallery").querySelectorAll("img")
    thumbs.forEach((thumb, i) => thumb.classList.toggle("active", i === index))
}

function fecharModalProduto() {
    document.getElementById("product-modal").classList.remove("open")
    restaurarOverflowBody()

    // Se tinha uma marcação empilhada pro modal, remove ela do histórico
    // (assim o botão de voltar não fica "gastando" um clique à toa depois)
    if (history.state && history.state.produtoModalAberto) {
        ignorarProximoPopstate = true
        history.back()
    }
}

function fecharModalProdutoSeOverlay(event) {
    if (event.target === document.getElementById("product-modal")) {
        fecharModalProduto()
    }
}

// ===========================
// OPÇÕES DO PRODUTO (sabores, adicionais etc.)
// Renderizadas dentro do próprio modal de produto — não existe mais
// um modal separado pra isso. Só aparece quando produto.opcoes existe.
// ===========================
let opcoesEscolhidas = {}

// Resolve o min/max real de um grupo, considerando dependência.
// bloqueado=true quando o grupo do qual ele depende ainda não tem
// seleção, ou a seleção atual não tem regra definida no mapa.
function limiteEfetivoGrupo(grupo) {
    if (!grupo.dependeDe || !grupo.dependeDe.grupoRef) {
        return { min: grupo.min || 0, max: grupo.max || 1, bloqueado: false }
    }
    const selecaoGatilho = (opcoesEscolhidas[grupo.dependeDe.grupoRef] || [])[0]
    if (!selecaoGatilho) return { min: 0, max: 0, bloqueado: true }

    const regra = grupo.dependeDe.mapa && grupo.dependeDe.mapa[selecaoGatilho.nome]
    if (!regra) return { min: 0, max: 0, bloqueado: true }

    return { min: regra.min, max: regra.max, bloqueado: false }
}

function renderizarOpcoesProduto(produto) {
    const editor = document.getElementById("modal-options-editor")
    opcoesEscolhidas = {}
    ;(produto.opcoes || []).forEach(grupo => { opcoesEscolhidas[grupo.nome] = [] })

    if (!produto.opcoes || !produto.opcoes.length) {
        editor.style.display = "none"
        document.getElementById("modal-options-grupos").innerHTML = ""
        return
    }

    editor.style.display = "block"
    rerenderTodosOsGrupos(produto)
}

// Redesenha todos os grupos a partir do estado atual de
// opcoesEscolhidas (sem resetar escolhas) — chamada sempre que uma
// escolha muda, pra grupos dependentes reagirem na hora.
function rerenderTodosOsGrupos(produto) {
    const container = document.getElementById("modal-options-grupos")
    container.innerHTML = ""

    produto.opcoes.forEach((grupo, indice) => {
        const limite = limiteEfetivoGrupo(grupo)

        if (!limite.bloqueado) {
            // Corta o excesso se a seleção não cabe mais no novo máximo
            let selecionados = opcoesEscolhidas[grupo.nome] || []
            let total = selecionados.reduce((s, i) => s + i.quantidade, 0)
            while (total > limite.max && selecionados.length) {
                const ultimo = selecionados[selecionados.length - 1]
                const reduzir = Math.min(ultimo.quantidade, total - limite.max)
                ultimo.quantidade -= reduzir
                total -= reduzir
                if (ultimo.quantidade <= 0) selecionados.pop()
            }
        } else {
            opcoesEscolhidas[grupo.nome] = []
        }

        container.appendChild(montarGrupoOpcaoDom(grupo, indice, limite))
    })

    atualizarBotaoAdicionarModal()
}

function montarGrupoOpcaoDom(grupo, indice, limite) {
    const grupoDiv = document.createElement("div")
    grupoDiv.className = "options-grupo"

    if (limite.bloqueado) {
        grupoDiv.innerHTML = `
            <p class="options-grupo-titulo"><span>${escaparHtml(grupo.nome)}${grupo.obrigatorio ? " *" : ""}</span></p>
            <p style="font-size:12.5px;color:#8a7361;">Escolha "${escaparHtml(grupo.dependeDe.grupoRef)}" primeiro pra liberar essa opção.</p>
        `
        return grupoDiv
    }

    const permiteRepetir = limite.max > 1
    const textoLimite = grupo.obrigatorio ? `Mín: ${limite.min} · Máx: ${limite.max}` : `Opcional · Máx: ${limite.max}`

    grupoDiv.innerHTML = `
        <p class="options-grupo-titulo">
            <span>${escaparHtml(grupo.nome)}${grupo.obrigatorio ? " *" : ""}</span>
            <span class="options-grupo-limite">
                ${textoLimite}${permiteRepetir ? " · pode repetir" : ""}
                ${grupo.obrigatorio ? `<span class="grupo-ok-badge" id="grupo-ok-${indice}">OK</span>` : ""}
            </span>
        </p>
    `

    grupo.itens.forEach(item => {
        const itemDiv = document.createElement("div")
        itemDiv.className = "options-item"
        const jaSelecionado = (opcoesEscolhidas[grupo.nome] || []).find(i => i.nome === item.nome)
        const precoHtml = item.preco_adicional > 0
            ? `<span class="options-item-preco">+R$ ${item.preco_adicional.toFixed(2).replace(".", ",")}</span>` : ""

        if (!permiteRepetir) {
            if (jaSelecionado) itemDiv.classList.add("selecionado")
            itemDiv.innerHTML = `<span>${escaparHtml(item.nome)}</span>${precoHtml}`
            itemDiv.addEventListener("click", () => alternarOpcaoUnica(grupo, item))
        } else {
            const qtd = jaSelecionado ? jaSelecionado.quantidade : 0
            if (qtd > 0) itemDiv.classList.add("selecionado")
            itemDiv.innerHTML = `
                <span>${escaparHtml(item.nome)}</span>
                <div class="options-item-direita">
                    ${precoHtml}
                    <button type="button" class="qty-btn options-item-minus" style="display:${qtd > 0 ? "flex" : "none"};">−</button>
                    <span class="qty-value options-item-qtd" style="display:${qtd > 0 ? "inline-block" : "none"};">${qtd}</span>
                    <button type="button" class="qty-btn options-item-plus">+</button>
                </div>
            `
            itemDiv.querySelector(".options-item-plus").addEventListener("click", (e) => { e.stopPropagation(); alterarQuantidadeOpcao(grupo, item, limite, 1) })
            itemDiv.querySelector(".options-item-minus").addEventListener("click", (e) => { e.stopPropagation(); alterarQuantidadeOpcao(grupo, item, limite, -1) })
        }

        grupoDiv.appendChild(itemDiv)
    })

    return grupoDiv
}

function alternarOpcaoUnica(grupo, item) {
    const jaSelecionado = (opcoesEscolhidas[grupo.nome] || []).some(i => i.nome === item.nome)
    opcoesEscolhidas[grupo.nome] = jaSelecionado ? [] : [{ ...item, grupo: grupo.nome, quantidade: 1 }]
    rerenderTodosOsGrupos(produtoAtual)
}

function alterarQuantidadeOpcao(grupo, item, limite, delta) {
    const lista = opcoesEscolhidas[grupo.nome] || []
    let entrada = lista.find(i => i.nome === item.nome)
    const total = lista.reduce((s, i) => s + i.quantidade, 0)

    if (delta > 0) {
        if (total >= limite.max) {
            Toastify({ text: `Você pode escolher até ${limite.max} opções em "${grupo.nome}".`, duration: 2000, gravity: "top", position: "right", style: { background: "#f59e0b", borderRadius: "8px" } }).showToast()
            return
        }
        if (entrada) entrada.quantidade += 1
        else lista.push({ ...item, grupo: grupo.nome, quantidade: 1 })
    } else if (entrada) {
        entrada.quantidade -= 1
        if (entrada.quantidade <= 0) opcoesEscolhidas[grupo.nome] = lista.filter(i => i.nome !== item.nome)
    }

    rerenderTodosOsGrupos(produtoAtual)
}

function agruparOpcoesPorGrupo(opcoes) {
    const porGrupo = {}
    const ordemGrupos = []
    opcoes.forEach(o => {
        const g = o.grupo || "Opções"
        if (!porGrupo[g]) { porGrupo[g] = []; ordemGrupos.push(g) }
        const qtd = o.quantidade || 1
        porGrupo[g].push(qtd > 1 ? `${qtd}x ${o.nome}` : o.nome)
    })
    return ordemGrupos.map(g => `${g}: ${porGrupo[g].join(", ")}`)
}

function atualizarBotaoAdicionarModal() {
    if (!produtoAtual || produtoEstaEsgotado(produtoAtual)) return
    const modalAddBtn = document.getElementById("modal-add-btn")
    const qtd = parseInt(document.getElementById("modal-qty-selector").getAttribute("data-qty"), 10)

    if (!produtoAtual.opcoes || !produtoAtual.opcoes.length) {
        modalAddBtn.innerHTML = `<i class="fa fa-cart-plus"></i> Adicionar`
        return
    }

    let totalAdicional = 0
    produtoAtual.opcoes.forEach((grupo, indice) => {
        const itens = opcoesEscolhidas[grupo.nome] || []
        itens.forEach(item => { totalAdicional += item.preco_adicional * (item.quantidade || 1) })

        if (grupo.obrigatorio) {
            const limite = limiteEfetivoGrupo(grupo)
            const totalNoGrupo = itens.reduce((s, i) => s + i.quantidade, 0)
            const badge = document.getElementById(`grupo-ok-${indice}`)
            if (badge) badge.style.display = (!limite.bloqueado && totalNoGrupo >= limite.min) ? "inline-flex" : "none"
        }
    })

    const totalFinal = (produtoAtual.preco + totalAdicional) * qtd
    modalAddBtn.innerHTML = `<i class="fa fa-cart-plus"></i> Adicionar - ${totalFinal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`
}

function gruposObrigatoriosCompletos(produto) {
    return produto.opcoes.every(grupo => {
        if (!grupo.obrigatorio) return true
        const limite = limiteEfetivoGrupo(grupo)
        if (limite.bloqueado) return false
        const totalNoGrupo = (opcoesEscolhidas[grupo.nome] || []).reduce((s, i) => s + i.quantidade, 0)
        return totalNoGrupo >= limite.min
    })
}

// Trava usada quando um modal é fechado por um CLIQUE (botão "Voltar",
// "Salvar", "X" etc.) em vez do gesto/botão de voltar do navegador.
// Nesses casos a função de fechar já chama history.back() manualmente
// pra manter o histórico consistente — mas isso dispara um popstate
// "artificial", e sem essa trava o listener abaixo reavaliava tudo de
// novo e cascateava fechando o modal de baixo também (ex: salvar o
// endereço fechava o carrinho inteiro junto).
let ignorarProximoPopstate = false

window.addEventListener("popstate", () => {
    if (ignorarProximoPopstate) {
        ignorarProximoPopstate = false
        return
    }

    const modalEndereco = document.getElementById("address-modal")
    const modalProduto = document.getElementById("product-modal")
    const modalCarrinho = document.getElementById("cart-modal")

    if (modalEndereco.classList.contains("open")) {
        fecharModalEndereco()
    } else if (modalProduto.classList.contains("open")) {
        fecharModalProduto()
    } else if (modalCarrinho.style.display === "flex") {
        fecharModalCarrinho()
    }
})


// ===========================
// INICIALIZAÇÃO
// (espera o supabase-loader.js avisar que os dados chegaram,
// em vez de rodar direto — porque agora os dados vêm de uma
// busca no banco, que é assíncrona)
// ===========================
document.addEventListener("dadosDaLojaProntos", () => {
    aplicarDadosDaLoja()
    aplicarModoMesa()
    aplicarMesaManual()
    aplicarModoAtendimento()
    renderizarProdutos()
    aplicarStatusLoja()
    tentarReenviarRegistrosPendentes()
})

// Reenvia a fila de pendências sozinho, sem depender de recarregar a
// página — assim que a conexão voltar, e de tempos em tempos como
// reforço (caso o evento "online" não dispare de forma confiável).
window.addEventListener("online", tentarReenviarRegistrosPendentes)
setInterval(tentarReenviarRegistrosPendentes, 60000)
document.addEventListener("visibilitychange", () => {
    if (!document.hidden) tentarReenviarRegistrosPendentes()
})

// ===========================
// BOTÃO VOLTAR AO TOPO
// Aparece depois que o usuário rola a página pra baixo.
// ===========================
const topoBtn = document.getElementById("topo-btn")

window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
        topoBtn.classList.add("visivel")
    } else {
        topoBtn.classList.remove("visivel")
    }
})

topoBtn.addEventListener("click", function () {
    scrollSuavePara(0)
})

// ===========================
// TELA DE APRESENTAÇÃO (splash inicial)
// "Ver cardápio completo" fecha a tela e rola suavemente até o
// cardápio; "Pedir no WhatsApp" abre o chat direto, sem fechar nada.
// ===========================
document.getElementById("apresentacao-ver-cardapio").addEventListener("click", function () {
    document.getElementById("tela-apresentacao").style.display = "none"
    document.body.classList.remove("apresentacao-ativa")

    const alvoMenu = document.getElementById("titulo-secao-menu")
    if (alvoMenu) {
        const posicao = alvoMenu.getBoundingClientRect().top + window.scrollY - 16
        scrollSuavePara(posicao)
    }
})
