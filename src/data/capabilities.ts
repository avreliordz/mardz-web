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
      "Research, hypotheses, discovery sprints, and go-to-market for startups.",
  },
  {
    id: "02",
    title: "End-to-End Product Design",
    description:
      "UX research → wireframes → UI systems → interactive prototypes.",
  },
  {
    id: "03",
    title: "Design Systems",
    description:
      "Reusable components, design tokens, and technical documentation.",
  },
  {
    id: "04",
    title: "Frontend Development",
    description:
      "React, Next.js, Tailwind — accessible, performant interfaces.",
  },
  {
    id: "05",
    title: "Team Leadership & Mentorship",
    description:
      "Staff augmentation, onboarding, and design culture on technical teams.",
  },
  {
    id: "06",
    title: "AI-Assisted Workflows",
    description:
      "Automation of creative processes and applied-AI workstreams.",
  },
];
