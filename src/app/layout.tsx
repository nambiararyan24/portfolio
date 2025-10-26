import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import RecaptchaProvider from "@/components/RecaptchaProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Portfolio - Freelance Web Developer",
  description: "Professional freelance web developer creating modern, responsive websites and web applications. Let's work together to bring your ideas to life.",
  keywords: ["web developer", "freelance", "portfolio", "web design", "react", "next.js"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Portfolio - Freelance Web Developer",
    description: "Professional freelance web developer creating modern, responsive websites and web applications.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans antialiased">
        <RecaptchaProvider>
          {children}
        </RecaptchaProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--background)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
            },
          }}
        />
      </body>
    </html>
  );
}
