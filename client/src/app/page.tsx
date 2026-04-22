"use client";

import Link from "next/link";
import { User, Briefcase, ShieldCheck, Star, Users, CheckCircle, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, logout, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-[float_6s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-zinc-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-[float_8s_ease-in-out_infinite_reverse]"></div>

      {/* Top Navigation */}
      <nav className="absolute top-0 w-full p-6 flex justify-end items-center gap-4 z-20">
        {!user ? (
          <>
            <Link href="/login" className="text-sm font-bold text-zinc-300 hover:text-white transition">Login</Link>
            <Link href="/register" className="text-sm font-bold text-black bg-white hover:bg-zinc-200 px-5 py-2.5 rounded-full transition shadow-md">Register</Link>
          </>
        ) : (
          <>
            <span className="text-zinc-400 text-sm mr-2">Logged in as <strong className="text-white">{user.name}</strong></span>
            
            {user.role === 'user' && (
              <Link href="/user/dashboard" className="text-sm font-bold text-zinc-300 hover:text-orange-500 bg-zinc-900/50 px-5 py-2.5 rounded-full border border-zinc-800 transition hover:border-orange-500/50 backdrop-blur-md">Command Center</Link>
            )}

            {user.role === 'worker' && (
              <Link href="/worker/dashboard" className="text-sm font-bold text-zinc-300 hover:text-emerald-500 bg-zinc-900/50 px-5 py-2.5 rounded-full border border-zinc-800 transition hover:border-emerald-500/50 backdrop-blur-md">Professional Terminal</Link>
            )}
            
            <button onClick={logout} className="ml-2 text-zinc-500 hover:text-red-500 flex items-center transition bg-zinc-900/50 p-2.5 rounded-full border border-zinc-800 hover:border-red-500/30">
              <LogOut size={16} />
            </button>
          </>
        )}
      </nav>

      {/* Main Content Node */}
      <div className="flex-1 flex flex-col justify-center items-center text-center p-6 relative z-10 w-full">

        <div className="max-w-3xl mt-16 mb-20 px-4">
          <h1 className="text-6xl md:text-8xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 tracking-tight leading-tight animate-[fadeInDown_1.2s_ease-out]">
            Handii
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-zinc-100 mb-8 tracking-tight leading-tight animate-[fadeInDown_1.2s_ease-out]">
            Urban Services Reimagined.
          </h2>
          <p className="text-xl md:text-2xl font-light text-zinc-400 max-w-2xl mx-auto animate-[fadeIn_1.5s_ease-out]">
            Experience the future of local professional services. Connect seamlessly, manage operations effortlessly.
          </p>
        </div>

        {/* Glassmorphic Navigation Cards */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 px-4 pb-16">
          
          {(!user || user.role === 'user') && (
            <Link href="/user" className="block w-full h-full">
              <div className="group relative h-full bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-8 border border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-800/80 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all"></div>

                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(249,115,22,0.2)] group-hover:shadow-[0_0_25px_rgba(249,115,22,0.4)]">
                  <User size={32} />
                </div>
                <h2 className="text-2xl font-bold text-zinc-100 mb-3 text-left">Find a Professional</h2>
                <p className="text-zinc-400 text-left text-sm leading-relaxed">
                  Browse verified professionals, instantly book services, and get your tasks resolved reliably.
                </p>
              </div>
            </Link>
          )}

          {(!user || user.role === 'worker') && (
            <Link href="/worker" className="block w-full h-full">
              <div className="group relative h-full bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-8 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-800/80 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>

                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                  <Briefcase size={32} />
                </div>
                <h2 className="text-2xl font-bold text-zinc-100 mb-3 text-left">Identify as Worker</h2>
                <p className="text-zinc-400 text-left text-sm leading-relaxed">
                  Join our elite platform, set your availability, build a reputation, and grow your career.
                </p>
              </div>
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link href="/admin" className="block w-full h-full">
              <div className="group relative h-full bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-8 border border-zinc-800 hover:border-neutral-500/50 hover:bg-zinc-800/80 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-500/10 rounded-full blur-3xl group-hover:bg-neutral-500/20 transition-all"></div>

                <div className="w-16 h-16 rounded-2xl bg-neutral-500/10 border border-neutral-500/20 flex items-center justify-center text-neutral-400 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(115,115,115,0.2)] group-hover:shadow-[0_0_25px_rgba(115,115,115,0.4)]">
                  <ShieldCheck size={32} />
                </div>
                <h2 className="text-2xl font-bold text-zinc-100 mb-3 text-left">Admin Panel</h2>
                <p className="text-zinc-400 text-left text-sm leading-relaxed">
                  Oversee entirely verified accounts, enforce quality control, and view global macro-analytics.
                </p>
              </div>
            </Link>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="w-full max-w-4xl border-t border-white/10 pt-10 pb-12 opacity-80">
          <p className="text-zinc-500 text-sm font-semibold tracking-widest uppercase mb-8">Platform Statistics</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500"><Star size={24} /></div>
              <div className="text-left">
                <p className="text-2xl font-bold text-zinc-100">4.8/5</p>
                <p className="text-xs text-zinc-400">Average Rating</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-500/10 rounded-lg text-zinc-400"><Users size={24} /></div>
              <div className="text-left">
                <p className="text-2xl font-bold text-zinc-100">10K+</p>
                <p className="text-xs text-zinc-400">Active Users</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500"><CheckCircle size={24} /></div>
              <div className="text-left">
                <p className="text-2xl font-bold text-zinc-100">100%</p>
                <p className="text-xs text-zinc-400">Verified Pros</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
