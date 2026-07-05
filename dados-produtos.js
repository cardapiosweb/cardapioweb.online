// ============================================================
// PRODUTOS DA LOJA
// Cada objeto vira um card automaticamente. Para adicionar um
// produto novo, basta copiar um bloco e editar os campos.
// Categorias são criadas automaticamente pela ordem em que
// aparecem aqui — produtos da mesma categoria ficam juntos.
// ============================================================

const produtos = [

    // ===== ELETRÔNICOS =====
    {
        categoria: "Eletrônicos",
        icone: "fa-mobile-alt",
        nome: "MiniMon Power Bank Solar 10000mAh – Cabos Integrados e Lanterna",
        desc: "Carregador portátil MiniMon 10000mAh com recarga solar, cabos embutidos, saída rápida 3.1A e lanterna LED. Ideal para viagens e uso diário.",
        preco: 79.90,
        foto1: "./assets/img/eletronicos/eletronico1.png",
        foto2: "./assets/img/eletronicos/eletronico1b.png",
        oferta: true
    },
    {
        categoria: "Eletrônicos",
        icone: "fa-mobile-alt",
        nome: "Power Bank Solar 20000mAh 3.1A - Cabos Integrados e Lanterna LED",
        desc: "Carregador portátil MiniMon 20000mAh com recarga solar, 4 cabos embutidos, saída rápida 3.1A e lanterna LED. Ideal para viagens e uso diário.",
        preco: 29.90,
        foto1: "./assets/img/eletronicos/eletronico2.png",
        foto2: "./assets/img/eletronicos/eletronico2b.png",
        oferta: false
    },
    {
        categoria: "Eletrônicos",
        icone: "fa-mobile-alt",
        nome: "Teclado e Mouse Sem Fio PEFR12 - Conexão USB, 10 Metros",
        desc: "Kit de teclado e mouse sem fio PEFR12, com conexão USB e alcance de 10 metros. Design ergonômico, ideal para escritório e home office. Confortável, prático e perfeito para quem busca liberdade de movimento.",
        preco: 44.90,
        foto1: "./assets/img/eletronicos/eletronico3.png",
        foto2: "./assets/img/eletronicos/eletronico3b.png",
        oferta: false
    },
    {
        categoria: "Eletrônicos",
        icone: "fa-mobile-alt",
        nome: "Kit Teclado e Mouse Sem Fio Peining PE-F300M - Branco e Prata",
        desc: "Kit de teclado e mouse sem fio Peining PE-F300M em branco e prata. Conectividade Bluetooth, compatível com Windows, Android e iOS. Design slim e elegante, perfeito para home office e uso em tablets e notebooks.",
        preco: 27.90,
        foto1: "./assets/img/eletronicos/eletronico4.png",
        foto2: "./assets/img/eletronicos/eletronico4b.png",
        oferta: false
    },

    // ===== ACESSÓRIOS =====
    {
        categoria: "Acessórios",
        icone: "fa-headphones",
        nome: "Fone de Ouvido Estéreo LEIYO LE-0231 - Branco e Laranja",
        desc: "Fone de ouvido estéreo LEIYO LE-0231 com design branco e laranja. Ideal para música, chamadas e audiobooks. Fones com fio, resistentes e com som de qualidade para o dia a dia.",
        preco: 49.90,
        foto1: "./assets/img/acessorios/acessorio1.png",
        foto2: "./assets/img/acessorios/acessorio1b.png",
        oferta: true
    },
    {
        categoria: "Acessórios",
        icone: "fa-headphones",
        nome: "Fone de Ouvido Sem Fio IT-BLUE LE-0315 - Design de Gato",
        desc: "Fone de ouvido sem fio IT-BLUE LE-0315 com design de gato fofo e iluminação RGB. Ideal para crianças e jovens, com som estéreo e conexão Bluetooth 5.4. Perfeito para presentear e usar no dia a dia.",
        preco: 12.90,
        foto1: "./assets/img/acessorios/acessorio2.png",
        foto2: "./assets/img/acessorios/acessorio2b.png",
        oferta: false
    },
    {
        categoria: "Acessórios",
        icone: "fa-headphones",
        nome: "Fone de Ouvido Estéreo IT-BLUG LE-0276 - Vermelho e Preto",
        desc: "Fone de ouvido estéreo IT-BLUG LE-0276 em vermelho e preto. Ideal para música e chamadas, com som de qualidade e design ergonômico. Perfeito para uso diário, no trabalho ou na academia.",
        preco: 34.90,
        foto1: "./assets/img/acessorios/acessorio3.png",
        foto2: "./assets/img/acessorios/acessorio3b.png",
        oferta: false
    },
    {
        categoria: "Acessórios",
        icone: "fa-headphones",
        nome: "Fone de Ouvido Sem Fio IT-BLUG LE-2440 - Preto e Azul",
        desc: "Fone de ouvido sem fio IT-BLUG LE-2440 em preto e azul. Com estojo de carregamento, design compacto e som de alta qualidade. Ideal para uso diário, viagens e academia. Confortável e prático.",
        preco: 9.90,
        foto1: "./assets/img/acessorios/acessorio4.png",
        foto2: "./assets/img/acessorios/acessorio4b.png",
        oferta: false
    },
    {
        categoria: "Acessórios",
        icone: "fa-headphones",
        nome: "Fone de Ouvido Sem Fio Verde EJ-TWS-9 - Branco",
        desc: "Fone de ouvido sem fio Verde EJ-TWS-9 em branco. Com estojo de carregamento, design compacto e som de alta qualidade. Ideal para uso diário, viagens e academia. Confortável e prático.",
        preco: 9.90,
        foto1: "./assets/img/acessorios/acessorio5.png",
        foto2: "./assets/img/acessorios/acessorio5b.png",
        oferta: false
    },
    {
        categoria: "Acessórios",
        icone: "fa-headphones",
        nome: "Cooler Fan Magnético GUDLE FS03 - 15W de Potência",
        desc: "Cooler fan magnético GUDLE FS03 com 15W de potência para resfriamento instantâneo. Ideal para manter seu dispositivo cool durante longos jogos ou uso intenso. Design compacto e moderno.",
        preco: 9.90,
        foto1: "./assets/img/acessorios/acessorio6.png",
        foto2: "./assets/img/acessorios/acessorio6b.png",
        oferta: false
    },

    // ===== CASA E COZINHA =====
    {
        categoria: "Casa e Cozinha",
        icone: "fa-home",
        nome: "Lâmpada Musical Bluetooth IT-BLUE SC-9411 - RGB e Controle Remoto",
        desc: "Lâmpada musical Bluetooth IT-BLUE SC-9411 com iluminação RGB colorida e controle remoto. Ideal para decorar ambientes, festas ou relaxar com sua música favorita. Fácil instalação e uso.",
        preco: 149.90,
        foto1: "./assets/img/casa/casa1.png",
        foto2: "./assets/img/casa/casa1b.png",
        oferta: true
    },
    {
        categoria: "Casa e Cozinha",
        icone: "fa-home",
        nome: "Fechos de Trinco em Aço Inoxidável BOMVINK BOM-5912 - 2 Polegadas (2 Peças)",
        desc: "Fechos de trinco em aço inoxidável BOMVINK BOM-5912 de 2 polegadas, resistentes e duradouros. Ideais para portões, portas e caixas. Conjunto com 2 peças e parafusos inclusos, perfeito para uso residencial e profissional.",
        preco: 39.90,
        foto1: "./assets/img/casa/casa2.png",
        foto2: "./assets/img/casa/casa2b.png",
        oferta: false
    },
    {
        categoria: "Casa e Cozinha",
        icone: "fa-home",
        nome: "Testador de Tensão BOMVINK BOM-6402 - Amarelo, Fácil e Preciso",
        desc: "Testador de tensão BOMVINK BOM-6402 em amarelo, ideal para verificar a presença de eletricidade. Fácil, seguro, rápido e preciso, perfeito para uso profissional e doméstico. Funciona em 10V a 500V.",
        preco: 69.90,
        foto1: "./assets/img/casa/casa3.png",
        foto2: "./assets/img/casa/casa3b.png",
        oferta: false
    },
    {
        categoria: "Casa e Cozinha",
        icone: "fa-home",
        nome: "Chave de Fenda Teste de Tensão BOMVINK BOM-6403 - Profissional",
        desc: "Chave de fenda teste de tensão BOMVINK BOM-6403, ideal para detectar a presença de eletricidade. Funciona em 100V a 500V, com chip inteligente e design ergonômico. Perfeito para eletricistas e uso doméstico, seguro e confiável.",
        preco: 18.90,
        foto1: "./assets/img/casa/casa4.png",
        foto2: "./assets/img/casa/casa4b.png",
        oferta: false
    },

    // ===== VARIEDADES =====
    {
        categoria: "Variedades",
        icone: "fa-star",
        nome: "Cortador de Cabelo Profissional MiniMon MM-T106 - Design Dragão",
        desc: "Cortador de cabelo MiniMon MM-T106 com relevo de dragão. Profissional, preciso e durável, ideal para barbearias e uso doméstico. Embalagem premium.",
        preco: 32.90,
        foto1: "./assets/img/variedades/variedade1.png",
        foto2: "./assets/img/variedades/variedade1b.png",
        oferta: true
    },
    {
        categoria: "Variedades",
        icone: "fa-star",
        nome: "Controle Sem Fio MiniMon MM-SBP04 - Vibração de Dobro Motor",
        desc: "Controle sem fio MiniMon MM-SBP04 com tecnologia de vibração de dobro motor para imersão total. Design ergonômico, botões responsivos e conexão estável. Ideal para gamers de todos os níveis, perfeito para presentear ou usar no dia a dia.",
        preco: 22.90,
        foto1: "./assets/img/variedades/variedade2.png",
        foto2: "./assets/img/variedades/variedade2b.png",
        oferta: false
    },
    {
        categoria: "Variedades",
        icone: "fa-star",
        nome: "Carregador Veicular LELING LE-527C 3.4A com Cabo Tipo C",
        desc: "Carregador veicular LELING LE-527C com 2 portas e 3.4A de saída. Inclui cabo Tipo C de 100cm. Ideal para carregar smartphones e tablets no carro. Rápido, eficiente e compacto.",
        preco: 25.90,
        foto1: "./assets/img/variedades/variedade3.png",
        foto2: "./assets/img/variedades/variedade3b.png",
        oferta: false
    },
    {
        categoria: "Variedades",
        icone: "fa-star",
        nome: "Câmera Panorâmica IP IT-BLUE SC-B44 2.0MP - Branca",
        desc: "Câmera de segurança IP panorâmica IT-BLUE SC-B44 de 2.0MP e lente de 3.6mm. Ideal para monitoramento remoto com áudio bidirecional e visão noturna. Fácil instalação e configuração.",
        preco: 8.90,
        foto1: "./assets/img/variedades/variedade4.png",
        foto2: "./assets/img/variedades/variedade4b.png",
        oferta: false
    },
    {
        categoria: "Variedades",
        icone: "fa-star",
        nome: "Garrafa Térmica Flip Straw Preta 600ml (20oz)",
        desc: "Garrafa térmica Flip Straw em preto com 600ml (20oz) de capacidade. Ideal para manter suas bebidas frias ou quentes por horas. Design prático com canudo e alça para transporte.",
        preco: 8.90,
        foto1: "./assets/img/variedades/variedade5.png",
        foto2: "./assets/img/variedades/variedade5b.png",
        oferta: false
    },
    {
        categoria: "Variedades",
        icone: "fa-star",
        nome: "Trava com Alarme ADEC AC-106 - Preta",
        desc: "Trava com alarme ADEC AC-106 em preto. Ideal para proteger sua moto, bicicleta ou qualquer objeto de valor. Funciona com bateria e emite um som alto em caso de tentativa de furto.",
        preco: 8.90,
        foto1: "./assets/img/variedades/variedade6.png",
        foto2: "./assets/img/variedades/variedade6b.png",
        oferta: false
    },

]