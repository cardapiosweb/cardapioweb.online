// ===========================
// ÍCONES POR CATEGORIA (fallback caso o produto não informe "icone")
// ===========================
const ICONE_PADRAO = "fa-star"

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
    document.getElementById("loja-endereco").textContent = `Endereço: ${loja.endereco}`
    document.getElementById("loja-horario").textContent = loja.textoHorario

    document.getElementById("whats-flutuante").href = `https://wa.me/${loja.whatsapp}`

    // Aplica a cor principal da loja nas variáveis CSS
    document.documentElement.style.setProperty("--laranja", loja.corPrincipal)
    document.documentElement.style.setProperty("--laranja-escuro", loja.corPrincipalEscura)
    document.documentElement.style.setProperty("--laranja-claro", loja.corPrincipalClara)
}


// ===========================
// RENDERIZAR PRODUTOS
// (lê o array `produtos` de dados-produtos.js e monta o HTML)
// ===========================
function renderizarProdutos() {
    const menu = document.getElementById("menu")
    menu.innerHTML = ""

    // Agrupa produtos por categoria, mantendo a ordem de primeira aparição
    const categorias = []
    const produtosPorCategoria = {}

    produtos.forEach(produto => {
        if (!produtosPorCategoria[produto.categoria]) {
            produtosPorCategoria[produto.categoria] = []
            categorias.push(produto.categoria)
        }
        produtosPorCategoria[produto.categoria].push(produto)
    })

    categorias.forEach((categoria, index) => {
        const icone = produtosPorCategoria[categoria][0].icone || ICONE_PADRAO
        const gridId = `categoria-grid-${index}`

        // Título da categoria (clicável)
        const tituloWrapper = document.createElement("div")
        tituloWrapper.className = "mx-auto max-w-7xl px-4 mb-4 cursor-pointer select-none"
        tituloWrapper.innerHTML = `
            <h2 class="font-bold text-2xl category-title flex items-center gap-2">
                <i class="fa fa-chevron-down category-chevron"></i>
                <i class="fa ${icone}" style="color: var(--laranja);"></i> ${categoria}
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

        // Mede a altura real do conteúdo pra animação funcionar suave
        // (não usamos um valor fixo porque cada categoria tem uma
        // quantidade diferente de produtos)
        requestAnimationFrame(() => {
            grid.style.maxHeight = grid.scrollHeight + "px"
        })

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
    })
}

function criarCardProduto(produto) {
    const precoFormatado = produto.preco.toFixed(2).replace(".", ",")
    const badge = produto.oferta ? `<span class="badge-oferta">Oferta</span>` : ""

    const card = document.createElement("div")
    card.className = "flex gap-6"
    card.innerHTML = `
        <img src="${produto.foto1}" alt="${produto.nome}"
            class="w-28 h-28 rounded-md object-cover hover:scale-110 hover:rotate-2 duration-200 product-clickable"
            onerror="this.src='https://placehold.co/112x112/FF6B00/white?text=📦'"
        />
        <div class="product-info">
            <p class="font-bold product-name-clickable">
                ${produto.nome}
                ${badge}
            </p>
            <p class="text-sm text-gray-600">${produto.desc}</p>
            <div class="product-footer">
                <p class="font-bold text-lg text-laranja">R$ ${precoFormatado}</p>
                <button class="add-to-cart-btn" data-name="${produto.nome}" data-price="${produto.preco}">
                    <i class="fa fa-cart-plus text-lg"></i>
                </button>
            </div>
        </div>
    `

    // Clique na imagem e no nome abrem o modal do produto
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
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const addressSection = document.getElementById("address-section")
const optEntrega = document.getElementById("opt-entrega")
const optRetirada = document.getElementById("opt-retirada")

// ===========================
// ESTADO
// ===========================
let cart = []
let tipoEntrega = "entrega"
let tipoPagamento = "Pix"

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


// ===========================
// MODAL DO CARRINHO
// ===========================
cartBtn.addEventListener("click", function () {
    updateCartModal()
    cartModal.style.display = "flex"
    document.body.style.overflow = "hidden"
})

cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
        document.body.style.overflow = ""
    }
})

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
    document.body.style.overflow = ""
})


// ===========================
// ENTREGA OU RETIRADA
// ===========================
function selecionarEntrega(tipo) {
    tipoEntrega = tipo

    if (tipo === "entrega") {
        optEntrega.classList.add("selected")
        optRetirada.classList.remove("selected")
        addressSection.style.display = "block"
    } else {
        optRetirada.classList.add("selected")
        optEntrega.classList.remove("selected")
        addressSection.style.display = "none"
        addressWarn.classList.add("hidden")
        addressInput.classList.remove("border-red-500")
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
}


// ===========================
// ADICIONAR AO CARRINHO
// (usa "delegação de evento" no #menu, funciona mesmo com os
// cards sendo criados dinamicamente pelo renderizarProdutos)
// ===========================
document.getElementById("menu").addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn")
    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price, parentButton)
    }
})

function addToCart(name, price, btnElement) {
    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        existingItem.quantity += 1
    } else {
        cart.push({ name, price, quantity: 1 })
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
        duration: 2000,
        gravity: "top",
        position: "right",
        stopOnFocus: false,
        style: {
            background: loja.corPrincipal,
            borderRadius: "8px",
            fontSize: "14px",
        },
    }).showToast()
}


// ===========================
// ATUALIZAR MODAL DO CARRINHO
// ===========================
function updateCartModal() {
    cartItemsContainer.innerHTML = ""
    let total = 0

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center py-6 text-gray-400">
                <i class="fa fa-shopping-cart text-4xl mb-2 block"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `
        cartTotal.textContent = "R$ 0,00"
        cartCounter.textContent = "0"
        return
    }

    cart.forEach(item => {
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("flex", "justify-between", "items-center", "mb-4", "pb-3", "border-b")

        cartItemElement.innerHTML = `
            <div class="flex-1">
                <p class="font-bold text-sm">${item.name}</p>
                <p class="text-xs text-gray-500">R$ ${item.price.toFixed(2).replace(".", ",")} cada</p>
            </div>
            <div class="flex items-center gap-2 mx-3">
                <button class="decrease-btn w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100" data-name="${item.name}">−</button>
                <span class="font-bold w-5 text-center">${item.quantity}</span>
                <button class="increase-btn w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100" data-name="${item.name}">+</button>
            </div>
            <div class="text-right min-w-[70px]">
                <p class="font-bold text-sm" style="color: var(--laranja);">
                    R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}
                </p>
                <button class="remove-from-cart-btn text-xs text-red-400 hover:text-red-600 mt-1" data-name="${item.name}">Remover</button>
            </div>
        `

        total += item.price * item.quantity
        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

    const totalItens = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCounter.textContent = totalItens
}


// ===========================
// CONTROLES DE QUANTIDADE E REMOÇÃO
// ===========================
cartItemsContainer.addEventListener("click", function (event) {
    const name = event.target.getAttribute("data-name")

    if (event.target.classList.contains("remove-from-cart-btn")) removeItemCart(name)
    if (event.target.classList.contains("increase-btn")) increaseItem(name)
    if (event.target.classList.contains("decrease-btn")) decreaseItem(name)
})

function increaseItem(name) {
    const item = cart.find(i => i.name === name)
    if (item) { item.quantity += 1; updateCartModal() }
}

function decreaseItem(name) {
    const item = cart.find(i => i.name === name)
    if (item) {
        if (item.quantity > 1) { item.quantity -= 1; updateCartModal() }
        else { removeItemCart(name) }
    }
}

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name)
    if (index !== -1) { cart.splice(index, 1); updateCartModal() }
}


// ===========================
// VALIDAÇÃO DO ENDEREÇO
// ===========================
addressInput.addEventListener("input", function (event) {
    if (event.target.value !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})


// ===========================
// FINALIZAR PEDIDO (WHATSAPP)
// ===========================
checkoutBtn.addEventListener("click", function () {

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

    if (tipoEntrega === "entrega" && addressInput.value.trim() === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        addressInput.focus()
        return
    }

    const cartItems = cart.map(item =>
        `- ${item.name}\n  Qtd: ${item.quantity} | R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}`
    ).join("\n")

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const totalFormatado = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

    const modoEntrega = tipoEntrega === "entrega"
        ? `*Entrega*\nEndereço: ${addressInput.value.trim()}`
        : `*Retirada na loja*`

    const message =
        `*Pedido - ${loja.nome}*\n` +
        `--------------------------------\n` +
        `${cartItems}\n` +
        `--------------------------------\n` +
        `*Total: ${totalFormatado}*\n` +
        `\n${modoEntrega}\n` +
        `\n*Pagamento:* ${tipoPagamento}`

    window.open(`https://wa.me/${loja.whatsapp}?text=${encodeURIComponent(message)}`, "_blank")

    cart = []
    tipoEntrega = "entrega"
    tipoPagamento = "Pix"
    selecionarEntrega("entrega")
    selecionarPagamento("Pix")
    addressInput.value = ""
    updateCartModal()
    cartModal.style.display = "none"
    document.body.style.overflow = ""
})


// ===========================
// VERIFICAR HORÁRIO DA LOJA
// ===========================
function checkStoreOpen() {
    const agora = new Date()
    const hora = agora.getHours()
    return hora >= loja.horario.abre && hora < loja.horario.fecha
}

function aplicarStatusLoja() {
    const spanItem = document.getElementById("date-span")
    const isOpen = checkStoreOpen()

    if (isOpen) {
        spanItem.classList.remove("bg-red-500")
        spanItem.classList.add("bg-green-600")
    } else {
        spanItem.classList.remove("bg-green-600")
        spanItem.classList.add("bg-red-500")
    }
}


// ===========================
// MODAL DE PRODUTO
// ===========================
let produtoAtual = null
let fotosAtual = []

function abrirProduto(produto) {
    produtoAtual = produto
    fotosAtual = [produto.foto1, produto.foto2]

    const modalJaAberto = document.getElementById("product-modal").classList.contains("open")

    document.getElementById("modal-main-img").src = produto.foto1
    document.getElementById("modal-main-img").alt = produto.nome
    document.getElementById("modal-thumb-1").src = produto.foto1
    document.getElementById("modal-thumb-2").src = produto.foto2
    document.getElementById("modal-thumb-1").classList.add("active")
    document.getElementById("modal-thumb-2").classList.remove("active")
    document.getElementById("modal-name").textContent = produto.nome
    document.getElementById("modal-desc").textContent = produto.desc
    document.getElementById("modal-price").textContent = "R$ " + produto.preco.toFixed(2).replace(".", ",")

    document.getElementById("modal-add-btn").onclick = function () {
        addToCart(produtoAtual.nome, produtoAtual.preco)
        fecharModalProduto()
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
    document.getElementById("modal-thumb-1").classList.toggle("active", index === 0)
    document.getElementById("modal-thumb-2").classList.toggle("active", index === 1)
}

function fecharModalProduto() {
    document.getElementById("product-modal").classList.remove("open")
    document.body.style.overflow = ""

    // Se tinha uma marcação empilhada pro modal, remove ela do histórico
    // (assim o botão de voltar não fica "gastando" um clique à toa depois)
    if (history.state && history.state.produtoModalAberto) {
        history.back()
    }
}

function fecharModalProdutoSeOverlay(event) {
    if (event.target === document.getElementById("product-modal")) {
        fecharModalProduto()
    }
}

// Botão de voltar do navegador/celular: se o modal de produto estiver
// aberto, fecha o modal em vez de sair da página.
window.addEventListener("popstate", () => {
    const modal = document.getElementById("product-modal")
    if (modal.classList.contains("open")) {
        modal.classList.remove("open")
        document.body.style.overflow = ""
    }
})


// ===========================
// INICIALIZAÇÃO
// ===========================
aplicarDadosDaLoja()
renderizarProdutos()
aplicarStatusLoja()