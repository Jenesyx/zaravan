import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { MotionProvider } from "@/components/ui/motion-provider";
import "./globals.css";
import "./home.css";

// Replace these next/font/google faces with licensed PP Editorial New,
// PP Neue Montreal, and Söhne Mono via next/font/local when supplied.
const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const ui = Inter({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zaravan",
  description: "Single-origin saffron from Khorasan.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${ui.variable} ${mono.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
