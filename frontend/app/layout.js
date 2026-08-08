import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Loan Eligibility & Lead Management",
  description: "Loan Eligibility & Lead Management Module",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`h-full ${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-full flex flex-col bg-[var(--color-app-bg)] text-[var(--color-body)] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
