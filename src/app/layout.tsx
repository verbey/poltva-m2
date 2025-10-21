import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Poltva-M2",
  description: "The next thing in the space of Matrix messaging.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"antialiased"}>{children}</body>
    </html>
  );
}
