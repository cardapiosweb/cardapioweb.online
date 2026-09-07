// ============================================================
// BIBLIOTECA DE TEMAS VISUAIS
// ------------------------------------------------------------
// Cada tema define TODO o conceito visual do site: paleta de
// cores, fontes, formas (raio de borda / espessura), ícone de
// fallback (quando a loja não tem logo) e o emoji usado nas
// imagens de placeholder.
//
// Pra criar o site de um cliente novo:
//   1. Copie a pasta do projeto (como já faz hoje).
//   2. No arquivo config-loja.js, defina: const TEMA = "hamburgueria"
//   3. Pronto. Não precisa editar CSS, HTML nem lembrar de trocar
//      nada manualmente — tudo é aplicado por config-loja.js.
//
// Pra criar um tema novo do zero, copie um bloco existente,
// troque o nome da chave e ajuste os valores.
// ============================================================

const TEMAS = {

    pizzaria: {
        nomeExibicao: "Pizzaria",
        cores: {
            principal:        "#A9321E",
            principalEscura:  "#7A2416",
            principalClara:   "#F7E4DC",
            base:             "#241B16",
            baseSuave:        "#3A2C24",
            fundo:            "#FBF3E4",
            destaque:         "#D9A441",
            selo:             "#4C6B3F",
            linha:            "#E4D5B7"
        },
        fontes: {
            titulo: "Bitter",
            texto: "Mulish",
            script: "Caveat"
        },
        formas: {
            raioBase: "14px",
            raioGrande: "20px",
            raioPill: "999px",
            bordaEspessura: "1.5px",
            bordaEstilo: "solid"
        },
        iconeFallbackLogo: "fa-pizza-slice",
        emojiPlaceholder: "🍕",
        textoAltLogo: "Logo da pizzaria"
    },

    churrascaria: {
        nomeExibicao: "Churrascaria",
        cores: {
            principal:        "#A9321E",
            principalEscura:  "#7A2416",
            principalClara:   "#F7E4DC",
            base:             "#241B16",
            baseSuave:        "#3A2C24",
            fundo:            "#FBF3E4",
            destaque:         "#D9A441",
            selo:             "#4C6B3F",
            linha:            "#E4D5B7"
        },
        fontes: {
            titulo: "Oswald",
            texto: "Mulish",
            script: "Permanent Marker"
        },
        formas: {
            raioBase: "6px",
            raioGrande: "10px",
            raioPill: "999px",
            bordaEspessura: "2px",
            bordaEstilo: "solid"
        },
        iconeFallbackLogo: "fa-fire-burner",
        emojiPlaceholder: "🍖",
        textoAltLogo: "Logo da churrascaria"
    },

    hamburgueria: {
        nomeExibicao: "Hamburgueria",
        cores: {
            principal:        "#C6491A",
            principalEscura:  "#95350F",
            principalClara:   "#FBE7D6",
            base:             "#1E1712",
            baseSuave:        "#332720",
            fundo:            "#FFF6E9",
            destaque:         "#E8B13A",
            selo:             "#3D6B3F",
            linha:            "#EAD9BE"
        },
        fontes: {
            titulo: "Baloo 2",
            texto: "Nunito",
            script: "Kalam"
        },
        formas: {
            raioBase: "22px",
            raioGrande: "28px",
            raioPill: "999px",
            bordaEspessura: "2px",
            bordaEstilo: "solid"
        },
        iconeFallbackLogo: "fa-burger",
        emojiPlaceholder: "🍔",
        textoAltLogo: "Logo da hamburgueria"
    },

    doceria: {
        nomeExibicao: "Doceria / Confeitaria",
        cores: {
            principal:        "#C9457B",
            principalEscura:  "#9E2E5E",
            principalClara:   "#FBE3ED",
            base:             "#2B1B22",
            baseSuave:        "#402633",
            fundo:            "#FFF6F8",
            destaque:         "#E6B94D",
            selo:             "#6B7B4C",
            linha:            "#F0D3DE"
        },
        fontes: {
            titulo: "Cormorant Garamond",
            texto: "Nunito",
            script: "Sacramento"
        },
        formas: {
            raioBase: "18px",
            raioGrande: "24px",
            raioPill: "999px",
            bordaEspessura: "1px",
            bordaEstilo: "solid"
        },
        iconeFallbackLogo: "fa-cake-candles",
        emojiPlaceholder: "🍰",
        textoAltLogo: "Logo da doceria"
    },

    acaiteria: {
        nomeExibicao: "Açaiteria / Sorveteria",
        cores: {
            principal:        "#5B2E8C",
            principalEscura:  "#411F66",
            principalClara:   "#EDE1F7",
            base:             "#1C1522",
            baseSuave:        "#2E2436",
            fundo:            "#F7F1FB",
            destaque:         "#E8B13A",
            selo:             "#3F7D5C",
            linha:            "#DCCBEE"
        },
        fontes: {
            titulo: "Quicksand",
            texto: "Nunito",
            script: "Pacifico"
        },
        formas: {
            raioBase: "24px",
            raioGrande: "30px",
            raioPill: "999px",
            bordaEspessura: "1.5px",
            bordaEstilo: "solid"
        },
        iconeFallbackLogo: "fa-ice-cream",
        emojiPlaceholder: "🍧",
        textoAltLogo: "Logo da açaiteria"
    },

    praia: {
        nomeExibicao: "Barraca de Praia",
        cores: {
            principal:        "#E8791A",
            principalEscura:  "#B85A0F",
            principalClara:   "#FCE4CC",
            base:             "#1A1410",
            baseSuave:        "#2E241C",
            fundo:            "#FFF8EE",
            destaque:         "#F2B33D",
            selo:             "#2F6B4F",
            linha:            "#F0DDBE"
        },
        fontes: {
            titulo: "Fredoka",
            texto: "Mulish",
            script: "Caveat"
        },
        formas: {
            raioBase: "16px",
            raioGrande: "22px",
            raioPill: "999px",
            bordaEspessura: "1.5px",
            bordaEstilo: "dashed"
        },
        iconeFallbackLogo: "fa-umbrella-beach",
        emojiPlaceholder: "🏖️",
        textoAltLogo: "Logo da barraca de praia"
    },

    bistro: {
        nomeExibicao: "Bistro",
        cores: {
            principal:        "#7A1F2B",
            principalEscura:  "#4A1420",
            principalClara:   "#F3E3E1",
            base:             "#201417",
            baseSuave:        "#3A2429",
            fundo:            "#FAF3EA",
            destaque:         "#C6A15B",
            selo:             "#5C6E4F",
            linha:            "#E8DCC9"
        },
        fontes: {
            titulo: "Playfair Display",
            texto: "Mulish",
            script: "Cormorant Garamond"
        },
        formas: {
            raioBase: "4px",
            raioGrande: "6px",
            raioPill: "4px",
            bordaEspessura: "1px",
            bordaEstilo: "solid"
        },
        iconeFallbackLogo: "fa-champagne-glasses",
        emojiPlaceholder: "🍽️",
        textoAltLogo: "Logo do bistrô"
    },

    generico: {
        nomeExibicao: "Genérico",
        cores: {
            principal:        "#2563EB",
            principalEscura:  "#1D4ED8",
            principalClara:   "#DBEAFE",
            base:             "#1E1E1E",
            baseSuave:        "#333333",
            fundo:            "#FAFAFA",
            destaque:         "#F59E0B",
            selo:             "#16A34A",
            linha:            "#E5E7EB"
        },
        fontes: {
            titulo: "Inter",
            texto: "Inter",
            script: "Inter"
        },
        formas: {
            raioBase: "10px",
            raioGrande: "14px",
            raioPill: "999px",
            bordaEspessura: "1.5px",
            bordaEstilo: "solid"
        },
        iconeFallbackLogo: "fa-store",
        emojiPlaceholder: "🏪",
        textoAltLogo: "Logo da loja"
    }
}

window.TEMAS = TEMAS