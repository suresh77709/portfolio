"use client";

import { useEffect, useState } from "react";
import { PortfolioData } from "@/data/portfolio";
import { SocialLinkItem } from "@/data/socials";

import { ArrowUp, ArrowUpRight, Mail, Globe } from "lucide-react";

interface FooterProps {
  data: PortfolioData["personal"];
  socialLinks?: SocialLinkItem[];
}

function renderSocialIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes("instagram")) {
    return (
      <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    );
  }
  if (p.includes("youtube")) {
    return (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  if (p.includes("linkedin")) {
    return (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 1 0 0-3.3 1.65 1.65 0 0 0 0 3.3m1.4 9.74v-8.37H5.06v8.37h2.8z" />
      </svg>
    );
  }
  if (p.includes("github")) {
    return (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
      </svg>
    );
  }
  if (p.includes("twitter") || p === "x") {
    return (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (p.includes("email") || p.includes("mail")) return <Mail className="w-3.5 h-3.5" />;
  if (p.includes("behance")) {
    return (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-4.726 3-3.14 0-5.5-2.269-5.5-5.5 0-3.177 2.378-5.5 5.5-5.5 3.336 0 5.234 2.456 4.975 5.75h-7.975c.094 1.488 1.157 2.5 2.65 2.5 1.258 0 2.062-.578 2.434-1.25h2.642zm-7.426-4h5.21c-.083-1.252-.892-2-2.31-2-1.393 0-2.32.748-2.9 2zm-8.8 7h-7.5v-16h7.75c3.212 0 5.25 1.838 5.25 4.5 0 1.637-.812 3.018-2.219 3.738 1.875.762 2.719 2.428 2.719 4.387 0 3.125-2.25 4.375-6 4.375zm-4.5-9.5h3.25c1.472 0 2.25-.662 2.25-1.75 0-1.125-.843-1.75-2.25-1.75h-3.25v3.5zm0 6.5h3.5c1.625 0 2.5-.788 2.5-2.125 0-1.288-.938-2.125-2.5-2.125h-3.5v4.25z" />
      </svg>
    );
  }
  return <Globe className="w-3.5 h-3.5" />;
}


export function Footer({ data, socialLinks }: FooterProps) {
  const [localTime, setLocalTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const formatter = new Intl.DateTimeFormat([], options);
      setLocalTime(formatter.format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Determine active social links from either DB state or fallback to data.socials
  const activeSocials = socialLinks
    ? socialLinks.filter((s) => s.enabled)
    : data.socials.map((s, idx) => ({
        id: s.platform.toLowerCase(),
        platform: s.platform,
        url: s.url,
        handle: s.handle,
        enabled: true,
        order: idx + 1,
      }));

  return (
    <footer className="w-full bg-[#080809] border-t border-white/10 py-16 px-6 sm:px-12 relative overflow-hidden text-[#A8A8A3] font-footer">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Top Footer Tier */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 pb-12 border-b border-white/5">
          <div>
            <span className="text-xs font-mono text-[#6F6F6B] tracking-widest block mb-2 uppercase font-label">
              CREATIVE PORTFOLIO
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-[#F5F5F2] tracking-wide uppercase font-section-heading">
              {data.name}
            </h3>
            <p className="text-xs font-mono text-[#A8A8A3] mt-1 font-body-text">
              {data.title} — {data.location}
            </p>
          </div>

          {/* Clean, Minimal Social Links - Primary & Only Location */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-label">
            {activeSocials.map((social) => (
              <a
                key={social.id || social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-full border border-white/10 hover:border-white/25 bg-white/[0.02] hover:bg-white/10 text-xs font-mono text-[#A8A8A3] hover:text-[#F5F5F2] transition-all duration-300 flex items-center gap-2 group"
                data-cursor="OPEN →"
              >
                <span className="text-[#6F6F6B] group-hover:text-white transition-colors">
                  {renderSocialIcon(social.platform)}
                </span>
                <span>{social.platform}</span>
                <ArrowUpRight className="w-3 h-3 text-[#6F6F6B] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Footer Tier */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-xs font-mono text-[#6F6F6B]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>TIME {localTime && `[${localTime} IST]`}</span>
            </span>
          </div>

          <div>
            © {new Date().getFullYear()} {data.name}. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-3 font-btn">
            <button
              onClick={scrollToTop}
              className="glass-button px-4 py-2 rounded-full text-[11px] flex items-center gap-2 text-[#A8A8A3] hover:text-[#F5F5F2]"
              data-cursor="OPEN →"
              aria-label="Back to top"
            >
              <span>TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
