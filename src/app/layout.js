import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Shell from "@/components/Layout/Shell";
import { LanguageProvider } from '@/context/LanguageContext';

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "askBallot AI | India Election Guide",
  description: "Understand the Indian election process in an interactive way.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${inter.variable}`}>
        <LanguageProvider>
          <Shell>
            {children}
          </Shell>
        </LanguageProvider>
      </body>
    </html>
  );
}
