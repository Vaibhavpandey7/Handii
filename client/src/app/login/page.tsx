"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, ArrowLeft } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        login(data.token, data.user);
        if (data.user.role === 'worker') router.push('/worker/dashboard');
        else if (data.user.role === 'admin') router.push('/');
        else router.push('/user/dashboard');
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-zinc-600/20 rounded-full mix-blend-screen filter blur-[128px]"></div>

      <div className="w-full max-w-md relative z-10">
        <button onClick={() => router.push('/')} className="mb-6 flex items-center text-zinc-400 hover:text-zinc-100 transition">
          <ArrowLeft size={16} className="mr-2" /> Back to Home
        </button>

        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl">
          <h1 className="text-3xl font-extrabold text-white mb-2">Access Portal</h1>
          <p className="text-zinc-400 mb-8 text-sm">Authenticate into the Handii network.</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={18} />
              <input 
                required
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full pl-12 pr-4 py-3.5 bg-zinc-800/50 border border-zinc-700 rounded-xl outline-none text-white focus:border-orange-500 transition"
                placeholder="Email Address"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={18} />
              <input 
                required
                type="password" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full pl-12 pr-4 py-3.5 bg-zinc-800/50 border border-zinc-700 rounded-xl outline-none text-white focus:border-orange-500 transition"
                placeholder="Password"
              />
            </div>

            <button 
              disabled={loading} 
              type="submit" 
              className="w-full py-4 rounded-xl font-bold text-black transition disabled:opacity-50 bg-white hover:bg-zinc-200 shadow-md"
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-zinc-500 text-sm">Don't have credentials? </span>
            <Link href="/register" className="font-bold text-sm text-zinc-300 hover:text-white transition">
              Establish Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
