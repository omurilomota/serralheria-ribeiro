export const company = {
  name: "Serralheria Ribeiro",
  legalName: "Serralheria Ribeiro",
  tagline: "Calhas em geral",
  cnpj: "00.000.000/0001-00",
  slogan: "Do portão a calha, tudo em um só lugar.",
  subSlogan:
    "Sua cobertura mais protegida e bem acabada. Projetos em aço e alumínio com medição, fabricação e instalação por uma equipe especializada.",
  phoneDisplay: "(18) 99999-0116",
  whatsapp: "5518999990116",
  email: "contato@exemplo.com",
  address: {
    street: "Rua dos Ipês, 410",
    district: "Distrito Industrial",
    city: "Junqueirópolis",
    state: "SP",
    zip: "00000-000",
    full: "Rua dos Ipês, 410 - Distrito Industrial - Junqueirópolis - SP",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Rua+dos+Ipes,+410+-+Pq.+Industrial+04+-+Junqueir%C3%B3polis+-+SP",
  hours: "Segunda a sexta, 7h às 17h · Sábado, 7h às 12h",
  audience: "Residências, comércios e obras",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://serralheria-ribeiro-web-project.vercel.app",
} as const;

export type ServiceOption = {
  id: string;
  label: string;
  minCents: number;
  maxCents: number;
};

export type Service = {
  id: string;
  name: string;
  group: "Serralheria" | "Calhas";
  short: string;
  description: string;
  icon: string;
  measureLabel: string;
  measureHint: string;
  baseUnits: number;
  optionsLabel: string;
  options: ServiceOption[];
};

export const services: Service[] = [
  {
    id: "portoes",
    name: "Portões sociais e eletrônicos",
    group: "Serralheria",
    short: "Portões",
    description:
      "Portões de abrir, basculantes, deslizantes e automatizados, com acabamento sob medida para a sua fachada.",
    icon: "gate",
    measureLabel: "Área do portão (m²)",
    measureHint: "Some a largura × altura do vão. Ex.: 3,5 m de largura por 1,8 m de altura = 6,3 m².",
    baseUnits: 6,
    optionsLabel: "Acabamento",
    options: [
      { id: "aco-pintado", label: "Aço carbono com pintura eletrostática", minCents: 62000, maxCents: 98000 },
      { id: "galvanizado", label: "Aço galvanizado", minCents: 72000, maxCents: 112000 },
      { id: "aluminio", label: "Alumínio", minCents: 85000, maxCents: 138000 },
    ],
  },
  {
    id: "grades-cercas",
    name: "Grades e cercas",
    group: "Serralheria",
    short: "Grades e cercas",
    description:
      "Proteção para residências e comércios: grades de janela, cercas, alambrados e painéis metálicos.",
    icon: "fence",
    measureLabel: "Metros lineares",
    measureHint: "Informe o comprimento total do perímetro a ser fechado, em metros lineares.",
    baseUnits: 12,
    optionsLabel: "Tipo",
    options: [
      { id: "simples", label: "Grade simples", minCents: 17000, maxCents: 26000 },
      { id: "reforcada", label: "Grade reforçada", minCents: 23000, maxCents: 34000 },
      { id: "alambrado", label: "Alambrado / tela", minCents: 12000, maxCents: 19000 },
    ],
  },
  {
    id: "estruturas",
    name: "Estruturas metálicas",
    group: "Serralheria",
    short: "Estruturas",
    description:
      "Galpões, coberturas, mezaninos e pergolados com cálculo de estrutura e montagem no local.",
    icon: "structure",
    measureLabel: "Área coberta (m²)",
    measureHint: "Informe a área total da cobertura ou galpão em metros quadrados.",
    baseUnits: 40,
    optionsLabel: "Estrutura",
    options: [
      { id: "cobertura", label: "Cobertura / telhado metálico", minCents: 34000, maxCents: 52000 },
      { id: "galpao", label: "Galpão", minCents: 41000, maxCents: 63000 },
      { id: "pergolado", label: "Pergolado / mezanino", minCents: 38000, maxCents: 58000 },
    ],
  },
  {
    id: "carretas-reboques",
    name: "Carretas e reboques",
    group: "Serralheria",
    short: "Carretas",
    description:
      "Carretas e reboques sob medida, reformas de chassi, assoalho e soldas estruturais.",
    icon: "trailer",
    measureLabel: "Unidades / projetos",
    measureHint: "Quantos equipamentos serão fabricados ou reformados?",
    baseUnits: 1,
    optionsLabel: "Escopo",
    options: [
      { id: "reforma", label: "Reforma e soldas", minCents: 90000, maxCents: 260000 },
      { id: "sob-medida", label: "Carreta sob medida", minCents: 780000, maxCents: 1850000 },
      { id: "reboque", label: "Reboque", minCents: 480000, maxCents: 1200000 },
    ],
  },
  {
    id: "reformas",
    name: "Reformas em geral",
    group: "Serralheria",
    short: "Reformas",
    description:
      "Soldas, reparos e reforços em portões, grades, coberturas e peças metálicas em geral.",
    icon: "weld",
    measureLabel: "Pontos de serviço",
    measureHint: "Estimativa de frentes de serviço. Não sabe? Deixe 1 e detalhe na observação.",
    baseUnits: 1,
    optionsLabel: "Tipo de reparo",
    options: [
      { id: "solda", label: "Solda / reparo pontual", minCents: 18000, maxCents: 55000 },
      { id: "pintura", label: "Reparo e pintura", minCents: 28000, maxCents: 85000 },
      { id: "reforco", label: "Reforço estrutural", minCents: 42000, maxCents: 140000 },
    ],
  },
  {
    id: "calhas",
    name: "Calhas em alumínio e galvanizado",
    group: "Calhas",
    short: "Calhas",
    description:
      "Calhas sob medida em alumínio e chapa galvanizada, com emendas soldadas e caimento correto.",
    icon: "gutter",
    measureLabel: "Metros lineares de calha",
    measureHint: "Some o comprimento de todas as águas do telhado.",
    baseUnits: 18,
    optionsLabel: "Material",
    options: [
      { id: "galvanizado", label: "Chapa galvanizada", minCents: 7800, maxCents: 10800 },
      { id: "aluminio", label: "Alumínio", minCents: 9500, maxCents: 13600 },
      { id: "completa", label: "Calha + rufo + condutores", minCents: 13200, maxCents: 19500 },
    ],
  },
  {
    id: "rufos",
    name: "Rufos e proteção de telhado",
    group: "Calhas",
    short: "Rufos",
    description:
      "Rufos de proteção e acabamento entre telhado e parede, evitando infiltrações.",
    icon: "roof",
    measureLabel: "Metros lineares de rufo",
    measureHint: "Informe o comprimento do encontro entre o telhado e a parede.",
    baseUnits: 12,
    optionsLabel: "Material",
    options: [
      { id: "galvanizado", label: "Galvanizado", minCents: 6200, maxCents: 8800 },
      { id: "aluminio", label: "Alumínio", minCents: 7400, maxCents: 10200 },
    ],
  },
  {
    id: "pingadeiras",
    name: "Pingadeiras e acabamentos",
    group: "Calhas",
    short: "Pingadeiras",
    description:
      "Pingadeiras para beirais, janelas e muros, além de cantoneiras e peças de acabamento.",
    icon: "detail",
    measureLabel: "Metros lineares",
    measureHint: "Some os beirais e paredes que receberão a pingadeira.",
    baseUnits: 10,
    optionsLabel: "Material",
    options: [
      { id: "galvanizado", label: "Galvanizado", minCents: 4800, maxCents: 7200 },
      { id: "aluminio", label: "Alumínio", minCents: 5800, maxCents: 8600 },
    ],
  },
  {
    id: "condutores",
    name: "Condutores de águas pluviais",
    group: "Calhas",
    short: "Condutores",
    description:
      "Tubos e bocais de descida que levam a água do telhado para o local certo, sem manchar a fachada.",
    icon: "downspout",
    measureLabel: "Metros lineares de condutor",
    measureHint: "Some a altura das descidas de água que serão instaladas.",
    baseUnits: 8,
    optionsLabel: "Material",
    options: [
      { id: "galvanizado", label: "Galvanizado", minCents: 4400, maxCents: 6800 },
      { id: "aluminio", label: "Alumínio", minCents: 5200, maxCents: 7800 },
    ],
  },
  {
    id: "instalacao",
    name: "Instalação e manutenção",
    group: "Calhas",
    short: "Instalação",
    description:
      "Troca de calhas furadas, limpeza técnica, vedação e manutenção preventiva da cobertura.",
    icon: "tools",
    measureLabel: "Pontos de atendimento",
    measureHint: "Quantos trechos ou pontos precisam de manutenção?",
    baseUnits: 1,
    optionsLabel: "Serviço",
    options: [
      { id: "manutencao", label: "Manutenção e vedação", minCents: 28000, maxCents: 82000 },
      { id: "troca", label: "Troca completa de calha", minCents: 65000, maxCents: 210000 },
      { id: "vistoria", label: "Vistoria técnica", minCents: 12000, maxCents: 35000 },
    ],
  },
];

export const serviceGroups: Array<Service["group"]> = ["Serralheria", "Calhas"];

export function getService(id: string): Service | undefined {
  return services.find((service) => service.id === id);
}

export const leadStatuses = [
  { id: "novo", label: "Novo contato", tone: "sky" },
  { id: "contatado", label: "Contato feito", tone: "indigo" },
  { id: "orcamento", label: "Orçamento enviado", tone: "amber" },
  { id: "negociando", label: "Negociando", tone: "violet" },
  { id: "ganho", label: "Fechado", tone: "emerald" },
  { id: "perdido", label: "Sem retorno", tone: "zinc" },
] as const;

export const quoteStatuses = [
  { id: "enviado", label: "Enviado" },
  { id: "aprovado", label: "Aprovado" },
  { id: "recusado", label: "Recusado" },
] as const;

export const projectStatuses = [
  { id: "medicao", label: "Medição realizada", description: "Confira o local e as medidas do seu projeto." },
  { id: "orcamento", label: "Orçamento aprovado", description: "Materiais separados e projeto liberado para produção." },
  { id: "producao", label: "Em produção", description: "Sua peça está sendo cortada, soldada e preparada na oficina." },
  { id: "pronto", label: "Pronto para instalação", description: "Peça finalizada, aguardando a agenda de instalação." },
  { id: "instalado", label: "Instalado", description: "Serviço concluído no local. Obrigado pela confiança!" },
] as const;

export const urgencyOptions = [
  { id: "sem-pressa", label: "Sem pressa" },
  { id: "proximas-semanas", label: "Nas próximas semanas" },
  { id: "urgente", label: "Preciso com urgência" },
] as const;

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const differentials = [
  {
    title: "Material de qualidade",
    description: "Chapas, perfis e alumínio de fornecedores confiáveis, com espessura correta para durar.",
  },
  {
    title: "Equipe especializada",
    description: "Serralheiros e calheiros próprios, com medição técnica e solda bem acabada.",
  },
  {
    title: "Compromisso com o projeto",
    description: "Prazo combinado, obra limpa e acompanhamento do início da medição até a instalação.",
  },
] as const;

export const processSteps = [
  {
    step: "01",
    title: "Medição no local",
    description: "Vamos até você, tiramos as medidas reais e entendemos o que precisa ser resolvido.",
  },
  {
    step: "02",
    title: "Orçamento claro",
    description: "Proposta detalhada por item, com validade e sem surpresas no final do serviço.",
  },
  {
    step: "03",
    title: "Fabricação própria",
    description: "Corte, solda e acabamento na nossa oficina, com conferência peça por peça.",
  },
  {
    step: "04",
    title: "Instalação e check-out",
    description: "Instalação, limpeza e você acompanha cada etapa pelo código do seu projeto.",
  },
] as const;

export const faq = [
  {
    q: "Vocês atendem em Junqueirópolis e região?",
    a: "Sim. Nossa oficina fica na Rua dos Ipês, 410, no Distrito Industrial, em Junqueirópolis - SP. Atendemos residências, comércios e obras na cidade e cidades vizinhas.",
  },
  {
    q: "Como funciona o orçamento de calha?",
    a: "Você informa o comprimento das águas e o material pelo formulário do site. Em seguida fazemos a medição técnica no local para confirmar metragem, caimento e pontos de descida antes de fechar o valor final.",
  },
  {
    q: "O valor estimado do site é o preço final?",
    a: "Não. O site mostra uma faixa de investimento de referência para você se organizar. O valor final depende de medição, acesso ao local, material escolhido e acabamento, e é confirmado por escrito no orçamento.",
  },
  {
    q: "Fabricam portão automático com motor?",
    a: "Sim. Fabricamos o portão sob medida (social, deslizante ou basculante) e instalamos a automação, com testes de abertura, fechamento e segurança.",
  },
  {
    q: "Consigo acompanhar o andamento do meu projeto?",
    a: "Sim. Cada projeto recebe um código de acompanhamento. Com ele você consulta a etapa atual no site: medição, orçamento, produção, pronto para instalação ou instalado.",
  },
] as const;
