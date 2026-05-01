export type Capability = {
  id: string;
  title: string;
  description: string;
};

export const capabilities: Capability[] = [
  {
    id: "01",
    title: "Product Strategy & Validation",
    description:
      "Investigación, hipótesis, discovery sprints y go-to-market para startups.",
  },
  {
    id: "02",
    title: "End-to-End Product Design",
    description:
      "UX research → wireframes → UI systems → prototipos interactivos.",
  },
  {
    id: "03",
    title: "Design Systems",
    description:
      "Componentes reutilizables, tokens de diseño y documentación técnica.",
  },
  {
    id: "04",
    title: "Frontend Development",
    description:
      "React, Next.js, Tailwind — interfaces accesibles y performantes.",
  },
  {
    id: "05",
    title: "Team Leadership & Mentorship",
    description:
      "Staff augmentation, onboarding y cultura de diseño en equipos técnicos.",
  },
  {
    id: "06",
    title: "AI-Assisted Workflows",
    description:
      "Automatización de procesos creativos y flujos de trabajo con IA aplicada.",
  },
];
