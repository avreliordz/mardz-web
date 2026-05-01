# PRD + Executive Prompt — Portfolio Personal
## Marco Aurelio Rodríguez García · Product & Interaction Developer

---

## 🧭 EXECUTIVE PROMPT (para Cursor)

> Eres un senior full-stack developer y UI engineer. Tu misión es construir un sitio web de portafolio personal, monopágina con routing interno, para **Marco Aurelio Rodríguez García** — Product Developer con background en diseño de interacción y consultoría de producto digital.
>
> El sitio debe tener identidad visual fuerte: **monocromático** (negro profundo / blanco roto / grises), tipografía editorial con carácter, microinteracciones fluidas y scroll storytelling. La experiencia debe sentirse como una **publicación de diseño de alta calidad**, no como un template genérico.
>
> El stack base es **Next.js 14 (App Router) + Tailwind CSS + Framer Motion**. Usa TypeScript. Sigue exactamente la arquitectura, secciones y contenido definidos en este PRD. El código debe ser production-ready, accesible y performante.

---

## 1. Visión del Producto

### 1.1 Objetivo
Sitio web de portafolio profesional que posicione a Marco como un **Product Developer full-stack** capaz de liderar desde la estrategia hasta la implementación — atrayendo clientes de startups, fondos de venture capital y empresas Fortune 500.

### 1.2 Propuesta de valor
- No es solo un portafolio de diseño, es evidencia de pensamiento sistémico end-to-end
- Muestra capacidad de construir: productos digitales accesibles, escalables e innovadores
- Credibilidad a través de clientes reconocibles (Puma, Adidas, News Corp, Globe and Mail)
- Presencia activa en el ecosistema de innovación local (Peak NL, COPARMEX, Web3)

### 1.3 Audiencia objetivo
| Segmento | Pain point que resuelve Marco |
|---|---|
| Startups VC-backed | Necesitan alguien que valide hipótesis Y las construya |
| Innovation studios | Necesitan un lead que mezcle diseño y código |
| Fortune 500 / Staff aug | Necesitan senior con experiencia probada en productos complejos |
| Mentees / comunidad | Referente en diseño de producto en NL/MX |

---

## 2. Stack Técnico

```
Framework:       Next.js 14 (App Router)
Lenguaje:        TypeScript
Estilos:         Tailwind CSS + CSS custom properties
Animaciones:     Framer Motion
Iconos:          Lucide React
Fuentes:         next/font (Google Fonts)
Deploy:          Vercel
SEO:             next/metadata
Analytics:       Vercel Analytics (opcional)
Contact form:    Resend API (o Formspree como fallback)
```

---

## 3. Sistema de Diseño

### 3.1 Paleta (monocromático estricto)
```css
:root {
  --color-black:       #0A0A0A;   /* fondo principal dark */
  --color-ink:         #111111;   /* texto principal */
  --color-carbon:      #1C1C1C;   /* cards, superficies */
  --color-graphite:    #2E2E2E;   /* bordes, separadores */
  --color-ash:         #6B6B6B;   /* texto secundario */
  --color-smoke:       #A8A8A8;   /* labels, captions */
  --color-fog:         #D4D4D4;   /* decorativo */
  --color-paper:       #F5F4F0;   /* fondo secciones light */
  --color-white:       #FAFAFA;   /* texto sobre dark */
  --color-accent:      #FFFFFF;   /* énfasis puro */
}
```

### 3.2 Tipografía
```css
/* Display / Headlines */
--font-display: 'Instrument Serif', serif;        /* editorial, elegante */

/* Body / UI */
--font-body:    'DM Sans', sans-serif;            /* legible, moderno */

/* Monospace / Labels técnicos */
--font-mono:    'JetBrains Mono', monospace;      /* código, numeración */
```

### 3.3 Escala tipográfica
```
hero-title:    clamp(3.5rem, 8vw, 9rem)   — peso 300, italic
section-title: clamp(2rem, 4vw, 4.5rem)   — peso 400
sub-title:     clamp(1.1rem, 2vw, 1.5rem) — peso 400, tracking wide
body:          1rem / line-height 1.6
label:         0.7rem / tracking 0.15em / uppercase / font-mono
```

### 3.4 Motion Tokens
```js
const easing = [0.16, 1, 0.3, 1];   // ease out expo
const duration = { fast: 0.3, base: 0.5, slow: 0.9, crawl: 1.4 };
const stagger = 0.08; // entre items de lista
```

---

## 4. Arquitectura de Páginas

```
/                  → Homepage (single-scroll, todas las secciones)
/work/[slug]       → Case study individual
/about             → Versión expandida del about (opcional v2)
```

---

## 5. Secciones — Especificación Detallada

### §01 · NAV
**Comportamiento:** Sticky transparente → fondo opaco al scroll > 80px. Blur backdrop.

```
Logo:    "MARDZ™"  — font-mono, tracking amplio, tamaño pequeño
Links:   Work  ·  About  ·  Contact
CTA:     [Let's talk →]  — borde blanco, hover fill blanco / texto negro
Mobile:  Hamburger → menu full-screen con animación de cortina
```

