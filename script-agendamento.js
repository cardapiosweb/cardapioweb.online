// ============================================================
// SCRIPT DA LOJA — TEMPLATE DE AGENDAMENTO (self-service)
// Não tem carrinho: fluxo próprio — escolher serviço → escolher
// data → ver horários livres (via horarios_ocupados_loja) →
// confirmar. A exclusion constraint em agendamentos_loja é a trava
// final contra concorrência — o front aqui é só otimista.
// ============================================================

function escaparHtml(valor) {
    return String(valor === null || valor === undefined ? "" : valor)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;")
}

const DIAS_SEMANA_ORDEM = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"]

function paraMinutos(valor, padrao) {
    if (valor === null || valor === undefined || valor === "") return padrao
    if (typeof valor === "number") return valor * 60
    const partes = String(valor).split(":")
    const h = parseInt(partes[0], 10)
    const m = parseInt(partes[1], 10) || 0
    if (isNaN(h)) return padrao
    return h * 60 + m
}

function checkStoreOpen() {
    const agora = new Date()
    const diaDeHoje = DIAS_SEMANA_ORDEM[agora.getDay()]
    const minutosAgora = agora.getHours() * 60 + agora.getMinutes()
    let intervalosHoje = loja.horario && loja.horario[diaDeHoje]
    if (!intervalosHoje) return false
    if (!Array.isArray(intervalosHoje)) intervalosHoje = [intervalosHoje]

    return intervalosHoje.some(({ abre, fecha }) => {
        const minutosAbre = paraMinutos(abre, 0)
        const minutosFecha = paraMinutos(fecha, 0)
        if (minutosAbre === minutosFecha) return false
        if (minutosFecha < minutosAbre) return minutosAgora >= minutosAbre || minutosAgora < minutosFecha
        return minutosAgora >= minutosAbre && minutosAgora < minutosFecha
    })
}

function aplicarDadosDaLoja() {
    document.title = loja.nome
    if (loja.logo) document.getElementById("logo-img").src = loja.logo
    document.getElementById("logo-img").alt = `Logo ${loja.nome}`
    document.getElementById("loja-nome").textContent = loja.nome
    document.getElementById("loja-tagline").textContent = loja.tagline || ""
    document.getElementById("loja-endereco").textContent = loja.endereco ? `Endereço: ${loja.endereco}` : ""
    document.getElementById("whats-flutuante").href = `https://wa.me/${loja.whatsapp}`
    document.getElementById("rodape-contato").textContent = `${loja.nome} · ${loja.whatsapp ? "WhatsApp: " + loja.whatsapp : ""}`

    if (loja.corPrincipal) {
        document.documentElement.style.setProperty("--laranja", loja.corPrincipal)
        document.documentElement.style.setProperty("--laranja-escuro", loja.corPrincipalEscura)
        document.documentElement.style.setProperty("--laranja-claro", loja.corPrincipalClara)
    }
}

function aplicarStatusLoja() {
    const pill = document.getElementById("status-loja-pill")
    const texto = document.getElementById("status-loja-texto")
    const isOpen = checkStoreOpen()
    pill.classList.toggle("fechada", !isOpen)
    texto.textContent = isOpen ? "Aberto agora" : "Fechado"
}

// ============================================================
// LISTAGEM DE SERVIÇOS AGENDÁVEIS
// ============================================================
let servicosAgendaveis = []

function renderizarServicos() {
    servicosAgendaveis = produtos.filter(p => p.agendavel)
    const grid = document.getElementById("servicos-grid")
    grid.innerHTML = ""

    if (!servicosAgendaveis.length) {
        grid.innerHTML = `<p style="text-align:center;color:var(--carvao-suave);grid-column:1/-1;">Nenhum serviço disponível no momento.</p>`
        return
    }

    const selfServiceAtivo = (loja.modulosAtivos || {}).agendamento_self_service === true

    servicosAgendaveis.forEach(servico => {
        const precoTexto = servico.preco > 0 ? `R$ ${servico.preco.toFixed(2).replace(".", ",")}` : "Sob consulta"

        const card = document.createElement("div")
        card.className = "servico-card"
        card.innerHTML = `
            ${servico.fotos && servico.fotos[0] ? `<img src="${escaparHtml(servico.fotos[0])}" alt="${escaparHtml(servico.nome)}" onerror="this.style.display='none'" />` : ""}
            <div class="servico-info">
                <p class="servico-nome">${escaparHtml(servico.nome)}</p>
                <p class="servico-desc">${escaparHtml(servico.desc || "")}</p>
                <div class="servico-footer">
                    <span><i class="fa fa-clock"></i> ${servico.duracao_minutos || "?"} min</span>
                    <span class="servico-preco">${precoTexto}</span>
                </div>
            </div>
        `

        const btn = document.createElement("button")
        if (selfServiceAtivo) {
            btn.className = "btn-agendar"
            btn.innerHTML = `<i class="fa fa-calendar-check"></i> Agendar horário`
            btn.addEventListener("click", () => abrirModalAgendamento(servico))
        } else {
            btn.className = "btn-agendar btn-whats"
            btn.innerHTML = `<i class="fab fa-whatsapp"></i> Perguntar no WhatsApp`
            btn.addEventListener("click", () => {
                const msg = encodeURIComponent(`Olá! Quero agendar: ${servico.nome}`)
                window.open(`https://wa.me/${loja.whatsapp}?text=${msg}`, "_blank")
            })
        }
        card.appendChild(btn)
        grid.appendChild(card)
    })
}

