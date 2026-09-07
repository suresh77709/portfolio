"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PortfolioData } from "@/data/portfolio";
import { ArrowUpRight, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "WORK", href: "#work", id: "work" },
  { label: "SERVICES", href: "#skills", id: "skills" },
  { label: "ABOUT", href: "#about", id: "about" },
  { label: "EXPERIMENTS", href: "#experiments", id: "experiments" },
  { label: "CONTACT", href: "#contact", id: "contact" },
];

interface NavbarProps {
  data: PortfolioData["personal"];
}

export function Navbar({ data }: NavbarProps) {
  const [activeSection, setActiveSection] = useState<string>("work");
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = NAV_LINKS.map((link) => link.id);
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i]);
        if (sectionEl) {
          const top = sectionEl.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setMobileOpen(false);
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4 px-4 sm:px-8 flex justify-center items-center pointer-events-none`}
      >
        <nav
          aria-label="Main Navigation"
          className={`pointer-events-auto w-full max-w-5xl rounded-full transition-all duration-500 flex items-center justify-between px-5 sm:px-6 py-2.5 ${
            scrolled
              ? "glass-capsule shadow-2xl backdrop-blur-xl border border-white/10"
              : "glass-capsule border border-white/5"
          }`}
        >
          {/* Logo / Designer Identity */}
          <Link
            href="/"
            className="flex items-center gap-2.5 text-xs tracking-widest font-semibold text-[#F5F5F2] hover:opacity-80 transition-opacity"
            data-cursor="OPEN →"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono">{data.name}</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2 font-nav">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`relative px-4 py-1.5 text-[11px] font-mono tracking-widest transition-all duration-300 rounded-full ${
                    isActive
                      ? "text-[#F5F5F2] font-bold"
                      : "text-[#A8A8A3] hover:text-[#F5F5F2]"
                  }`}
                  data-cursor="OPEN →"
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md border border-white/15 transition-all duration-300" />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              );
            })}
          </div>

          {/* Contact Action */}
          <div className="hidden lg:flex items-center gap-2 font-btn">
            <a
              href={`mailto:${data.email}`}
              className="text-[10px] font-mono tracking-widest px-3 py-1 rounded-full border border-white/15 bg-white/5 text-[#A8A8A3] hover:text-[#F5F5F2] hover:bg-white/10 transition-all duration-300 flex items-center gap-1"
              data-cursor="OPEN →"
            >
              <span>HIRE SURESH</span>
              <ArrowUpRight className="w-3 h-3 text-emerald-400" />
            </a>
          </div>


          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            className="md:hidden p-2 text-[#F5F5F2] hover:text-white transition-colors focus:outline-none"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#0B0B0C]/95 backdrop-blur-2xl md:hidden flex flex-col justify-center items-center px-6 py-12 animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-8 w-full max-w-sm">
            <span className="text-[10px] font-mono tracking-widest text-[#6F6F6B]">
              NAVIGATION
            </span>

            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-2xl font-serif tracking-wider text-[#F5F5F2] hover:text-white transition-colors py-2 border-b border-white/10 w-full text-center uppercase"
              >
                {link.label}
              </a>
            ))}

            <div className="mt-6 flex flex-col items-center gap-3">
              <span className="text-xs font-mono text-[#A8A8A3]">
                {data.availability}
              </span>
              <a
                href={`mailto:${data.email}`}
                className="px-6 py-2.5 rounded-full glass-button text-xs font-mono tracking-wider flex items-center gap-2"
              >
                <span>EMAIL SURESH</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
