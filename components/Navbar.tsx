"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCallSharp } from "react-icons/io5";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Albums", href: "/albums" },
  { name: "Packages", href: "/packages" },
  { name: "FAQ", href: "/faq" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Client-only auth check — does NOT force layout to dynamic
  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((r) => {
        if (!cancelled) setIsAdmin(r.ok);
      })
      .catch(() => {
        if (!cancelled) setIsAdmin(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function logout() {
    setMenuOpen(false);
    setIsOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    setIsAdmin(false);
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <header className="sticky top-0 right-0 left-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-18 items-center justify-between md:h-22">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-white-01.png"
                alt="Sekele"
                width={340}
                height={180}
                className="h-18 w-auto object-contain md:h-32"
                priority
              />
            </Link>

            <nav className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative text-[16px] font-medium transition-colors ${
                      isActive
                        ? "text-rose-500"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    {link.name}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-rose-600 transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Desktop right */}
            <div className="hidden items-center gap-3 md:flex">
              {!isAdmin && (
                <Link
                  href="/booking"
                  className="flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-700"
                >
                  <IoCallSharp size={16} />
                  Book Now
                </Link>
              )}

              {isAdmin && (
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((o) => !o)}
                    className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-1.5 pr-3.5 pl-1.5 transition hover:border-rose-500/40 hover:bg-rose-600/10"
                    aria-label="Admin menu"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white">
                      <User size={16} />
                    </span>
                    <span className="text-sm font-medium text-white/90">
                      Admin
                    </span>
                  </button>

                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg border border-white/10 bg-neutral-950 shadow-xl shadow-black/40"
                      >
                        <div className="border-b border-white/10 px-3.5 py-2.5">
                          <p className="text-xs text-white/40">Signed in as</p>
                          <p className="text-sm font-medium text-white">Admin</p>
                        </div>
                        <Link
                          href="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
                        >
                          <LayoutDashboard size={15} />
                          Dashboard
                        </Link>
                        <button
                          type="button"
                          onClick={logout}
                          className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
                        >
                          <LogOut size={15} />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white md:hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-black pt-24 pb-10 md:hidden"
          >
            <nav className="flex flex-col items-center gap-6 px-6">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`text-2xl font-medium transition-colors ${
                      isActive
                        ? "text-rose-500"
                        : "text-white/90 hover:text-rose-500"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {!isAdmin && (
                <Link
                  href="/booking"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 flex items-center gap-2 rounded-full bg-rose-600 px-8 py-3 font-medium text-white hover:bg-rose-700"
                >
                  <IoCallSharp size={16} />
                  Book Now
                </Link>
              )}

              {isAdmin && (
                <div className="relative mt-4 w-full max-w-[220px]" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((o) => !o)}
                    className="mx-auto flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-2 pr-4 pl-2 transition hover:border-rose-500/40 hover:bg-rose-600/10"
                    aria-label="Admin menu"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-600 text-white">
                      <User size={16} />
                    </span>
                    <span className="text-sm font-medium text-white/90">
                      Admin
                    </span>
                  </button>

                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-neutral-950 shadow-xl shadow-black/40"
                      >
                        <div className="border-b border-white/10 px-4 py-3">
                          <p className="text-xs text-white/40">Signed in as</p>
                          <p className="text-sm font-medium text-white">Admin</p>
                        </div>
                        <Link
                          href="/admin"
                          onClick={() => {
                            setMenuOpen(false);
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-2.5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
                        >
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Link>
                        <button
                          type="button"
                          onClick={logout}
                          className="flex w-full items-center gap-2.5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}