// ============================================================
// MODAL DE AGENDAMENTO (self-service)
// ============================================================
let servicoAtual = null
let horarioSelecionado = null

function abrirModalAgendamento(servico) {
    servicoAtual = servico
    horarioSelecionado = null

    document.getElementById("ag-modal-corpo").innerHTML = `
        <p class="ag-modal-servico" id="ag-modal-servico-nome">${escaparHtml(servico.nome)}</p>
        <div class="campo">
            <label>Escolha a data</label>
            <input type="date" id="ag-data" />
        </div>
        <div id="ag-slots"><p style="font-size:13px;color:var(--carvao-suave);">Escolha uma data pra ver os horários.</p></div>
        <div id="ag-form-cliente" style="display:none;">
            <div class="campo"><label>Seu nome</label><input id="ag-cliente-nome" /></div>
            <div class="campo"><label>Seu WhatsApp (com DDD)</label><input id="ag-cliente-whatsapp" placeholder="91991396925" /></div>
            <div class="campo"><label>Observações (opcional)</label><textarea id="ag-obs" rows="2"></textarea></div>
            <div id="msg-agendamento-cliente"></div>
            <button type="button" id="ag-confirmar-btn" class="btn-agendar" style="width:100%;">Confirmar agendamento</button>
        </div>
    `
    document.getElementById("ag-data").min = new Date().toISOString().slice(0, 10)
    document.getElementById("ag-data").addEventListener("change", carregarHorariosLivres)
    document.getElementById("ag-confirmar-btn").addEventListener("click", confirmarAgendamento)

    document.getElementById("modal-agendamento-cliente").classList.add("open")
    document.body.style.overflow = "hidden"
}

function fecharModalAgendamentoCliente() {
    document.getElementById("modal-agendamento-cliente").classList.remove("open")
    document.body.style.overflow = ""
}
document.getElementById("ag-modal-fechar").addEventListener("click", fecharModalAgendamentoCliente)
document.getElementById("modal-agendamento-cliente").addEventListener("click", (e) => {
    if (e.target.id === "modal-agendamento-cliente") fecharModalAgendamentoCliente()
})

