export type ProjectListItem = {
  num: string;
  title: string;
  client: string;
  yearRange: string;
  tags: string[];
  slug: string;
  /** Featured-work hover preview + case hero */
  previewGif?: string;
};

export type CaseStudy = ProjectListItem & {
  heroImage?: string;
  /** Merged product framing + problem space (shown under Challenges) */
  challenges: string[];
  /** Response / shipped approach (shown under Hypothesis) */
  solutions: string[];
  role: string[];
  outcomes: { label: string; value: string }[];
  gallery: { src: string; alt: string }[];
};

export const projectList: ProjectListItem[] = [
  {
    num: "01",
    title: "Prevify App",
    client: "Prevify.mx — AI-assisted tax compliance and monitoring.",
    yearRange: "—",
    tags: ["Product", "AI"],
    slug: "prevify",
    previewGif: "/portfolio-imgss/prevify-main.gif",
  },
  {
    num: "02",
    title: "Itemz.gg",
    client: "Itemz.gg — Peer-to-peer virtual collectibles trading.",
    yearRange: "—",
    tags: ["Marketplace", "P2P"],
    slug: "itemz-gg",
    previewGif: "/portfolio-imgss/itemz-main.gif",
  },
  {
    num: "03",
    title: "Splattr",
    client:
      "3D reconstruction from video — LongSplat / Gaussian splatting pipelines.",
    yearRange: "—",
    tags: ["3D", "Product"],
    slug: "splattr",
    previewGif: "/portfolio-imgss/splattr-main.gif",
  },
  {
    num: "04",
    title: "Territorio Nacional",
    client: "TerritorioNacional.mx — Transparency-first AI news platform.",
    yearRange: "—",
    tags: ["Editorial", "Web"],
    slug: "territorio-nacional",
    previewGif: "/portfolio-imgss/territorio-main.gif",
  },
];

const placeholderGallery = (prefix: string): { src: string; alt: string }[] =>
  [1, 2, 3].map((i) => ({
    src: `/og-image.jpg`,
    alt: `${prefix} visual ${i}`,
  }));

function galleryWithPreview(
  prefix: string,
  previewGif: string | undefined,
): { src: string; alt: string }[] {
  const rest = placeholderGallery(prefix);
  if (!previewGif) return rest;
  return [{ src: previewGif, alt: `${prefix} — product preview` }, ...rest.slice(1)];
}

