// ============================================================
// SUPABASE LOADER — versão multi-tenant (piloto)
// ------------------------------------------------------------
// Antes: a loja era fixada por uma constante (LOJA_SLUG) — um
// repositório por cliente.
// Agora: a loja é descoberta pelo hostname da própria página
// (window.location.hostname), tanto pra subdomínio da plataforma
// (plano básico) quanto pra domínio próprio (plano premium) — a
// busca é IDÊNTICA nos dois casos: um match exato contra a tabela
// "dominios_loja". Não existe lógica de wildcard/subdomínio aqui
// de propósito: cada domínio novo (básico ou premium) precisa de
// uma linha cadastrada nessa tabela, o mesmo passo manual de
// adicionar o domínio na Vercel. Se um dia fizer sentido usar
// wildcard, dá pra somar uma regra de fallback aqui sem quebrar
// nada do que já existe.
//
// Dev/local: localhost não bate com nenhum domínio real, então
// aceita um override só pra desenvolvimento: abra a página com
// ?loja=slug-da-loja pra forçar qual loja carregar.
// ============================================================

const SUPABASE_URL = "https://bjnnkeutfilbzdhbqqij.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqbm5rZXV0ZmlsYnpkaGJxcWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3OTU0MzIsImV4cCI6MjA5OTM3MTQzMn0.kyj-JDRj4YAwlgGze56MGsd9UjezpF1PeG-HpJnm3_I"

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Variáveis globais que script.js consome (mesmos nomes de antes —
// nada muda pro resto do código que já existe).
let loja = {}
let produtos = []
let categorias = {}

function slugForcadoPorQueryString() {
    // Só pra desenvolvimento local — nunca deveria ter efeito em
    // produção, já que lá o hostname é sempre um domínio real e
    // cadastrado.
    const params = new URLSearchParams(window.location.search)
    return params.get("loja") || null
}

async function resolverLojaIdPeloHostname() {
    const slugForcado = slugForcadoPorQueryString()

    if (slugForcado) {
        const { data, error } = await supabaseClient
            .from("lojas")
            .select("id")
            .eq("slug", slugForcado)
            .single()
        if (error || !data) return null
        return data.id
    }

    const hostname = window.location.hostname
    const { data, error } = await supabaseClient
        .from("dominios_loja")
        .select("loja_id")
        .eq("dominio", hostname)
        .single()

    if (error || !data) return null
    return data.loja_id
}

async function carregarDadosDaLoja() {
    const lojaId = await resolverLojaIdPeloHostname()

    if (!lojaId) {
        document.body.innerHTML =
            "<p style='padding:40px;font-family:sans-serif'>Este domínio ainda não está associado a nenhuma loja. Verifique o cadastro em \"dominios_loja\".</p>"
        return
    }

    const { data: lojaDb, error: erroLoja } = await supabaseClient
        .from("lojas")
        .select("*")
        .eq("id", lojaId)
        .single()

    if (erroLoja || !lojaDb) {
        document.body.innerHTML =
            "<p style='padding:40px;font-family:sans-serif'>Não foi possível carregar esta loja.</p>"
        console.error(erroLoja)
        return
    }

    // Loja desativada no painel admin ("Loja ativa" = Não)
    if (lojaDb.ativa === false) {
        document.body.innerHTML =
            "<p style='padding:40px;font-family:sans-serif;text-align:center'>Loja fechada no momento. Volte mais tarde!</p>"
        return
    }

    loja = {
        id: lojaDb.id,
        nome: lojaDb.nome,
        tagline: lojaDb.tagline,
        endereco: lojaDb.endereco,
        whatsapp: lojaDb.whatsapp,
        logo: lojaDb.logo_url,
        banner: lojaDb.banner_url,
        corPrincipal: lojaDb.cor_principal,
        corPrincipalEscura: lojaDb.cor_principal_escura,
        corPrincipalClara: lojaDb.cor_principal_clara,
        tituloSecaoMenu: lojaDb.titulo_secao_menu,
        textoHorario: lojaDb.texto_horario,
        chavePix: lojaDb.chave_pix,
        seloConfianca: lojaDb.selo_confianca,
        seloConfiancaSub: lojaDb.selo_confianca_sub,
        horario: lojaDb.horario || {},
        numeroMesas: lojaDb.numero_mesas,
        bairrosTaxa: lojaDb.bairros_taxa || [],
        esconderEsgotados: lojaDb.esconder_esgotados !== false,

        // Campos novos do multi-tenant — antes viviam hardcoded em
        // config-loja.js, um arquivo por repositório/cliente. Com
        // fallback pra não quebrar uma loja que ainda não tenha
        // esses campos preenchidos no banco.
        tema: lojaDb.tema || "generico",
        modoLoja: lojaDb.modo_loja || {
            permiteDelivery: true,
            permiteRetirada: true,
            usaMesa: false,
            usaDelivery: true,
            usaEncomenda: false
        },
        textos: lojaDb.textos || null,
        abasAdmin: lojaDb.abas_admin || null
    }

    categorias = {}
    ;(lojaDb.categorias || [])
        .sort((a, b) => a.ordem - b.ordem)
        .forEach(c => { categorias[c.nome] = { icone: c.icone } })

    const { data: produtosDb, error: erroProdutos } = await supabaseClient
        .from("produtos")
        .select("*")
        .eq("loja_id", lojaDb.id)
        .order("ordem", { ascending: true })

    if (erroProdutos) console.error(erroProdutos)

    produtos = (produtosDb || []).map(p => ({
        id: p.id,
        categoria: p.categoria,
        nome: p.nome,
        desc: p.descricao,
        preco: Number(p.preco),
        fotos: p.fotos && p.fotos.length ? p.fotos : ["https://placehold.co/400x300?text=Sem+foto"],
        oferta: p.oferta,
        esgotado: p.esgotado,
        estoque: p.estoque,
        retirada_apenas: p.retirada_apenas,
        esconder_setas: p.esconder_setas,
        esconder_observacao: p.esconder_observacao,
        sob_encomenda: p.sob_encomenda,
        antecedencia_minima_horas: p.antecedencia_minima_horas,
        icone: p.icone || undefined,
        opcoes: p.opcoes || null,
        mostrar_botao_duvida: p.mostrar_botao_duvida
    }))

    // Só agora, com "loja" completo (incluindo tema/modoLoja/textos
    // vindos do banco), aplica o tema e monta MODO_LOJA/TEXTOS/
    // ABAS_ADMIN globais que script.js e o admin já esperam.
    // Ver config-loja.js.
    if (window.aplicarConfiguracaoDaLoja) window.aplicarConfiguracaoDaLoja(loja)

    document.dispatchEvent(new Event("dadosDaLojaProntos"))
}

carregarDadosDaLoja()