**Código reference:**
```tsx
// nav debe usar `useScroll` de framer-motion para opacity/blur transition
// links con `motion.a` y underline animado en hover
```

---

### §02 · HERO
**Inspiración:** Palmer Template — split tipográfico, número de sección, rotación de roles.

**Layout:**
```
[TOP BAR]  ← "Based in Monterrey, MX"  |  "Product Developer + Interaction Designer" →

[HERO COPY]  ← ocupa 80vh
  Línea 1 (display): "End-to-End"
  Línea 2 (display italic): "Product"
  Línea 3 (display): "Developer."
  
  [Col derecha alineada al bottom]
    Pequeño bloque:
    — 10+ años de experiencia
    — Startups → Fortune 500
    — Design × Code
    [Scroll to explore ↓]

[BOTTOM BAR]  Logos clientes: Puma · Adidas · News Corp · Globe and Mail · Wizeline
              (marquee loop continuo, velocidad lenta)
```

**Animaciones:**
- Cada línea del título entra con `clipPath: "inset(100% 0 0 0)"` → `"inset(0% 0 0 0)"` con stagger
- El bloque lateral hace fade-in delay 0.8s
- Marquee de clientes: CSS scroll horizontal infinito

---

### §03 · ABOUT / STATEMENT
**Inspiración:** Effica — sección "What we believe", texto editorial + dato estadístico lateral.

**Layout:** Full-width, fondo `--color-paper` (único acento claro en el sitio).

```
[Número sección]  "§ 02"  — font-mono

[Headline]  "I don't just design it.
             I build it."

[Body — 2 columnas]
Col 1:
  Mi trayectoria comenzó en digital arts y evolucionó hacia
  soluciones escalables. He colaborado con startups VC-backed
  y Fortune 500 como Puma, Adidas y News Corp, siempre
  buscando construir puentes entre diseño e ingeniería.

Col 2 (stats verticales):
  "10+"   años de experiencia
  "2"     continentes de clientes
  "∞"     hipótesis validadas

[Bottom]  Badge: "Product Design Lead @ Wizeline 2019–2025"
```

---

### §04 · FEATURED WORK
**Inspiración:** Palmer — hover con imagen dual (B&W → color no aplica aquí, adaptar a reveal de descripción).

**Lista de proyectos (poblar con contenido del gitbook cuando esté disponible):**

```
(01)  Interact Studio — Venture Building         [2025–2026]  tag: Strategy + Dev
(02)  Wizeline × [Cliente Fortune 500]           [2022–2025]  tag: Product Design Lead
(03)  Butchershop MX — Design Thinking Projects  [2017–2019]  tag: UX/UI
(04)  Proyecto personal / side project           [TBD]        tag: Full Stack
```

**Componente `<ProjectRow />`:**
```tsx
// Cada fila: número · título · año · tags · flecha
// Hover: fondo --color-carbon, slide-in descripción desde la derecha
// Click: navega a /work/[slug]
// Separador: línea 1px --color-graphite con scaleX animado al scroll
```

---

### §05 · CAPABILITIES (Servicios)
**Inspiración:** Palmer — lista enumerada con descripción expandible.

**6 capacidades:**
```
01  Product Strategy & Validation
    Investigación, hipótesis, discovery sprints y go-to-market para startups.

02  End-to-End Product Design
    UX research → wireframes → UI systems → prototipos interactivos.

03  Design Systems
    Componentes reutilizables, tokens de diseño y documentación técnica.

04  Frontend Development
    React, Next.js, Tailwind — interfaces accesibles y performantes.

05  Team Leadership & Mentorship
    Staff augmentation, onboarding y cultura de diseño en equipos técnicos.

06  AI-Assisted Workflows
    Automatización de procesos creativos y flujos de trabajo con IA aplicada.
```

**Componente:** Accordion con Framer Motion `AnimatePresence`.

---

### §06 · EXPERIENCE TIMELINE
**Layout:** Horizontal en desktop, vertical en mobile.

```
2013–2015  Freelance Web Dev       → CMS, e-commerce, small business
2017–2019  Butchershop MX          → UX/UI, Design Thinking
2019–2022  Wizeline Sr. Designer   → Fortune 500 + startups
2022–2025  Wizeline Design Lead    → Staff aug + equipo
2025–Now   Interact Studio         → Venture building, hypothesis validation
```

**Animación:** Línea de tiempo que se "dibuja" con scroll usando `pathLength` de Framer Motion.

---

### §07 · SPEAKING & COMMUNITY
**Contenido del CV:**
```
2025  Business Nights Peak NL       — GameTech Edition · Panelista
2025  Innovation Nights @COPARMEX   — AI-Assisted Automation · Speaker
2024  Web3 Gaming Nights CDMX       — Play to Earn + GameFi · Speaker
2023  Wizeline Academy              — Use Case Review · Panelista
2022  Wizeline Academy              — Design Systems 101 · Speaker
```

**Componente:** Grid de tarjetas minimalistas con año prominente en font-mono.

---

### §08 · CONTACT CTA
**Inspiración:** Effica footer CTA — "Ready to start?" con formulario inline.

