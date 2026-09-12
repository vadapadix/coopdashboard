"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Users, Calendar, BookOpen, Bell, Radio } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Головна", icon: Calendar },
    { href: "/groups/it-31", label: "Журнал (IT-31)", icon: Users },
    { href: "/classroom", label: "Google Classroom", icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#282D42] bg-[#141724]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & College Badge */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-lg text-white tracking-tight">myCOOP</span>
                <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  РКЕПФК
                </span>
                <p className="text-[11px] text-slate-400">Панель викладача</p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Teacher Profile & Live Indicator */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>Синхронізація активна</span>
            </div>

            <div className="flex items-center space-x-3 pl-2 border-l border-slate-700/60">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600 flex items-center justify-center font-bold text-sm text-white">
                МО
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-white leading-tight">Мопан О. Д.</p>
                <p className="text-[11px] text-slate-400">викладач спецдисциплін</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
