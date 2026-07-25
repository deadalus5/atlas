import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
  display: "swap",
});

const SITE = "https://deadalus5.github.io/atlas";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Atlas — point at what hurts",
    template: "%s · Atlas",
  },
  description:
    "An interactive anatomical map of the back, neck and hips. Click where it hurts, peel through four layers of muscle, find out what is actually causing it, and get a timed routine that fixes it.",
  applicationName: "Atlas",
  authors: [{ name: "Atlas" }],
  keywords: [
    "back pain",
    "anatomy",
    "stretches",
    "trigger points",
    "referred pain",
    "neck pain",
    "sciatica",
    "mobility",
  ],
  openGraph: {
    type: "website",
    siteName: "Atlas",
    title: "Atlas — point at what hurts",
    description:
      "Click where it hurts. Peel through four layers of anatomy. Find the muscle that is actually causing it, and the routine that fixes it.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atlas — point at what hurts",
    description:
      "An interactive anatomical map of the back, neck and hips, with referred-pain mapping and guided routines.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5efe4" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1214" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Applies the stored theme before first paint so there is no flash. Kept as a
 * raw string because it has to run synchronously, ahead of hydration.
 */
const themeScript = `
(function(){
  try {
    var stored = localStorage.getItem("atlas.theme");
    var isDark = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.add(isDark ? "dark" : "light");
  } catch (e) {
    document.documentElement.classList.add("light");
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-ink">{children}</body>
    </html>
  );
}
