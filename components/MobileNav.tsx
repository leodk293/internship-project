"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { LoginButton } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";

type NavLink = { href: string; label: string };

interface MobileNavProps {
  navLinks: NavLink[];
  isAuthenticated: boolean;
  userName: string;
  avatarUrl?: string;
}

export default function MobileNav({
  navLinks,
  isAuthenticated,
  userName,
  avatarUrl,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="lg:hidden">
      {/* Hamburger / close button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="
          relative flex items-center justify-center
          h-9 w-9 rounded-md
          text-gray-700 dark:text-gray-200
          hover:bg-gray-100 dark:hover:bg-white/5
          transition-colors
        "
      >
        <span className="sr-only">Toggle menu</span>
        <div className="relative h-4 w-5">
          <span
            className={`absolute left-0 top-0 h-0.5 w-5 bg-current rounded-full transition-all duration-200 ${
              open ? "top-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-[7px] h-0.5 w-5 bg-current rounded-full transition-opacity duration-150 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 top-[14px] h-0.5 w-5 bg-current rounded-full transition-all duration-200 ${
              open ? "top-[7px] -rotate-45" : ""
            }`}
          />
        </div>
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`
          fixed inset-0 z-40 bg-black/40 backdrop-blur-sm
          transition-opacity duration-200 lg:hidden
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Slide-down panel */}
      <div
        className={`
          fixed left-0 right-0 top-16 z-40
          lg:hidden
          bg-white dark:bg-[#0b0f1a]
          border-b border-gray-200 dark:border-white/10
          shadow-xl
          transition-all duration-200 ease-out origin-top
          ${open ? "opacity-100 scale-y-100" : "opacity-0 scale-y-95 pointer-events-none"}
        `}
      >
        <nav className="flex flex-col px-4 py-3 gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="
                px-3 py-2.5 rounded-md
                text-base font-medium
                text-gray-700 dark:text-gray-200
                hover:bg-gray-100 dark:hover:bg-white/5
                transition-colors
              "
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-200 dark:border-white/10 px-4 py-3">
          {isAuthenticated ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={userName}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover ring-1 ring-black/5 dark:ring-white/10 flex-shrink-0"
                  />
                ) : (
                  <div
                    className="
                      h-8 w-8 rounded-full flex-shrink-0
                      bg-violet-100 dark:bg-violet-500/20
                      text-violet-700 dark:text-violet-300
                      flex items-center justify-center
                      text-xs font-semibold
                    "
                  >
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
                <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">
                  {userName}
                </p>
              </div>
              <LogoutButton />
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </div>
  );
}