```
[Headline grande]
  "Let's build
   something real."

[Sub]  Available for consulting, product leadership & venture collaboration.
       Monterrey, NL — Remote friendly.

[Formulario]
  Name  /  Email  /  Message  →  [Send →]

[Links directos]
  avrelio.rdz@gmail.com
  +52 811 513 3603
  linkedin.com/in/marco-aurelio-rodriguez-garcia-mx
  dribbble.com/avreliordz
  marcoaurelio.mx
```

---

### §09 · FOOTER
```
[LEFT]   MARDZ™ © 2025  —  Monterrey, MX
[CENTER] Nav links: Work · About · Contact
[RIGHT]  "Designed & built by Marco A. Rodríguez"
         [↑ Back to top]
```

---

## 6. Componentes Clave

### `<MagneticButton />`
Botón CTA que sigue el cursor en un radio de 40px. Usar `useMotionValue` + `useSpring`.

### `<ScrollReveal />`
Wrapper genérico que aplica `opacity: 0 → 1` + `y: 30 → 0` al entrar al viewport. Usar `useInView` de Framer Motion.

### `<ProjectRow />`
Fila de proyecto con hover state elaborado (ver §04).

### `<TextReveal />`
Animación de texto línea a línea con `clipPath` (ver §02 hero).

### `<Marquee />`
Logos de clientes en scroll horizontal infinito. CSS puro con `@keyframes marquee`.

### `<CustomCursor />`
Cursor custom: círculo pequeño que se agranda en hover sobre links/botones. Blanco sobre dark, negro sobre light.

---

## 7. Estructura de Archivos

```
src/
├── app/
│   ├── layout.tsx          ← fonts, metadata, providers
│   ├── page.tsx            ← homepage (importa todas las secciones)
│   └── work/
│       └── [slug]/
│           └── page.tsx
├── components/
│   ├── layout/
│   │   ├── Nav.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Work.tsx
│   │   ├── Capabilities.tsx
│   │   ├── Experience.tsx
│   │   ├── Speaking.tsx
│   │   └── Contact.tsx
│   └── ui/
│       ├── MagneticButton.tsx
│       ├── ScrollReveal.tsx
│       ├── TextReveal.tsx
│       ├── ProjectRow.tsx
│       ├── Marquee.tsx
│       └── CustomCursor.tsx
├── data/
│   ├── projects.ts         ← array de proyectos con slug, meta, content
│   ├── capabilities.ts
│   └── speaking.ts
├── lib/
│   └── utils.ts
└── styles/
    └── globals.css         ← CSS variables + reset + utilidades custom
```

---

## 8. SEO & Metadata

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: "Marco Aurelio Rodríguez — Product Developer",
  description:
    "Product & Interaction Developer based in Monterrey, MX. End-to-end digital product design and development for startups and Fortune 500 companies.",
  openGraph: {
    type: "website",
    url: "https://marcoaurelio.mx",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};
```

---

## 9. Performance & Accesibilidad

- Todas las imágenes con `next/image` + `priority` en hero
- Fuentes con `display: swap` via `next/font`
- Reducir motion si `prefers-reduced-motion` activo:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; }
  }
  ```
- Todos los botones/links con `aria-label` descriptivo
- Contraste mínimo AA en toda la paleta
- `focus-visible` styles definidos en `globals.css`

---

## 10. Rutas de Caso de Estudio `/work/[slug]`

Estructura de cada case study:

```
[Hero: título proyecto + año + tags + imagen hero]
[Challenge — 2 párrafos]
[Role & Process — lista de responsabilidades]
[Key Outcomes — 3 métricas o insights]
[Imágenes / mockups — grid masonry]
[← Back to Work]
```

**Slugs iniciales:**
- `interact-studio`
- `wizeline-product-lead`
- `butchershop-mx`

---

## 11. Checklist de Entrega

- [ ] Paleta monocromática aplicada consistentemente
- [ ] Hero con animación TextReveal funcionando
- [ ] Marquee de clientes en loop
- [ ] ProjectRow con hover state elaborado
- [ ] Timeline animada con scroll
- [ ] Formulario de contacto con validación básica
- [ ] Responsive: mobile, tablet, desktop (≥1440px)
- [ ] CustomCursor funcionando en desktop
- [ ] `prefers-reduced-motion` respetado
- [ ] Metadata SEO completa
- [ ] Lighthouse score ≥ 90 en Performance, A11y y SEO
- [ ] Deploy en Vercel conectado a marcoaurelio.mx

---

## 12. Notas de Contenido

> **GitBook (`avrelio-rodriguez.gitbook.io`):** Contiene los case studies detallados con imágenes y proceso. Extraer y adaptar como contenido de las rutas `/work/[slug]`. Marco debe proveer acceso o exportación del contenido.

> **LinkedIn:** Complementa con endorsements, publicaciones y proyectos adicionales que no están en el CV.

> **Dribbble (`dribbble.com/avreliordz`):** Usar como fuente de imágenes de proyectos para la sección Work y case studies.

---

*Versión 1.0 — Generado el 19 de marzo de 2026*
*Preparado para desarrollo en Cursor + Claude Sonnet*
