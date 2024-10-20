import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Photoshop Me In! Free AI-Powered Photo Editor: Easily Place Yourself or Objects into Any Scene",
  description: "Looking for a quick, easy, and free way to edit photos? Our AI-powered photo editor allows you to effortlessly\
 crop yourself or any object from one image and place it into a new background or scene. No technical skills required! Simply upload\
  your photo, let our advanced AI do the work, and download your professionally edited image in seconds. Whether you're creating fun,\
   personalized images or professional-grade edits, our tool makes it simple and free to achieve flawless results. Perfect for personal\
    projects, social media, or marketing campaigns. Try it now!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2674906382932946" crossOrigin="anonymous"></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
