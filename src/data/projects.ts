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
    title: "Prevify",
    client: "AI-assisted tax compliance and monitoring platform.",
    yearRange: "—",
    tags: ["Product", "AI"],
    slug: "prevify",
  },
  {
    num: "02",
    title: "Itemz.GG",
    client: "Peer-to-peer marketplace for virtual collectibles.",
    yearRange: "—",
    tags: ["Marketplace", "P2P"],
    slug: "itemz-gg",
  },
  {
    num: "03",
    title: "Splattr",
    client: "3D Reconstruction and measurement app.",
    yearRange: "—",
    tags: ["3D", "Product"],
    slug: "splattr",
  },
  {
    num: "04",
    title: "Territorio Nacional",
    client: "Interactive news website.",
    yearRange: "—",
    tags: ["Editorial", "Web"],
    slug: "territorio-nacional",
  },
];

const placeholderGallery = (prefix: string): { src: string; alt: string }[] =>
  [1, 2, 3].map((i) => ({
    src: `/og-image.jpg`,
    alt: `${prefix} visual ${i}`,
  }));

export const caseStudies: Record<string, CaseStudy> = {
  prevify: {
    ...projectList[0],
    challenge: [
      "Prevify focuses on tax compliance and monitoring with AI-assisted workflows so teams can stay ahead of obligations without drowning in manual checks.",
      "Replace this summary with your full narrative, flows, and imagery when you export final case content.",
    ],
    role: [
      "Product and experience direction",
      "Compliance UX and monitoring patterns",
      "Collaboration with stakeholders and engineering",
    ],
    outcomes: [
      { label: "Focus", value: "Compliance" },
      { label: "Angle", value: "AI-assisted" },
      { label: "Type", value: "Platform" },
    ],
    gallery: placeholderGallery("Prevify"),
  },
  "itemz-gg": {
    ...projectList[1],
    challenge: [
      "Itemz.GG is a peer-to-peer marketplace built around trust, discovery, and smooth trading for virtual collectibles.",
      "Placeholder until you bring in detailed screens, metrics, and process from your archive.",
    ],
    role: [
      "Marketplace UX and IA",
      "Listing, trading, and trust patterns",
      "Cross-functional delivery",
    ],
    outcomes: [
      { label: "Model", value: "P2P" },
      { label: "Domain", value: "Collectibles" },
      { label: "Surface", value: "Marketplace" },
    ],
    gallery: placeholderGallery("Itemz.GG"),
  },
  splattr: {
    ...projectList[2],
    challenge: [
      "Splattr combines 3D reconstruction with measurement so users can capture and understand real-world geometry in-app.",
      "Swap these paragraphs for depth studies, technical constraints, and final visuals when ready.",
    ],
    role: [
      "Product UX for capture and measurement flows",
      "Clarity around 3D interactions",
      "Iteration with technical feasibility",
    ],
    outcomes: [
      { label: "Medium", value: "3D" },
      { label: "Job", value: "Measure" },
      { label: "Form", value: "App" },
    ],
    gallery: placeholderGallery("Splattr"),
  },
  "territorio-nacional": {
    ...projectList[3],
    challenge: [
      "Territorio Nacional delivers news through an interactive web experience that prioritizes clarity, pacing, and reader engagement.",
      "Extend this stub with editorial samples, interaction notes, and analytics when available.",
    ],
    role: [
      "Editorial web UX",
      "Interactive storytelling patterns",
      "Design–engineering alignment",
    ],
    outcomes: [
      { label: "Format", value: "News" },
      { label: "Experience", value: "Interactive" },
      { label: "Channel", value: "Web" },
    ],
    gallery: placeholderGallery("Territorio Nacional"),
  },
};

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies[slug];
}

export function getAllSlugs(): string[] {
  return Object.keys(caseStudies);
}
