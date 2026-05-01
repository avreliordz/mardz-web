import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/Providers";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://marcoaurelio.mx"),
  title: "Marco Aurelio Rodríguez — Product Developer",
  description:
    "Product & Interaction Developer based in Monterrey, MX. End-to-end digital product design and development for startups and Fortune 500 companies.",
  openGraph: {
    type: "website",
    url: "https://marcoaurelio.mx",
    siteName: "Marco Aurelio Rodríguez",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Marco Aurelio Rodríguez" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marco Aurelio Rodríguez — Product Developer",
    description:
      "Product & Interaction Developer based in Monterrey, MX. End-to-end digital product design and development.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceMono.variable} font-body antialiased`}
      >
        <Providers>
          <Nav />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
