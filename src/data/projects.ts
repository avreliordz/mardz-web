export type ProjectListItem = {
  num: string;
  title: string;
  client: string;
  yearRange: string;
  tags: string[];
  slug: string;
};

export type CaseStudy = ProjectListItem & {
  heroImage?: string;
  challenge: [string, string];
  role: string[];
  outcomes: { label: string; value: string }[];
  gallery: { src: string; alt: string }[];
};

export const projectList: ProjectListItem[] = [
  {
    num: "01",
    title: "Interact Studio",
    client: "Venture Building",
    yearRange: "2025–2026",
    tags: ["Strategy", "Dev"],
    slug: "interact-studio",
  },
  {
    num: "02",
    title: "Wizeline × Fortune 500",
    client: "Confidential",
    yearRange: "2022–2025",
    tags: ["Product Design Lead"],
    slug: "wizeline-product-lead",
  },
  {
    num: "03",
    title: "Butchershop MX",
    client: "Design Thinking Projects",
    yearRange: "2017–2019",
    tags: ["UX/UI"],
    slug: "butchershop-mx",
  },
  {
    num: "04",
    title: "Side project",
    client: "Personal",
    yearRange: "TBD",
    tags: ["Full Stack"],
    slug: "side-project",
  },
];

const placeholderGallery = (prefix: string): { src: string; alt: string }[] =>
  [1, 2, 3].map((i) => ({
    src: `/og-image.jpg`,
    alt: `${prefix} visual ${i}`,
  }));

export const caseStudies: Record<string, CaseStudy> = {
  "interact-studio": {
    ...projectList[0],
    challenge: [
      "Venture building exige validar hipótesis con rapidez sin sacrificar calidad de experiencia. Este caso documenta el enfoque end-to-end: discovery, prototipos y entrega con equipos multidisciplinarios.",
      "El contenido detallado con imágenes y proceso vive en GitBook; aquí un resumen estructural listo para sustituir cuando exportes el material final.",
    ],
    role: [
      "Estrategia de producto y validación con usuarios",
      "Diseño de interacción y prototipos de alta fidelidad",
      "Coordinación con desarrollo y stakeholders",
    ],
    outcomes: [
      { label: "Discovery", value: "Sprints iterativos" },
      { label: "Enfoque", value: "Hipótesis → build" },
      { label: "Alcance", value: "Venture building" },
    ],
    gallery: placeholderGallery("Interact Studio"),
  },
  "wizeline-product-lead": {
    ...projectList[1],
    challenge: [
      "Liderar diseño de producto para clientes Fortune 500 implica escala, compliance y velocidad. Este caso resume el rol de Product Design Lead en entregas de staff augmentation y equipos distribuidos.",
      "Sustituye estos párrafos con narrativa e imágenes desde GitBook o Dribbble cuando estén disponibles.",
    ],
    role: [
      "Product Design Lead en engagements de largo plazo",
      "Sistemas de diseño y QA de experiencia",
      "Mentorship y alineación diseño–ingeniería",
    ],
    outcomes: [
      { label: "Clientes", value: "Fortune 500" },
      { label: "Rol", value: "Lead" },
      { label: "Alcance", value: "Multi-equipo" },
    ],
    gallery: placeholderGallery("Wizeline"),
  },
  "butchershop-mx": {
    ...projectList[2],
    challenge: [
      "En Butchershop MX el foco fue facilitación de design thinking y UX/UI para proyectos de innovación con equipos locales e internacionales.",
      "Placeholder hasta integrar el case study completo desde tu archivo histórico.",
    ],
    role: [
      "UX/UI y talleres de design thinking",
      "Prototipado y pruebas con usuarios",
      "Colaboración con estrategia y marca",
    ],
    outcomes: [
      { label: "Énfasis", value: "Design thinking" },
      { label: "Período", value: "2017–2019" },
      { label: "Disciplina", value: "UX/UI" },
    ],
    gallery: placeholderGallery("Butchershop"),
  },
  "side-project": {
    ...projectList[3],
    challenge: [
      "Espacio reservado para un proyecto personal o side project full stack. El contenido se publicará cuando el alcance esté definido.",
      "Mientras tanto, este bloque mantiene la estructura del case study para migración fácil desde GitBook o nuevos assets.",
    ],
    role: [
      "Ideación y stack técnico",
      "Diseño e implementación",
      "Despliegue y métricas",
    ],
    outcomes: [
      { label: "Estado", value: "TBD" },
      { label: "Stack", value: "Full stack" },
      { label: "Enfoque", value: "Producto" },
    ],
    gallery: placeholderGallery("Side project"),
  },
};

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies[slug];
}

export function getAllSlugs(): string[] {
  return Object.keys(caseStudies);
}
