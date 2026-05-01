# MARDZ — Portfolio web

Sitio de portafolio personal (Next.js 14, App Router, TypeScript, Tailwind CSS, Framer Motion), según el PRD del repositorio. Dominio previsto: [marcoaurelio.mx](https://marcoaurelio.mx).

## Requisitos

- Node.js 18+
- npm (o pnpm/yarn)

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Si el sitio se ve sin estilos y en consola hay 404 en `/_next/static/...`

Suele ser caché o carpeta `.next` inconsistente (por ejemplo proyectos en `Desktop` con iCloud). Para el servidor (`Ctrl+C`) y ejecuta:

```bash
npm run dev:clean
```

Eso borra `.next` y arranca de nuevo. Opcional: recarga forzada en el navegador (vacía caché).

## Variables de entorno (contacto por correo)

El formulario usa la API `/api/contact` con [Resend](https://resend.com).

1. Copia `.env.example` a `.env.local`.
2. Configura:

- `RESEND_API_KEY` — API key de Resend.
- `CONTACT_TO_EMAIL` — correo donde recibes los mensajes.
- `CONTACT_FROM` — remitente verificado en Resend (p. ej. `Portfolio <onboarding@resend.dev>` en pruebas).

Sin estas variables, la API responde 503 y el cliente muestra un mensaje para configurar el servicio o usar el fallback.

### Fallback sin backend: Formspree

1. Crea un formulario en [Formspree](https://formspree.io).
2. Opción A: en `src/components/sections/Contact.tsx`, sustituye el `fetch` por un `action` apuntando a la URL del formulario.
3. Opción B: enlaza un botón “Contactar” a esa URL desde el CTA.

## Despliegue en Vercel vía GitHub

1. Sube el código a un repositorio en GitHub (si aún no existe):

   ```bash
   git add .
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```

2. En [Vercel](https://vercel.com): **Add New Project** → Import el repo de GitHub.
3. Framework: Next.js (detectado automáticamente). Variables de entorno: añade `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM` en **Settings → Environment Variables** (Production / Preview según necesites).
4. **Dominio personalizado**: en el proyecto → **Settings → Domains** → añade `marcoaurelio.mx` y los registros DNS que indique tu proveedor (A/AAAA o CNAME hacia Vercel).

## Scripts

| Comando        | Descripción              |
| -------------- | ------------------------ |
| `npm run dev`  | Servidor de desarrollo   |
| `npm run build` | Build de producción    |
| `npm run start` | Servidor tras `build`  |
| `npm run lint`  | ESLint                   |

## Estructura principal

- `src/app/` — rutas (`/`, `/work/[slug]`, `/api/contact`, `sitemap.ts`).
- `src/components/` — layout, secciones y UI.
- `src/data/` — proyectos, capacidades, speaking.
- `src/styles/globals.css` — tokens de diseño (paleta monocromática, tipografía).
- `public/og-image.jpg` — imagen Open Graph (sustituible).

## Documentación

Especificación de producto: [PORTFOLIO-PRD.md](./PORTFOLIO-PRD.md).
