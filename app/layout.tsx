import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "myCOOP • Дашборд Викладача | РКЕПФК",
  description: "Панель управління відвідуваністю та завданнями Google Classroom для викладачів Рівненського фахового коледжу",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="dark">
      <body className="min-h-screen bg-[#0F111A] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