export const caseStudies: Record<string, CaseStudy> = {
  prevify: {
    ...projectList[0],
    challenges: [
      "Tax compliance teams across different industries juggle fragmented data, slow manual reviews, and opaque rule changes, making it hard to spot risk early or explain decisions to stakeholders.",
      "Other concepts of tax compliance software lean too heavily toward the accounting operations of the business; they lack specific tools for live-monitoring fiscal status across vendors, clients, employees, and collaborators.",
    ],
    solutions: [
      "A guided monitoring workspace that pairs AI-suggested flags with human-readable rationale, audit trails, and clear escalation paths so experts stay in control.",
      "Prevify focuses on tax compliance and monitoring with AI-assisted workflows so teams can stay ahead of obligations without drowning in manual checks.",
      "The experience prioritizes progressive disclosure: summaries for leadership, drill-down for analysts, and exportable evidence packs for reviews—reducing context-switching across tools.",
    ],
    role: [
      "Brand design & growth",
      "Product management and product direction",
      "Compliance UX and monitoring patterns",
      "Full-stack implementation",
    ],
    outcomes: [
      { label: "Design-to-deploy", value: "2 Months" },
      { label: "Pre-seed raised", value: "$40K USD" },
      { label: "QA testing", value: "400 Hours" },
    ],
    gallery: galleryWithPreview("Prevify App", projectList[0].previewGif),
  },
  "itemz-gg": {
    ...projectList[1],
    challenges: [
      "During the last few years, the digital and virtual collectibles market has boomed and bridged from the videogame industry to the blockchain ecosystem.",
      "Given the decentralized nature of the blockchain ecosystem, a group of fellow entrepreneurs and I identified an opportunity in peer-to-peer virtual collectibles trading.",
    ],
    solutions: [
      "If the user is given a proper decentralized and secure peer-to-peer marketplace platform, they can monetize their ownership of digital collectibles in an open trading market.",
    ],
    role: [
      "Brand design & growth",
      "Product management and product direction",
      "User research and service design",
      "Full-stack implementation",
    ],
    outcomes: [
      { label: "User research", value: "100 Hours" },
      { label: "Sponsorship raised", value: "$10K USD" },
      { label: "Users & community members", value: "+4K" },
    ],
    gallery: galleryWithPreview("Itemz.gg", projectList[1].previewGif),
  },
  splattr: {
    ...projectList[2],
    challenges: [
      "Efficiently reconstructing and rendering high-quality 3D scenes from 2D images in real time, without the heavy computational cost and latency of traditional methods like Neural Radiance Fields.",
      "More concretely: traditional NeRF-style approaches are slow to train and render; real-time applications (AR/VR, simulations, interactive media) require low latency; maintaining photorealistic fidelity while improving performance is non-trivial; and handling large-scale scenes without exploding memory usage is difficult.",
      "The problem becomes: how can we represent a 3D scene in a way that is both fast to render and visually accurate, while being scalable and trainable efficiently?",
    ],
    solutions: [
      "A production web application that converts video footage of rooms into interactive 3D point cloud models and reconstructed meshes using LongSplat — NVIDIA's state-of-the-art unposed 3D Gaussian splatting.",
      "Representing a scene as a set of anisotropic 3D Gaussians (instead of dense neural fields) allows for real-time rendering with high fidelity by leveraging rasterization-friendly primitives and GPU acceleration.",
      "Key assumptions in that approach: a scene can be approximated as volumetric Gaussians with position, covariance (shape and orientation), color, and opacity; those Gaussians can be projected ('splatted') onto the screen efficiently; sorting and blending Gaussians in screen space is much faster than volumetric ray marching; and optimization can still converge to photorealistic results with gradient-based methods.",
    ],
    role: [
      "User interface design",
      "Full-stack implementation",
    ],
    outcomes: [
      { label: "In render cost savings", value: "$20K USD" },
      { label: "In worktime optimization", value: "+10K Hours" },
      { label: "Of successful beta testing", value: "+800 Hours" },
    ],
    gallery: galleryWithPreview("Splattr", projectList[2].previewGif),
  },
  "territorio-nacional": {
    ...projectList[3],
    challenges: [
      "In Mexico, public trust in traditional news media has eroded significantly over the past decades. A widespread perception exists that editorial lines are influenced—directly or indirectly—by political affiliations, corporate interests, or economic dependencies.",
      "That perception is reinforced by concentration of media ownership among a limited number of stakeholders; lack of transparency in editorial decision-making; selective framing and omission of relevant context; and increasing polarization of narratives across outlets.",
      "Readers face information asymmetry: multiple versions of the same event, each shaped by distinct agendas. That environment generates distrust toward institutional media, difficulty identifying objective or verifiable information, reduced civic engagement from uncertainty, and increased vulnerability to misinformation and echo chambers.",
      "The core problem is not only bias itself, but the absence of a scalable, transparent mechanism to produce and validate neutral narratives at speed and breadth.",
    ],
    solutions: [
      "An AI-powered, fully or semi-automated digital news platform—territorionacional.mx—can reduce perceived and actual bias in news dissemination by leveraging algorithmic transparency, multi-source ingestion, and structured content generation.",
      "The approach follows principles of algorithmic neutrality through design: by decoupling content generation from human editorial incentives, AI systems can aggregate information from diverse sources (institutional, independent, international), detect and highlight discrepancies across narratives, generate multi-perspective summaries rather than single-thread storytelling, and apply consistent rules for relevance, weighting, and inclusion.",
      "While AI is not inherently unbiased, its bias can be measured, audited, and iterated—unlike opaque human editorial processes.",
    ],
    role: [
      "Brand design & growth",
      "Content production pipeline automation",
      "User interface design and development",
      "Full-stack implementation",
    ],
    outcomes: [
      { label: "In 1 Month after launch", value: "+10.5K readers" },
      { label: "Seed money raised", value: "$10K USD" },
      { label: "AI-assisted editorial", value: "+80 articles" },
    ],
    gallery: galleryWithPreview(
      "Territorio Nacional",
      projectList[3].previewGif,
    ),
  },
};

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies[slug];
}

export function getAllSlugs(): string[] {
  return Object.keys(caseStudies);
}
