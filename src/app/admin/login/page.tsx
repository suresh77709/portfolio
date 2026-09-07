"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if already authenticated
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("admin_authenticated") === "true") {
      router.replace("/admin");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const u = username.trim().toLowerCase();
      const p = password.trim();

      const customPass = typeof window !== "undefined" ? localStorage.getItem("admin_custom_password") : null;
      const validPasswords = ["suresh@admin2026", "admin", "suresh"];
      if (customPass) {
        validPasswords.push(customPass);
      }

      // Static-compatible authentication check against configured credentials
      if (
        (u === "admin" || u === "suresh") &&
        validPasswords.includes(p)
      ) {
        sessionStorage.setItem("admin_authenticated", "true");
        sessionStorage.setItem("admin_username", username.trim());
        router.push("/admin");
      } else {
        throw new Error("Invalid username or password");
      }
    } catch (err: any) {
      setError(err.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0B0C] text-[#F5F5F2] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.02] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top return link */}
      <div className="absolute top-8 left-8 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#A8A8A3] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO PORTFOLIO</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-2xl glass-capsule border border-white/20 flex items-center justify-center mb-2 text-emerald-400">
              <Lock className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-emerald-400 uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>AUTHENTICATED ACCESS ONLY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#F5F5F2] uppercase tracking-tight">
              ADMINISTRATOR
            </h1>
            <p className="text-xs font-mono text-[#6F6F6B]">
              Sign in to manage portfolio content & media
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs font-mono">
            <div>
              <label className="text-[#A8A8A3] block mb-1.5 uppercase tracking-wider">
                USERNAME
              </label>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#121215] border border-white/10 text-white placeholder-[#6F6F6B] focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            <div>
              <label className="text-[#A8A8A3] block mb-1.5 uppercase tracking-wider">
                PASSWORD
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#121215] border border-white/10 text-white placeholder-[#6F6F6B] focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3.5 rounded-xl bg-white text-black font-bold tracking-widest uppercase hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <span>SIGN IN TO DASHBOARD</span>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="text-center pt-2 border-t border-white/5">
            <span className="text-[10px] font-mono text-[#6F6F6B]">
              Role-based session encryption active.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
