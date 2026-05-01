"use client";

import { useState, FormEvent } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Loader2 } from "lucide-react";

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
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const body = String(data.get("message") ?? "").trim();
    if (!name || !email || !body) {
      setStatus("error");
      setMessage("Please fill in name, email, and message.");
      return;
    }
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message: body }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Failed to send");
      setStatus("ok");
      setMessage("Thanks — I&apos;ll get back to you soon.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage(
        "Could not send. Configure Resend on Vercel or use the Formspree option in the README.",
      );
    }
  }

  return (
    <section
      id="contact"
      className="bg-black px-5 py-24 md:px-8"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-[1400px]">
        <ScrollReveal>
          <p className="font-mono-label text-smoke">§ 07</p>
          <h2
            id="contact-heading"
            className="section-title mt-6 max-w-3xl text-paper"
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

        <div className="mt-16 grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <ScrollReveal delay={0.05}>
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-6"
              noValidate
            >
              <div>
                <label htmlFor="name" className="font-mono-label text-smoke">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className="mt-2 w-full border-b border-graphite bg-transparent py-2 text-paper outline-none transition-colors focus:border-paper"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="font-mono-label text-smoke">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="mt-2 w-full border-b border-graphite bg-transparent py-2 text-paper outline-none transition-colors focus:border-paper"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="font-mono-label text-smoke">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="mt-2 w-full resize-y border-b border-graphite bg-transparent py-2 text-paper outline-none transition-colors focus:border-paper"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex w-max items-center gap-2 rounded-full border border-paper px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper transition-colors hover:bg-paper hover:text-black disabled:opacity-50"
                data-cursor-hover
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Sending…
                  </>
                ) : (
                  <>Send →</>
                )}
              </button>
              {message && (
                <p
                  role="status"
                  className={
                    status === "ok" ? "text-sm text-fog" : "text-sm text-ash"
                  }
                >
                  {message}
                </p>
              )}
            </form>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
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
                      className="text-sm text-fog underline-offset-4 transition-colors hover:text-paper hover:underline"
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
      </div>
    </section>
  );
}
