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
      "Venture building means validating hypotheses quickly without sacrificing experience quality. This case outlines the end-to-end approach: discovery, prototyping, and delivery with cross-functional teams.",
      "Full narrative with imagery and process lives in GitBook; this is a structural summary you can replace when you export final content.",
    ],
    role: [
      "Product strategy and user validation",
      "Interaction design and high-fidelity prototypes",
      "Coordination with engineering and stakeholders",
    ],
    outcomes: [
      { label: "Discovery", value: "Iterative sprints" },
      { label: "Focus", value: "Hypothesis → build" },
      { label: "Scope", value: "Venture building" },
    ],
    gallery: placeholderGallery("Interact Studio"),
  },
  "wizeline-product-lead": {
    ...projectList[1],
    challenge: [
      "Leading product design for Fortune 500 clients means scale, compliance, and speed. This case summarizes the Product Design Lead role on long-term staff augmentation and distributed teams.",
      "Replace these paragraphs with narrative and visuals from GitBook or Dribbble when available.",
    ],
    role: [
      "Product Design Lead on long-term engagements",
      "Design systems and experience QA",
      "Mentorship and design–engineering alignment",
    ],
    outcomes: [
      { label: "Clients", value: "Fortune 500" },
      { label: "Role", value: "Lead" },
      { label: "Scope", value: "Multi-team" },
    ],
    gallery: placeholderGallery("Wizeline"),
  },
  "butchershop-mx": {
    ...projectList[2],
    challenge: [
      "At Butchershop MX the focus was facilitating design thinking and UX/UI for innovation projects with local and international teams.",
      "Placeholder until the full case study is brought in from your archive.",
    ],
    role: [
      "UX/UI and design-thinking workshops",
      "Prototyping and user testing",
      "Collaboration with strategy and brand",
    ],
    outcomes: [
      { label: "Focus", value: "Design thinking" },
      { label: "Period", value: "2017–2019" },
      { label: "Discipline", value: "UX/UI" },
    ],
    gallery: placeholderGallery("Butchershop"),
  },
  "side-project": {
    ...projectList[3],
    challenge: [
      "Reserved for a personal or full-stack side project. Content will ship once scope is defined.",
      "Meanwhile this block keeps the case-study structure for an easy migration from GitBook or new assets.",
    ],
    role: [
      "Ideation and technical stack",
      "Design and implementation",
      "Shipping and metrics",
    ],
    outcomes: [
      { label: "Status", value: "TBD" },
      { label: "Stack", value: "Full stack" },
      { label: "Focus", value: "Product" },
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
