import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  getAllSlugs,
  getCaseStudy,
  type CaseStudy,
} from "@/data/projects";
import { cn } from "@/lib/utils";

type Props = { params: { slug: string } };

function CaseStudyHeroImage({ study }: { study: CaseStudy }) {
  const heroSrc =
    study.previewGif ?? study.gallery[0]?.src ?? "/og-image.jpg";
  const heroAlt = `${study.title} — preview`;
  if (heroSrc.endsWith(".gif")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- animated GIF playback
      <img
        src={heroSrc}
        alt={heroAlt}
        className="absolute inset-0 h-full w-full bg-canvas object-cover"
      />
    );
  }
  return (
    <Image
      src={heroSrc}
      alt={study.gallery[0]?.alt ?? heroAlt}
      fill
      className="object-cover"
      sizes="(max-width: 1100px) 100vw, 1100px"
      priority
    />
  );
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const study = getCaseStudy(params.slug);
  if (!study) return {};
  return {
    title: `${study.title} — Marco Aurelio Rodríguez`,
    description: study.challenges[0],
    openGraph: {
      title: `${study.title} — Case study`,
      description: study.challenges[0],
    },
  };
}

export default function WorkCasePage({ params }: Props) {
  const study = getCaseStudy(params.slug);
  if (!study) notFound();

  const heroSrc =
    study.previewGif ?? study.gallery[0]?.src ?? "/og-image.jpg";
  const heroIsGif = heroSrc.endsWith(".gif");

  return (
    <article className="min-h-screen bg-canvas pb-24 pt-28">
      <div className="mx-auto max-w-[1100px] px-5 md:px-8">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ash hover:text-ink"
          data-cursor-hover
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Work
        </Link>

        <header className="mt-12 border-b border-graphite pb-12">
          <p className="font-mono text-sm text-ash">{study.yearRange}</p>
          <h1 className="section-title mt-4 text-ink">{study.title}</h1>
          <p className="mt-2 text-lg text-fog">{study.client}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {study.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-graphite px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-smoke"
              >
                {t}
              </span>
            ))}
          </div>
        </header>

        <div
          className={cn(
            "relative mt-12 aspect-[16/9] w-full overflow-hidden",
            heroIsGif ? "bg-canvas" : "bg-carbon",
          )}
        >
          <CaseStudyHeroImage study={study} />
        </div>

        <section className="mt-16" aria-labelledby="challenges-heading">
          <h2 id="challenges-heading" className="font-mono-label text-smoke">
            Challenges
          </h2>
          <div className="mt-6 space-y-6 text-base leading-relaxed text-fog md:text-lg">
            {study.challenges.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        <section
          className="mt-16"
          aria-labelledby="hypothesis-heading"
        >
          <h2
            id="hypothesis-heading"
            className="font-mono-label text-smoke"
          >
            Hypothesis
          </h2>
          <div className="mt-6 space-y-6 text-base leading-relaxed text-fog md:text-lg">
            {study.solutions.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="role">
          <h2 id="role" className="font-mono-label text-smoke">
            Role &amp; process
          </h2>
          <ul className="mt-6 list-disc space-y-3 pl-5 text-fog">
            {study.role.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>

        <section className="mt-16" aria-labelledby="outcomes">
          <h2 id="outcomes" className="font-mono-label text-smoke">
            Key outcomes
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {study.outcomes.map((o) => (
              <div
                key={o.label}
                className="border border-graphite bg-carbon/50 p-6"
              >
                <p className="font-display text-3xl text-ink">{o.value}</p>
                <p className="mt-2 font-mono text-xs uppercase tracking-widest text-ash">
                  {o.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="gallery">
          <h2 id="gallery" className="font-mono-label text-smoke">
            Gallery
          </h2>
          <div className="mt-8 columns-1 gap-4 sm:columns-2">
            {study.gallery.map((g, i) => (
              <div
                key={`${g.src}-${i}`}
                className={cn(
                  "relative mb-4 break-inside-avoid overflow-hidden rounded-sm",
                  g.src.endsWith(".gif") ? "bg-canvas" : "bg-carbon",
                )}
              >
                {g.src.endsWith(".gif") ? (
                  // eslint-disable-next-line @next/next/no-img-element -- animated GIF
                  <img
                    src={g.src}
                    alt={g.alt}
                    className="h-auto w-full bg-canvas object-cover"
                  />
                ) : (
                  <Image
                    src={g.src}
                    alt={g.alt}
                    width={800}
                    height={600}
                    className="h-auto w-full object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="mt-20 border-t border-graphite pt-10">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-ink hover:underline"
            data-cursor-hover
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to Work
          </Link>
        </div>
      </div>
    </article>
  );
}
