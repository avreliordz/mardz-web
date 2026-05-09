import { ScrollReveal } from "@/components/ui/ScrollReveal";

const links = [
  { label: "avrelio.rdz@gmail.com", href: "mailto:avrelio.rdz@gmail.com" },
  { label: "+52 811 513 3603", href: "tel:+528115133603" },
  {
    label: "linkedin.com/in/marco-aurelio-rodriguez-garcia-mx",
    href: "https://linkedin.com/in/marco-aurelio-rodriguez-garcia-mx",
  },
  {
    label: "dribbble.com/avreliordz",
    href: "https://dribbble.com/avreliordz",
  },
  { label: "marcoaurelio.mx", href: "https://marcoaurelio.mx" },
];

export function Contact() {
  return (
    <section
      id="contact"
      className="bg-canvas px-5 py-24 md:px-8"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-[1400px]">
        <ScrollReveal>
          <p className="font-mono-label text-smoke">— 07</p>
          <h2
            id="contact-heading"
            className="section-title mt-6 max-w-3xl text-ink"
          >
            Let&apos;s build
            <br />
            something real.
          </h2>
          <p className="mt-6 max-w-xl text-fog">
            Available for consulting, product leadership &amp; venture
            collaboration. Monterrey, NL — Remote friendly.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.06} className="mt-16 max-w-xl">
          <div className="border border-graphite bg-carbon/30 p-8">
            <p className="font-mono-label text-smoke">Direct</p>
            <ul className="mt-6 space-y-4">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      l.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="text-sm text-fog underline-offset-4 transition-colors hover:text-ink hover:underline"
                    data-cursor-hover
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
