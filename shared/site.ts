// Tudo o que muda no site mora aqui: contato, endereço, serviços, FAQ.
// Itens marcados com "CONFIRMAR" precisam ser validados com a Laiane antes de publicar.

export interface Service {
  slug: string
  name: string
  kicker: string
  short: string
  intro: string
  body: string[]
  idealFor: string[]
  /** Desenho do cílio no card: quantidade de fios, comprimento e curvatura */
  glyph: { density: number, length: number, curl: number, fan: number }
  keywords: string[]
  faq: { q: string, a: string }[]
}

export const site = {
  name: 'Laiane Nicole',
  role: 'Lash designer',
  brand: 'Laiane Nicole Lash Designer',
  handle: 'llaianelash',
  instagram: 'https://www.instagram.com/llaianelash/',

  // CONFIRMAR: número real de agendamento (somente dígitos, com 55 + DDD).
  // Também pode ser trocado sem mexer no código pela env NUXT_PUBLIC_WHATSAPP na Vercel.
  whatsapp: '5547900000000',
  whatsappMessage: 'Oi, Laiane! Vim pelo site e quero agendar um horário.',

  address: {
    street: 'Rua Itália, 121',
    district: 'Nações',
    city: 'Balneário Camboriú',
    state: 'SC',
    country: 'BR',
    // A Rua Itália tem dois CEPs no bairro (88338-260 e 88338-265). CONFIRMAR o do número 121.
    postalCode: '',
  },
  mapsQuery: 'Rua Itália, 121 - Nações, Balneário Camboriú - SC',
  movedAt: '2026-07-07',

  // CONFIRMAR: dias e horários reais.
  hours: 'Atendimento com hora marcada',

  description:
    'Extensão de cílios fio a fio, volume brasileiro, efeito molhado e lash lifting no bairro Nações, em Balneário Camboriú. Atendimento com hora marcada com a lash designer Laiane Nicole.',
} as const