async function carregarHorariosLivres() {
    const data = document.getElementById("ag-data").value
    const slotsDiv = document.getElementById("ag-slots")
    document.getElementById("ag-form-cliente").style.display = "none"
    horarioSelecionado = null

    if (!data || !servicoAtual) return

    slotsDiv.innerHTML = `<p style="font-size:13px;color:var(--carvao-suave);">Carregando horários...</p>`

    const diaSemana = DIAS_SEMANA_ORDEM[new Date(data + "T00:00:00").getDay()]
    const intervalosDia = loja.horario && loja.horario[diaSemana]
    const intervalos = Array.isArray(intervalosDia) ? intervalosDia : (intervalosDia ? [intervalosDia] : [])

    if (!intervalos.length) {
        slotsDiv.innerHTML = `<p style="font-size:13px;color:var(--carvao-suave);">Loja fechada nesse dia.</p>`
        return
    }

    const { data: ocupados, error } = await supabaseClient.rpc("horarios_ocupados_loja", {
        p_produto_id: servicoAtual.id,
        p_data: data
    })

    if (error) {
        slotsDiv.innerHTML = `<p style="font-size:13px;color:#B23A2E;">Não foi possível carregar os horários. Tente de novo.</p>`
        return
    }

    const duracao = servicoAtual.duracao_minutos || 30
    const agoraObj = new Date()
    const ehHoje = data === agoraObj.toISOString().slice(0, 10)
    const minutosAgora = agoraObj.getHours() * 60 + agoraObj.getMinutes()

    const livres = []
    intervalos.forEach(intervalo => {
        let inicioMin = paraMinutos(intervalo.abre, 0)
        const fimMin = paraMinutos(intervalo.fecha, 0)

        while (inicioMin + duracao <= fimMin) {
            const slotInicio = new Date(data + "T00:00:00")
            slotInicio.setMinutes(inicioMin)
            const slotFim = new Date(data + "T00:00:00")
            slotFim.setMinutes(inicioMin + duracao)

            const ocupado = (ocupados || []).some(o => {
                const oInicio = new Date(o.inicio)
                const oFim = new Date(o.fim)
                return slotInicio < oFim && slotFim > oInicio
            })
            const jaPassou = ehHoje && inicioMin <= minutosAgora

            if (!ocupado && !jaPassou) livres.push(inicioMin)
            inicioMin += duracao
        }
    })

    if (!livres.length) {
        slotsDiv.innerHTML = `<p style="font-size:13px;color:var(--carvao-suave);">Nenhum horário livre nesse dia.</p>`
        return
    }

    slotsDiv.innerHTML = ""
    const grid = document.createElement("div")
    grid.className = "ag-slots-grid"
    livres.forEach(minutos => {
        const h = Math.floor(minutos / 60)
        const m = minutos % 60
        const texto = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
        const btn = document.createElement("button")
        btn.type = "button"
        btn.className = "ag-slot-btn"
        btn.textContent = texto
        btn.addEventListener("click", () => {
            horarioSelecionado = minutos
            grid.querySelectorAll(".ag-slot-btn").forEach(b => b.classList.remove("selecionado"))
            btn.classList.add("selecionado")
            document.getElementById("ag-form-cliente").style.display = "block"
        })
        grid.appendChild(btn)
    })
    slotsDiv.appendChild(grid)
}

async function confirmarAgendamento() {
    const msg = document.getElementById("msg-agendamento-cliente")
    msg.innerHTML = ""

    const nome = document.getElementById("ag-cliente-nome").value.trim()
    const whatsappDigitado = document.getElementById("ag-cliente-whatsapp").value.trim()
    const whatsapp = whatsappDigitado.replace(/[\s()\-+]/g, "")
    const obs = document.getElementById("ag-obs").value.trim()
    const data = document.getElementById("ag-data").value

    if (!nome || !whatsapp || horarioSelecionado === null) {
        msg.innerHTML = `<p style="color:#B23A2E;font-size:13px;">Escolha um horário e preencha nome e WhatsApp.</p>`
        return
    }

    const duracao = servicoAtual.duracao_minutos || 30
    const inicio = new Date(data + "T00:00:00")
    inicio.setMinutes(horarioSelecionado)
    const fim = new Date(inicio.getTime() + duracao * 60000)

    const btn = document.getElementById("ag-confirmar-btn")
    btn.disabled = true

    const { error } = await supabaseClient.from("agendamentos_loja").insert({
        loja_id: loja.id,
        produto_id: servicoAtual.id,
        cliente_nome: nome,
        cliente_whatsapp: whatsapp,
        data_hora_inicio: inicio.toISOString(),
        data_hora_fim: fim.toISOString(),
        observacoes: obs || null,
        criado_por: "cliente"
    })

    btn.disabled = false

    if (error) {
        // 23P01 = violação da exclusion constraint — outro cliente
        // pegou esse horário nesse meio-tempo. Recarrega a grade em
        // vez de só mostrar o erro técnico.
        const ehConflito = error.code === "23P01" || /exclu|conflict|overlap/i.test(error.message || "")
        if (ehConflito) {
            msg.innerHTML = `<p style="color:#B23A2E;font-size:13px;">Esse horário acabou de ser ocupado. Escolha outro.</p>`
            await carregarHorariosLivres()
        } else {
            msg.innerHTML = `<p style="color:#B23A2E;font-size:13px;">Não foi possível confirmar: ${escaparHtml(error.message)}</p>`
        }
        return
    }

    const h = Math.floor(horarioSelecionado / 60)
    const m = horarioSelecionado % 60
    document.getElementById("ag-modal-corpo").innerHTML = `
        <div style="text-align:center;padding:16px 0;">
            <i class="fa fa-circle-check" style="font-size:40px;color:var(--verde-manjericao);"></i>
            <p style="font-weight:700;font-size:16px;margin-top:12px;">Agendamento confirmado!</p>
            <p style="font-size:13px;color:var(--carvao-suave);margin-top:6px;">
                ${new Date(data + "T00:00:00").toLocaleDateString("pt-BR")} às ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}
            </p>
        </div>
    `
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================
document.addEventListener("dadosDaLojaProntos", () => {
    aplicarDadosDaLoja()
    aplicarStatusLoja()
    renderizarServicos()
})