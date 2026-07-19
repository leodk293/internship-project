import React from "react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import MobileNav from "./MobileNav";
import Link from "next/link";
import AuthUserPanel from "./AuthUserPanel";
import { createClient } from "@/utils/supabase/server";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const NAV_LINKS = [
    { href: "#about", label: "À propos" },
    { href: "#contact", label: "Contact" },
    { href: `/${session?.user?.id}/dashboard`, label: "Dashboard" },
  ];
  return (
    <header
      className="
        fixed inset-x-0 top-0 z-50
        border-b border-gray-200 dark:border-white/10
        bg-white/80 dark:bg-[#0b0f1a]
        backdrop-blur-md backdrop-saturate-150
        supports-[backdrop-filter]:bg-white/60
      "
    >
      <div
        className="
          mx-auto max-w-7xl
          flex items-center justify-between
          gap-3 sm:gap-6
          px-4 sm:px-6 lg:px-8
          h-16
        "
      >
        {/* Logo */}
        <div className="flex-shrink-0">
          <Logo size="text-3xl" />
        </div>

        {/* Desktop nav — hidden below lg */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="
                relative px-3 py-2 rounded-md
                text-sm font-medium
                text-gray-600 dark:text-gray-300
                hover:text-gray-900 dark:hover:text-white
                hover:bg-gray-100 dark:hover:bg-white/5
                transition-colors duration-150
              "
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right-side cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Auth + theme — hidden on small screens, shown from md up */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3">
            <AuthUserPanel />

            <div className="h-6 w-px bg-gray-200 dark:bg-white/10 mx-1" />

            <ThemeToggle />
          </div>

          {/* Mobile: theme toggle always visible + hamburger */}
          <div className="flex md:hidden items-center gap-1">
            <ThemeToggle />
          </div>

          <MobileNav
            navLinks={NAV_LINKS}
            isAuthenticated={false}
            userName="User"
            avatarUrl={undefined}
          />
        </div>
      </div>
    </header>
  );
}