export const services: Service[] = [
  {
    slug: 'extensao-de-cilios-fio-a-fio',
    name: 'Fio a fio',
    kicker: 'Natural',
    short: 'Um fio sintético em cada fio seu. Parece cílio de nascença, só que mais escuro e mais longo.',
    intro:
      'O fio a fio é a técnica clássica de extensão de cílios: um fio sintético colado em cada cílio natural, isolado, sem grudar nos vizinhos.',
    body: [
      'O resultado é o mais discreto de todos. Quem olha percebe que o olhar está mais aberto, mas dificilmente descobre que tem extensão ali.',
      'É a escolha certa pra primeira vez, pra quem trabalha em ambiente mais formal ou pra quem já tem bastante cílio e só quer comprimento e curvatura.',
    ],
    idealFor: ['Primeira extensão', 'Quem prefere discrição', 'Quem já tem cílios cheios'],
    glyph: { density: 26, length: 0.82, curl: 0.5, fan: 1 },
    keywords: ['extensão de cílios fio a fio Balneário Camboriú', 'cílios naturais Balneário Camboriú'],
    faq: [
      {
        q: 'Fio a fio fica natural mesmo?',
        a: 'Fica. Como é um sintético por fio natural, a densidade continua sendo a sua. O que muda é o comprimento, a cor e a curvatura.',
      },
      {
        q: 'Dá pra fazer fio a fio com cílio ralo?',
        a: 'Dá, mas o efeito vai ser discreto. Se você quer mais preenchimento, o volume brasileiro costuma resolver melhor. A gente decide isso juntas no dia.',
      },
    ],
  },
  {
    slug: 'volume-brasileiro',
    name: 'Volume brasileiro',
    kicker: 'Preenchido',
    short: 'Fios em Y que preenchem as falhas e dão aquele efeito de rímel sem pesar no olho.',
    intro:
      'No volume brasileiro cada cílio natural recebe um fio em formato de Y, que abre em duas pontas. Com isso o olhar ganha densidade sem precisar de fios grossos.',
    body: [
      'É o meio-termo entre o fio a fio e os volumes mais marcados. Fica cheio, escuro e com textura, mas continua leve.',
      'Funciona muito bem pra quem tem falhas, cílios finos ou simplesmente quer sair de casa já com cara de maquiada.',
    ],
    idealFor: ['Cílios finos ou com falhas', 'Efeito de rímel', 'Quem quer volume sem exagero'],
    glyph: { density: 42, length: 0.9, curl: 0.58, fan: 2 },
    keywords: ['volume brasileiro Balneário Camboriú', 'extensão de cílios volume Balneário Camboriú'],
    faq: [
      {
        q: 'Volume brasileiro pesa?',
        a: 'Não deveria. O fio em Y é fino e leve justamente pra dar volume sem forçar o cílio natural. Se pesar, tem algo errado na escolha do fio.',
      },
      {
        q: 'Qual a diferença pro fio a fio?',
        a: 'No fio a fio vai um fio simples por cílio. No brasileiro vai um fio em Y, com duas pontas, então o resultado fica bem mais cheio.',
      },
    ],
  },
  {
    slug: 'efeito-molhado',
    name: 'Efeito molhado',
    kicker: 'Marcante',
    short: 'Pontas agrupadas, com cara de cílio recém-saído do mar. Brilhoso, texturizado e com muita presença.',
    intro:
      'O efeito molhado, também chamado de wet look, junta os fios em pequenos feixes pontudos. O visual lembra cílios molhados, com textura bem definida.',
    body: [
      'É um efeito com personalidade, que aparece em foto e chama atenção de perto. Combina com quem gosta de olhar marcado e quer fugir do volume tradicional.',
      'Em Balneário, com praia e calor, tem quem goste dele também porque segue bonito depois do mergulho.',
    ],
    idealFor: ['Olhar marcado', 'Quem ama foto', 'Quem quer algo diferente'],
    glyph: { density: 34, length: 0.95, curl: 0.62, fan: 3 },
    keywords: ['efeito molhado cílios Balneário Camboriú', 'wet look cílios Balneário Camboriú'],
    faq: [
      {
        q: 'Efeito molhado é a mesma coisa que volume?',
        a: 'Não. No volume os fios ficam abertos e espalhados. No efeito molhado eles se juntam em pontas, o que deixa a textura mais definida.',
      },
      {
        q: 'Posso ir pra praia com efeito molhado?',
        a: 'Pode, depois das primeiras 24 horas. Só lave e penteie os cílios depois do mar ou da piscina pra tirar sal e cloro.',
      },
    ],
  },
  {
    slug: 'lash-lifting',
    name: 'Lash lifting',
    kicker: 'Seus fios',
    short: 'Curvatura nos seus próprios cílios, sem extensão. Você acorda com eles levantados e não precisa de manutenção.',
    intro:
      'O lash lifting levanta e curva os seus cílios naturais, de raiz a ponta. Não leva fio sintético nenhum.',
    body: [
      'É pra quem tem cílio comprido mas reto, ou pra quem não quer a rotina de manutenção da extensão. O olhar abre na hora e você dispensa o curvex.',
      'Normalmente o lifting é feito junto com a coloração dos fios, pra deixar a ponta mais escura e visível.',
    ],
    idealFor: ['Cílios longos e retos', 'Quem não quer manutenção', 'Rotina prática'],
    glyph: { density: 22, length: 0.68, curl: 0.95, fan: 1 },
    keywords: ['lash lifting Balneário Camboriú', 'lifting de cílios Balneário Camboriú'],
    faq: [
      {
        q: 'Quanto tempo dura o lash lifting?',
        a: 'Em geral de 6 a 8 semanas, que é o tempo que o cílio natural leva pra se renovar. Depois disso os fios novos crescem retos de novo.',
      },
      {
        q: 'Lash lifting ou extensão?',
        a: 'Se você tem cílios bons e quer praticidade, lifting. Se quer mais comprimento, cor e volume do que seus fios conseguem dar, extensão.',
      },
    ],
  },
]

