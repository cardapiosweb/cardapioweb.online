// ============================================================
// BIBLIOTECA DE TEMAS VISUAIS
// ------------------------------------------------------------
// Cada tema define TODO o conceito visual do site: paleta de
// cores, fontes, formas (raio de borda / espessura), ícone de
// fallback (quando a loja não tem logo), o emoji usado nas
// imagens de placeholder/favicon, e os textos padrão (CTA final,
// diferenciais, "como funciona", descrição do rodapé etc).
//
// textosPadrao é opcional: se um tema não tiver, config-loja.js
// gera um texto genérico sozinho (usando o iconeFallbackLogo do
// próprio tema). Definir textosPadrao aqui serve pra já nascer
// com uma redação específica do segmento, sem precisar configurar
// nada loja por loja — e o cliente ainda pode sobrescrever tudo
// via loja.textos no admin, se quiser algo diferente.
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
        textoAltLogo: "Logo da pizzaria",
        nichosCompativeis: ["catalogo", "hospedagem"],
        textosPadrao: {
            diferenciais: [
                { icone: "fa fa-fire-burner", titulo: "Forno a lenha", desc: "Pizzas assadas na hora do seu pedido, no ponto certo." },
                { icone: "fa fa-leaf", titulo: "Ingredientes frescos", desc: "Selecionados todos os dias antes de ir pro forno." },
                { icone: "fa fa-wallet", titulo: "Pague como quiser", desc: "Pix, dinheiro ou cartão na entrega ou retirada." },
                { icone: "fab fa-whatsapp", titulo: "Fala com a gente", desc: "Dúvida em algum sabor? É só chamar no WhatsApp." },
            ],
            comoFunciona: {
                titulo: "Como funciona",
                subtitulo: "Peça em poucos passos, sem complicação.",
                passos: [
                    { icone: "fa fa-list", titulo: "Monte seu pedido", desc: "Escolha as pizzas do cardápio e adicione ao carrinho." },
                    { icone: "fa fa-route", titulo: "Escolha como receber", desc: "Entrega, retirada no balcão ou direto da sua mesa." },
                    { icone: "fab fa-whatsapp", titulo: "Confirme no WhatsApp", desc: "Seu pedido segue direto pro forno." },
                ],
            },
            ctaFinal: {
                titulo: "Bateu aquela fome?",
                desc: "Sua pizza favorita está a poucos toques de distância. Monte seu pedido agora.",
                botao: "Ver meu pedido",
            },
            heroCtas: { primaria: "Ver cardápio", secundaria: "Chamar no WhatsApp" },
            seloCarimbo: null,
            observacao: { placeholder: "Ex: sem cebola, borda fina, tirar a azeitona..." },
            rodapeDescricao: "Pizzas assadas no forno a lenha, com ingredientes frescos selecionados todos os dias. Peça pelo delivery e receba quentinha na sua casa.",
            apresentacao: {
                botaoPrincipal: "Ver cardápio completo",
                passos: [
                    { icone: "fa fa-list", titulo: "Monte seu pedido", desc: "Escolha as pizzas do cardápio e adicione ao carrinho." },
                    { icone: "fa fa-route", titulo: "Escolha como receber", desc: "Entrega, retirada no balcão ou direto da sua mesa." },
                    { icone: "fab fa-whatsapp", titulo: "Confirme no WhatsApp", desc: "Seu pedido segue direto pro forno." },
                ],
            },
        }
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
            script: "Caveat Brush"
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
        textoAltLogo: "Logo da churrascaria",
        nichosCompativeis: ["catalogo", "hospedagem"],
        textosPadrao: {
            diferenciais: [
                { icone: "fa fa-fire", titulo: "Direto na brasa", desc: "Carnes grelhadas na hora do seu pedido, no ponto certo." },
                { icone: "fa fa-drumstick-bite", titulo: "Cortes selecionados", desc: "Escolhidos todos os dias antes de ir pra brasa." },
                { icone: "fa fa-wallet", titulo: "Pague como quiser", desc: "Pix, dinheiro ou cartão na entrega ou retirada." },
                { icone: "fab fa-whatsapp", titulo: "Fala com a gente", desc: "Dúvida em algum corte? É só chamar no WhatsApp." },
            ],
            comoFunciona: {
                titulo: "Como funciona",
                subtitulo: "Peça em poucos passos, sem complicação.",
                passos: [
                    { icone: "fa fa-list", titulo: "Monte seu pedido", desc: "Escolha os espetos e acompanhamentos do cardápio." },
                    { icone: "fa fa-route", titulo: "Escolha como receber", desc: "Entrega, retirada no balcão ou direto da sua mesa." },
                    { icone: "fab fa-whatsapp", titulo: "Confirme no WhatsApp", desc: "Seu pedido segue direto pra brasa." },
                ],
            },
            ctaFinal: {
                titulo: "Bateu aquela vontade de churrasco?",
                desc: "Seu espeto favorito está a poucos toques de distância. Monte seu pedido agora.",
                botao: "Ver meu pedido",
            },
            heroCtas: { primaria: "Ver cardápio", secundaria: "Chamar no WhatsApp" },
            seloCarimbo: null,
            observacao: { placeholder: "Ex: ao ponto, bem passado, sem pimenta, sem farofa..." },
            rodapeDescricao: "Carnes selecionadas e grelhadas no ponto, com tempero na medida certa. Peça pelo delivery e receba quentinho na sua casa.",
            apresentacao: {
                botaoPrincipal: "Ver cardápio completo",
                passos: [
                    { icone: "fa fa-list", titulo: "Monte seu pedido", desc: "Escolha os espetos e acompanhamentos do cardápio." },
                    { icone: "fa fa-route", titulo: "Escolha como receber", desc: "Entrega, retirada no balcão ou direto da sua mesa." },
                    { icone: "fab fa-whatsapp", titulo: "Confirme no WhatsApp", desc: "Seu pedido segue direto pra brasa." },
                ],
            },
        }
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
        textoAltLogo: "Logo da hamburgueria",
        nichosCompativeis: ["catalogo", "hospedagem"],
        textosPadrao: {
            diferenciais: [
                { icone: "fa fa-fire-burner", titulo: "Direto da chapa", desc: "Hambúrgueres montados na hora do seu pedido, quentinhos." },
                { icone: "fa fa-leaf", titulo: "Ingredientes frescos", desc: "Selecionados todos os dias antes de ir pra chapa." },
                { icone: "fa fa-wallet", titulo: "Pague como quiser", desc: "Pix, dinheiro ou cartão na entrega ou retirada." },
                { icone: "fab fa-whatsapp", titulo: "Fala com a gente", desc: "Dúvida em algum lanche? É só chamar no WhatsApp." },
            ],
            comoFunciona: {
                titulo: "Como funciona",
                subtitulo: "Peça em poucos passos, sem complicação.",
                passos: [
                    { icone: "fa fa-list", titulo: "Monte seu pedido", desc: "Escolha os lanches do cardápio e adicione ao carrinho." },
                    { icone: "fa fa-route", titulo: "Escolha como receber", desc: "Entrega, retirada no balcão ou direto da sua mesa." },
                    { icone: "fab fa-whatsapp", titulo: "Confirme no WhatsApp", desc: "Seu pedido segue direto pra chapa." },
                ],
            },
            ctaFinal: {
                titulo: "Bateu aquela fome de lanche?",
                desc: "Seu hambúrguer favorito está a poucos toques de distância. Monte seu pedido agora.",
                botao: "Ver meu pedido",
            },
            heroCtas: { primaria: "Ver cardápio", secundaria: "Chamar no WhatsApp" },
            seloCarimbo: null,
            observacao: { placeholder: "Ex: sem cebola, carne ao ponto, molho à parte..." },
            rodapeDescricao: "Hambúrgueres montados na hora, com pão e ingredientes frescos selecionados todos os dias. Peça pelo delivery e receba quentinho na sua casa.",
            apresentacao: {
                botaoPrincipal: "Ver cardápio completo",
                passos: [
                    { icone: "fa fa-list", titulo: "Monte seu pedido", desc: "Escolha os lanches do cardápio e adicione ao carrinho." },
                    { icone: "fa fa-route", titulo: "Escolha como receber", desc: "Entrega, retirada no balcão ou direto da sua mesa." },
                    { icone: "fab fa-whatsapp", titulo: "Confirme no WhatsApp", desc: "Seu pedido segue direto pra chapa." },
                ],
            },
        }
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
        textoAltLogo: "Logo da doceria",
        nichosCompativeis: ["catalogo", "hospedagem"],
        textosPadrao: {
            diferenciais: [
                { icone: "fa fa-cake-candles", titulo: "Feito na hora", desc: "Doces preparados com carinho pra chegar fresquinhos até você." },
                { icone: "fa fa-leaf", titulo: "Ingredientes selecionados", desc: "Escolhidos todos os dias antes de ir pra cozinha." },
                { icone: "fa fa-wallet", titulo: "Pague como quiser", desc: "Pix, dinheiro ou cartão na entrega ou retirada." },
                { icone: "fab fa-whatsapp", titulo: "Fala com a gente", desc: "Dúvida em algum doce? É só chamar no WhatsApp." },
            ],
            comoFunciona: {
                titulo: "Como funciona",
                subtitulo: "Peça em poucos passos, sem complicação.",
                passos: [
                    { icone: "fa fa-list", titulo: "Monte seu pedido", desc: "Escolha os doces do cardápio e adicione ao carrinho." },
                    { icone: "fa fa-route", titulo: "Escolha como receber", desc: "Entrega, retirada no balcão ou direto da sua mesa." },
                    { icone: "fab fa-whatsapp", titulo: "Confirme no WhatsApp", desc: "Seu pedido segue direto pra confeitaria." },
                ],
            },
            ctaFinal: {
                titulo: "Bateu aquela vontade de doce?",
                desc: "Seu docinho favorito está a poucos toques de distância. Monte seu pedido agora.",
                botao: "Ver meu pedido",
            },
            heroCtas: { primaria: "Ver cardápio", secundaria: "Chamar no WhatsApp" },
            seloCarimbo: null,
            observacao: { placeholder: "Ex: escrever 'Parabéns' no bolo, menos açúcar, sem granulado..." },
            rodapeDescricao: "Doces e bolos feitos artesanalmente, com ingredientes selecionados todos os dias. Peça pelo delivery e receba fresquinho na sua casa.",
            apresentacao: {
                botaoPrincipal: "Ver cardápio completo",
                passos: [
                    { icone: "fa fa-list", titulo: "Monte seu pedido", desc: "Escolha os doces do cardápio e adicione ao carrinho." },
                    { icone: "fa fa-route", titulo: "Escolha como receber", desc: "Entrega, retirada no balcão ou direto da sua mesa." },
                    { icone: "fab fa-whatsapp", titulo: "Confirme no WhatsApp", desc: "Seu pedido segue direto pra confeitaria." },
                ],
            },
        }
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
        textoAltLogo: "Logo da açaiteria",
        nichosCompativeis: ["catalogo", "hospedagem"],
        textosPadrao: {
            diferenciais: [
                { icone: "fa fa-ice-cream", titulo: "Açaí na hora", desc: "Batido e montado na hora do seu pedido, sempre geladinho." },
                { icone: "fa fa-leaf", titulo: "Frutas selecionadas", desc: "Complementos escolhidos todos os dias, fresquinhos." },
                { icone: "fa fa-wallet", titulo: "Pague como quiser", desc: "Pix, dinheiro ou cartão na entrega ou retirada." },
                { icone: "fab fa-whatsapp", titulo: "Fala com a gente", desc: "Dúvida em algum complemento? É só chamar no WhatsApp." },
            ],
            comoFunciona: {
                titulo: "Como funciona",
                subtitulo: "Peça em poucos passos, sem complicação.",
                passos: [
                    { icone: "fa fa-list", titulo: "Monte seu pedido", desc: "Escolha os açaís e complementos do cardápio." },
                    { icone: "fa fa-route", titulo: "Escolha como receber", desc: "Entrega, retirada no balcão ou direto da sua mesa." },
                    { icone: "fab fa-whatsapp", titulo: "Confirme no WhatsApp", desc: "Seu pedido segue direto pro preparo." },
                ],
            },
            ctaFinal: {
                titulo: "Bateu aquela vontade de açaí?",
                desc: "Seu açaí favorito está a poucos toques de distância. Monte seu pedido agora.",
                botao: "Ver meu pedido",
            },
            heroCtas: { primaria: "Ver cardápio", secundaria: "Chamar no WhatsApp" },
            seloCarimbo: null,
            observacao: { placeholder: "Ex: sem leite condensado, granola à parte, pouco açúcar..." },
            rodapeDescricao: "Açaí batido na hora, com frutas e complementos selecionados todos os dias. Peça pelo delivery e receba geladinho na sua casa.",
            apresentacao: {
                botaoPrincipal: "Ver cardápio completo",
                passos: [
                    { icone: "fa fa-list", titulo: "Monte seu pedido", desc: "Escolha os açaís e complementos do cardápio." },
                    { icone: "fa fa-route", titulo: "Escolha como receber", desc: "Entrega, retirada no balcão ou direto da sua mesa." },
                    { icone: "fab fa-whatsapp", titulo: "Confirme no WhatsApp", desc: "Seu pedido segue direto pro preparo." },
                ],
            },
        }
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
        textoAltLogo: "Logo da barraca de praia",
        nichosCompativeis: ["catalogo", "hospedagem"],
        textosPadrao: {
            diferenciais: [
                { icone: "fa fa-umbrella-beach", titulo: "Direto da barraca", desc: "Preparado na hora do seu pedido, sem enrolação." },
                { icone: "fa fa-snowflake", titulo: "Sempre geladinho", desc: "Bebidas e porções fresquinhas o dia todo." },
                { icone: "fa fa-wallet", titulo: "Pague como quiser", desc: "Pix, dinheiro ou cartão na entrega ou retirada." },
                { icone: "fab fa-whatsapp", titulo: "Fala com a gente", desc: "Dúvida em algo do cardápio? É só chamar no WhatsApp." },
            ],
            comoFunciona: {
                titulo: "Como funciona",
                subtitulo: "Peça em poucos passos, sem complicação.",
                passos: [
                    { icone: "fa fa-list", titulo: "Monte seu pedido", desc: "Escolha as bebidas e porções do cardápio." },
                    { icone: "fa fa-route", titulo: "Escolha como receber", desc: "Entrega no seu guarda-sol, retirada no balcão ou direto da sua mesa." },
                    { icone: "fab fa-whatsapp", titulo: "Confirme no WhatsApp", desc: "Seu pedido segue direto pra barraca." },
                ],
            },
            ctaFinal: {
                titulo: "Bateu aquela vontade de praia?",
                desc: "Seu pedido está a poucos toques de distância. Chame a barraca agora.",
                botao: "Ver meu pedido",
            },
            heroCtas: { primaria: "Ver cardápio", secundaria: "Chamar no WhatsApp" },
            seloCarimbo: null,
            observacao: { placeholder: "Ex: bem gelada, sem gelo, entregar no guarda-sol 12..." },
            rodapeDescricao: "Bebidas geladas e petiscos direto da barraca, prontos pra chegar até você. Peça e aproveite o dia de praia.",
            apresentacao: {
                botaoPrincipal: "Ver cardápio completo",
                passos: [
                    { icone: "fa fa-list", titulo: "Monte seu pedido", desc: "Escolha as bebidas e porções do cardápio." },
                    { icone: "fa fa-route", titulo: "Escolha como receber", desc: "Entrega no seu guarda-sol, retirada no balcão ou direto da sua mesa." },
                    { icone: "fab fa-whatsapp", titulo: "Confirme no WhatsApp", desc: "Seu pedido segue direto pra barraca." },
                ],
            },
        }
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
        textoAltLogo: "Logo do bistrô",
        nichosCompativeis: ["catalogo", "hospedagem"],
        textosPadrao: {
            diferenciais: [
                { icone: "fa fa-champagne-glasses", titulo: "Pratos autorais", desc: "Preparados na hora do seu pedido, com técnica e cuidado." },
                { icone: "fa fa-leaf", titulo: "Ingredientes selecionados", desc: "Escolhidos todos os dias antes de ir pra cozinha." },
                { icone: "fa fa-wallet", titulo: "Pague como quiser", desc: "Pix, dinheiro ou cartão na entrega ou retirada." },
                { icone: "fab fa-whatsapp", titulo: "Fala com a gente", desc: "Dúvida em algum prato? É só chamar no WhatsApp." },
            ],
            comoFunciona: {
                titulo: "Como funciona",
                subtitulo: "Peça em poucos passos, sem complicação.",
                passos: [
                    { icone: "fa fa-list", titulo: "Monte seu pedido", desc: "Escolha os pratos do cardápio e adicione ao carrinho." },
                    { icone: "fa fa-route", titulo: "Escolha como receber", desc: "Entrega, retirada no balcão ou direto da sua mesa." },
                    { icone: "fab fa-whatsapp", titulo: "Confirme no WhatsApp", desc: "Seu pedido segue direto pra cozinha." },
                ],
            },
            ctaFinal: {
                titulo: "Pronto para brindar?",
                desc: "Seu prato favorito está a poucos toques de distância. Monte seu pedido agora.",
                botao: "Ver meu pedido",
            },
            heroCtas: { primaria: "Ver cardápio", secundaria: "Chamar no WhatsApp" },
            seloCarimbo: null,
            observacao: { placeholder: "Ex: ponto da carne, sem glúten, molho à parte..." },
            rodapeDescricao: "Pratos preparados com técnica e ingredientes selecionados, numa experiência gastronômica única. Peça pelo delivery ou reserve sua mesa.",
            apresentacao: {
                botaoPrincipal: "Ver cardápio completo",
                passos: [
                    { icone: "fa fa-list", titulo: "Monte seu pedido", desc: "Escolha os pratos do cardápio e adicione ao carrinho." },
                    { icone: "fa fa-route", titulo: "Escolha como receber", desc: "Entrega, retirada no balcão ou direto da sua mesa." },
                    { icone: "fab fa-whatsapp", titulo: "Confirme no WhatsApp", desc: "Seu pedido segue direto pra cozinha." },
                ],
            },
        }
    },

    maquiagem: {
        nomeExibicao: "Loja de Maquiagem",
        cores: {
            principal:        "#B23A64",
            principalEscura:  "#8A2C4E",
            principalClara:   "#FBE3EC",
            base:             "#241019",
            baseSuave:        "#3A1D28",
            fundo:            "#FFF6F8",
            destaque:         "#C9A66B",
            selo:             "#A67C52",
            linha:            "#F0D6DE"
        },
        fontes: {
            titulo: "Bodoni Moda",
            texto: "Poppins",
            script: "Parisienne"
        },
        formas: {
            raioBase: "16px",
            raioGrande: "24px",
            raioPill: "999px",
            bordaEspessura: "1px",
            bordaEstilo: "solid"
        },
        iconeFallbackLogo: "fa-palette",
        emojiPlaceholder: "💄",
        textoAltLogo: "Logo da loja de maquiagem",
        nichosCompativeis: ["catalogo", "hospedagem"],
        textosPadrao: {
            diferenciais: [
                { icone: "fa fa-palette", titulo: "Produtos originais", desc: "Maquiagens 100% originais, com procedência garantida." },
                { icone: "fa fa-gem", titulo: "Seleção cuidadosa", desc: "Itens escolhidos a dedo pra você ficar ainda mais linda." },
                { icone: "fa fa-wallet", titulo: "Pague como quiser", desc: "Pix, dinheiro ou cartão na entrega ou retirada." },
                { icone: "fab fa-whatsapp", titulo: "Fala com a gente", desc: "Dúvida em algum produto? É só chamar no WhatsApp." },
            ],
            comoFunciona: {
                titulo: "Como funciona",
                subtitulo: "Peça em poucos passos, sem complicação.",
                passos: [
                    { icone: "fa fa-list", titulo: "Monte seu pedido", desc: "Escolha os produtos do catálogo e adicione ao carrinho." },
                    { icone: "fa fa-route", titulo: "Escolha como receber", desc: "Entrega ou retirada, do jeito que for melhor pra você." },
                    { icone: "fab fa-whatsapp", titulo: "Confirme no WhatsApp", desc: "Seu pedido segue direto pra separação." },
                ],
            },
            ctaFinal: {
                titulo: "Bateu aquela vontade de se cuidar?",
                desc: "Seu produto favorito está a poucos toques de distância. Monte seu pedido agora.",
                botao: "Ver meu pedido",
            },
            heroCtas: { primaria: "Ver catálogo", secundaria: "Chamar no WhatsApp" },
            seloCarimbo: null,
            observacao: { placeholder: "Ex: tom da base, cor preferida, embalar para presente..." },
            rodapeDescricao: "Maquiagens selecionadas com cuidado, prontas pra realçar sua beleza. Peça pelo delivery e receba na sua casa.",
            apresentacao: {
                botaoPrincipal: "Ver catálogo completo",
                passos: [
                    { icone: "fa fa-list", titulo: "Monte seu pedido", desc: "Escolha os produtos do catálogo e adicione ao carrinho." },
                    { icone: "fa fa-route", titulo: "Escolha como receber", desc: "Entrega ou retirada, do jeito que for melhor pra você." },
                    { icone: "fab fa-whatsapp", titulo: "Confirme no WhatsApp", desc: "Seu pedido segue direto pra separação." },
                ],
            },
        }
    },

    salao: {
        nomeExibicao: "Salão / Estética",
        cores: {
            principal:        "#A8477A",
            principalEscura:  "#7E3159",
            principalClara:   "#F8E6EF",
            base:             "#2A1622",
            baseSuave:        "#402336",
            fundo:            "#FFF7FA",
            destaque:         "#C9A66B",
            selo:             "#7A8F6B",
            linha:            "#EFD6E2"
        },
        fontes: { titulo: "Playfair Display", texto: "Poppins", script: "Great Vibes" },
        formas: { raioBase: "14px", raioGrande: "22px", raioPill: "999px", bordaEspessura: "1px", bordaEstilo: "solid" },
        iconeFallbackLogo: "fa-scissors",
        emojiPlaceholder: "💇",
        textoAltLogo: "Logo do salão",
        nichosCompativeis: ["agendamento"],
        categoriasCompativeis: ["beleza"],
        textosPadrao: {
            diferenciais: [
                { icone: "fa fa-spa", titulo: "Cuidado completo", desc: "Atendimento pensado pra você se sentir bem do começo ao fim." },
                { icone: "fa fa-hand-sparkles", titulo: "Profissionais experientes", desc: "Equipe preparada e sempre atualizada nas novidades." },
                { icone: "fa fa-calendar-check", titulo: "Horário marcado", desc: "Chegou na hora, foi atendida na hora." },
                { icone: "fab fa-whatsapp", titulo: "Fala com a gente", desc: "Dúvida sobre algum serviço? É só chamar no WhatsApp." },
            ],
            comoFunciona: {
                titulo: "Como funciona",
                subtitulo: "Agende em poucos passos, sem complicação.",
                passos: [
                    { icone: "fa fa-list", titulo: "Escolha o serviço", desc: "Veja a lista de serviços e escolha o que você quer." },
                    { icone: "fa fa-calendar-check", titulo: "Escolha o horário", desc: "Marque o dia e o horário que ficam melhores pra você." },
                    { icone: "fab fa-whatsapp", titulo: "Confirme no WhatsApp", desc: "Seu horário fica reservado e você recebe a confirmação." },
                ],
            },
            ctaFinal: {
                titulo: "Que tal um momento só seu?",
                desc: "Reserve seu horário agora e cuide de você.",
                botao: "Agendar horário",
            },
            heroCtas: { primaria: "Ver serviços", secundaria: "Chamar no WhatsApp" },
            seloCarimbo: null,
            observacao: { placeholder: "Ex: referência de corte ou cor, preferência de profissional..." },
            rodapeDescricao: "Serviços de beleza e bem-estar feitos com carinho e atenção. Agende seu horário e venha se cuidar.",
            apresentacao: {
                botaoPrincipal: "Ver serviços",
                passos: [
                    { icone: "fa fa-list", titulo: "Escolha o serviço", desc: "Veja a lista de serviços e escolha o que você quer." },
                    { icone: "fa fa-calendar-check", titulo: "Escolha o horário", desc: "Marque o dia e o horário que ficam melhores pra você." },
                    { icone: "fab fa-whatsapp", titulo: "Confirme no WhatsApp", desc: "Seu horário fica reservado e você recebe a confirmação." },
                ],
            },
        }
    },

    clinica: {
        nomeExibicao: "Clínica / Consultório",
        cores: {
            principal:        "#0E8A8A",
            principalEscura:  "#0A6666",
            principalClara:   "#D9F2F1",
            base:             "#12262B",
            baseSuave:        "#1F3A40",
            fundo:            "#F5FBFB",
            destaque:         "#F2A93B",
            selo:             "#2F9E6B",
            linha:            "#D3E7E7"
        },
        fontes: { titulo: "Poppins", texto: "Nunito", script: "Nunito" },
        formas: { raioBase: "12px", raioGrande: "18px", raioPill: "999px", bordaEspessura: "1.5px", bordaEstilo: "solid" },
        iconeFallbackLogo: "fa-heart-pulse",
        emojiPlaceholder: "🩺",
        textoAltLogo: "Logo da clínica",
        nichosCompativeis: ["agendamento"],
        categoriasCompativeis: ["saude"],
        textosPadrao: {
            diferenciais: [
                { icone: "fa fa-user-doctor", titulo: "Profissionais qualificados", desc: "Atendimento com quem entende e se importa com você." },
                { icone: "fa fa-shield-heart", titulo: "Cuidado e acolhimento", desc: "Um ambiente pensado pra você se sentir seguro." },
                { icone: "fa fa-calendar-check", titulo: "Consulta agendada", desc: "Sem fila e sem espera: você escolhe o melhor horário." },
                { icone: "fab fa-whatsapp", titulo: "Fala com a gente", desc: "Dúvidas sobre o atendimento? É só chamar no WhatsApp." },
            ],
            comoFunciona: {
                titulo: "Como funciona",
                subtitulo: "Agende sua consulta em poucos passos.",
                passos: [
                    { icone: "fa fa-list", titulo: "Escolha o atendimento", desc: "Veja os serviços disponíveis e escolha o que você precisa." },
                    { icone: "fa fa-calendar-check", titulo: "Escolha o horário", desc: "Marque o dia e o horário mais conveniente." },
                    { icone: "fab fa-whatsapp", titulo: "Confirme no WhatsApp", desc: "Você recebe a confirmação e as orientações pra consulta." },
                ],
            },
            ctaFinal: {
                titulo: "Cuide da sua saúde",
                desc: "Agende seu atendimento agora, é rápido e sem burocracia.",
                botao: "Agendar consulta",
            },
            heroCtas: { primaria: "Ver atendimentos", secundaria: "Chamar no WhatsApp" },
            seloCarimbo: null,
            observacao: { placeholder: "Ex: preferência de horário, informação importante para o atendimento..." },
            rodapeDescricao: "Atendimento com cuidado, respeito e profissionais qualificados. Agende seu horário e cuide da sua saúde.",
            apresentacao: {
                botaoPrincipal: "Ver atendimentos",
                passos: [
                    { icone: "fa fa-list", titulo: "Escolha o atendimento", desc: "Veja os serviços disponíveis e escolha o que você precisa." },
                    { icone: "fa fa-calendar-check", titulo: "Escolha o horário", desc: "Marque o dia e o horário mais conveniente." },
                    { icone: "fab fa-whatsapp", titulo: "Confirme no WhatsApp", desc: "Você recebe a confirmação e as orientações pra consulta." },
                ],
            },
        }
    },

    espaco: {
        nomeExibicao: "Espaço / Serviços",
        cores: {
            principal:        "#3F7D58",
            principalEscura:  "#2D5C40",
            principalClara:   "#E1F0E7",
            base:             "#17211B",
            baseSuave:        "#26372D",
            fundo:            "#F7FAF7",
            destaque:         "#E0A63B",
            selo:             "#B5651D",
            linha:            "#DCE8DF"
        },
        fontes: { titulo: "Montserrat", texto: "Inter", script: "Inter" },
        formas: { raioBase: "10px", raioGrande: "16px", raioPill: "999px", bordaEspessura: "1.5px", bordaEstilo: "solid" },
        iconeFallbackLogo: "fa-toolbox",
        emojiPlaceholder: "🛠️",
        textoAltLogo: "Logo do espaço",
        nichosCompativeis: ["agendamento"],
        categoriasCompativeis: ["servicos"],
        textosPadrao: {
            diferenciais: [
                { icone: "fa fa-handshake", titulo: "Atendimento de confiança", desc: "Serviço feito com atenção, do combinado até a entrega." },
                { icone: "fa fa-star", titulo: "Qualidade garantida", desc: "Compromisso com o resultado e com o seu tempo." },
                { icone: "fa fa-calendar-check", titulo: "Horário reservado", desc: "Você escolhe o dia e a gente se organiza pra te atender." },
                { icone: "fab fa-whatsapp", titulo: "Fala com a gente", desc: "Dúvida ou orçamento? É só chamar no WhatsApp." },
            ],
            comoFunciona: {
                titulo: "Como funciona",
                subtitulo: "Reserve em poucos passos, sem complicação.",
                passos: [
                    { icone: "fa fa-list", titulo: "Escolha o serviço", desc: "Veja o que oferecemos e escolha o que combina com você." },
                    { icone: "fa fa-calendar-check", titulo: "Escolha o horário", desc: "Marque o dia e o horário que preferir." },
                    { icone: "fab fa-whatsapp", titulo: "Confirme no WhatsApp", desc: "Sua reserva é confirmada direto com a gente." },
                ],
            },
            ctaFinal: {
                titulo: "Vamos combinar seu horário?",
                desc: "Reserve agora e garanta o melhor dia pra você.",
                botao: "Reservar horário",
            },
            heroCtas: { primaria: "Ver serviços", secundaria: "Chamar no WhatsApp" },
            seloCarimbo: null,
            observacao: { placeholder: "Ex: detalhes do serviço, melhor horário, pontos de atenção..." },
            rodapeDescricao: "Serviços e espaços com atendimento de confiança e horário marcado. Reserve o seu e fale com a gente.",
            apresentacao: {
                botaoPrincipal: "Ver serviços",
                passos: [
                    { icone: "fa fa-list", titulo: "Escolha o serviço", desc: "Veja o que oferecemos e escolha o que combina com você." },
                    { icone: "fa fa-calendar-check", titulo: "Escolha o horário", desc: "Marque o dia e o horário que preferir." },
                    { icone: "fab fa-whatsapp", titulo: "Confirme no WhatsApp", desc: "Sua reserva é confirmada direto com a gente." },
                ],
            },
        }
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
        textoAltLogo: "Logo da loja",
        nichosCompativeis: ["catalogo", "agendamento", "hospedagem"],
        textosPadrao: {
            diferenciais: [
                { icone: "fa fa-store", titulo: "Qualidade", desc: "Produtos selecionados com cuidado." },
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
            observacao: { placeholder: "Ex: alguma preferência ou detalhe sobre o seu pedido..." },
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
}

window.TEMAS = TEMAS