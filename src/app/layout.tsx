import type { Metadata, Viewport } from "next";
import { Crimson_Pro, Atkinson_Hyperlegible } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const bodyFont = Atkinson_Hyperlegible({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const headingFont = Crimson_Pro({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "UPC Líderes",
    template: "%s · UPC Líderes",
  },
  description:
    "Registro y directorio de líderes estudiantiles por facultad y carrera.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1e3a5f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${bodyFont.variable} ${headingFont.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
