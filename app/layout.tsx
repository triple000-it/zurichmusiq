import type React from "react"
import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Instrument_Serif } from "next/font/google"
import "./globals.css"

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Zurich Musiq - Professional Music Recording Studio",
    template: "%s | Zurich Musiq"
  },
  description: "Professional music recording studio in Zurich offering recording, mixing, mastering, and music production services. State-of-the-art equipment and acoustically treated rooms for artists, bands, and music professionals.",
  keywords: ["music recording studio", "recording studio Zurich", "music production", "mixing mastering", "professional recording", "audio engineering", "music studio", "recording services", "artist development", "studio booking"],
  authors: [{ name: "Zurich Musiq", url: "https://zurichmusiq.com" }],
  creator: "Zurich Musiq",
  publisher: "Zurich Musiq",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://zurichmusiq.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Zurich Musiq - Professional Music Recording Studio",
    description: "Professional music recording studio offering recording, mixing, mastering, and music production services. State-of-the-art equipment and acoustically treated rooms.",
    url: "https://zurichmusiq.com",
    siteName: "Zurich Musiq",
    images: [
      {
        url: "/LOGO-ZURICHMUSIQ-WIT.png",
        width: 1200,
        height: 630,
        alt: "Zurich Musiq - Professional Music Recording Studio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zurich Musiq - Professional Music Recording Studio",
    description: "Professional music recording studio offering recording, mixing, mastering, and music production services.",
    creator: "@zurichmusiq",
    images: ["/LOGO-ZURICHMUSIQ-WIT.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "music",
  classification: "Business",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4fdce5" />
        <meta name="application-name" content="Zurich Musiq" />
        <meta name="apple-mobile-web-app-title" content="Zurich Musiq" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/favicon-zurich.png" />
        <link rel="apple-touch-icon" href="/LOGO-ZURICHMUSIQ-WIT.png" />
        <style>{`
html {
  font-family: ${figtree.style.fontFamily};
  --font-sans: ${figtree.variable};
  --font-mono: ${GeistMono.variable};
  --font-instrument-serif: ${instrumentSerif.variable};
}
        `}</style>
      </head>
      <body className={`${figtree.variable} ${instrumentSerif.variable}`}>{children}</body>
    </html>
  )
}