export const steps = [
  {
    n: '01',
    title: 'A conversa',
    text: 'Você me conta como é sua rotina e o efeito que sonha. Tem foto de referência? Manda no WhatsApp antes.',
  },
  {
    n: '02',
    title: 'O mapeamento',
    text: 'Antes do primeiro fio eu desenho o tamanho e a curvatura de cada parte do olho. É isso que faz o resultado combinar com o seu rosto.',
  },
  {
    n: '03',
    title: 'A aplicação',
    text: 'Você fica deitada, de olhos fechados, numa maca confortável. Não dói, e tem quem aproveite pra cochilar.',
  },
  {
    n: '04',
    title: 'O depois',
    text: 'Você sai sabendo exatamente como cuidar e quando voltar pra manutenção. Qualquer dúvida, é só chamar.',
  },
]

export const care = [
  { title: 'Primeiras 24 horas', text: 'Nada de água, vapor, sauna ou academia pesada. É o tempo que a cola leva pra curar por completo.' },
  { title: 'Lave, sim', text: 'Cílio limpo dura mais. Use espuma própria pra extensão e enxágue com cuidado, de cima pra baixo.' },
  { title: 'Fuja do óleo', text: 'Demaquilante bifásico e cremes oleosos perto dos olhos enfraquecem a cola. Prefira produtos sem óleo.' },
  { title: 'Escovinha todo dia', text: 'Penteie de manhã, depois de lavar e depois da praia. Os fios ficam alinhados e você evita que se embolem.' },
  { title: 'Sem rímel, sem curvex', text: 'A extensão já faz esse papel. Rímel e curvex só pesam e quebram os fios.' },
  { title: 'Manutenção em dia', text: 'Volte a cada 15 a 21 dias, mais ou menos. Assim o olhar fica sempre cheio e ninguém percebe falhas.' },
]

export const faq = [
  {
    q: 'Extensão de cílios estraga o cílio natural?',
    a: 'Quando o fio escolhido respeita o peso que o seu cílio aguenta e a remoção é feita por profissional, não. O estrago costuma vir de fio pesado demais ou de arrancar a extensão em casa.',
  },
  {
    q: 'Quanto tempo dura a extensão de cílios?',
    a: 'Os fios sintéticos caem junto com os seus cílios naturais, que se renovam sozinhos. Por isso a manutenção costuma ser a cada 15 a 21 dias.',
  },
  {
    q: 'Dói fazer extensão de cílios?',
    a: 'Não. Você fica de olhos fechados o tempo todo, deitada numa maca confortável. Tem quem aproveite pra cochilar.',
  },
  {
    q: 'Qual a diferença entre fio a fio e volume brasileiro?',
    a: 'No fio a fio vai um fio simples em cada cílio natural, com resultado bem discreto. No volume brasileiro vai um fio em Y, com duas pontas, e o olhar fica mais cheio.',
  },
  {
    q: 'Tenho olho sensível ou alergia. Posso fazer?',
    a: 'Me conta antes de agendar. Dependendo do caso dá pra fazer um teste ou indicar outro procedimento. Prefiro perder um horário a arriscar o seu olho.',
  },
  {
    q: 'Onde fica o atendimento?',
    a: 'Na Rua Itália, 121, bairro Nações, em Balneário Camboriú (SC). O endereço é novo desde 07/07/2026 e o atendimento é com hora marcada.',
  },
  {
    q: 'Como faço pra agendar?',
    a: 'Pelo WhatsApp. Me manda uma mensagem dizendo qual efeito te interessa e eu te passo os horários livres da semana.',
  },
]

// Depoimentos reais (nome + texto autorizados). Enquanto estiver vazio, a seção não aparece.
export const testimonials: { name: string, text: string, service?: string }[] = []

export const marquee = ['Fio a fio', 'Volume brasileiro', 'Efeito molhado', 'Lash lifting', 'Manutenção', 'Remoção segura']

export const fullAddress = `${site.address.street}, ${site.address.district}, ${site.address.city} - ${site.address.state}`
