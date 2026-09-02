import type { Metadata } from "next";
import "./globals.css";
export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Sekele | Wedding Photography Bangladesh",
  description:
    "Candid wedding photography in Bangladesh. We capture genuine emotions and timeless moments.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <main>{children}</main>
      </body>
    </html>
  );
}