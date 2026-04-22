"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Lock, CheckCircle, ArrowLeft, Briefcase } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        login(data.token, data.user);
        router.push(data.user.role === 'worker' ? '/worker/dashboard' : '/user/dashboard');
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-orange-600/20 rounded-full mix-blend-screen filter blur-[128px]"></div>

      <div className="w-full max-w-md relative z-10">
        <button onClick={() => router.push('/')} className="mb-6 flex items-center text-zinc-400 hover:text-zinc-100 transition">
          <ArrowLeft size={16} className="mr-2" /> Back to Home
        </button>

        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl">
          <h1 className="text-3xl font-extrabold text-white mb-2">Initialize Account</h1>
          <p className="text-zinc-400 mb-8 text-sm">Join the Handii network as a Client or Professional.</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4 mb-2">
              <button 
                type="button" 
                onClick={() => setFormData({...formData, role: 'user'})}
                className={`py-3 rounded-xl flex items-center justify-center border transition-all text-sm font-bold ${formData.role === 'user' ? 'bg-orange-500/20 border-orange-500 text-orange-500' : 'bg-zinc-800/50 border-zinc-700 text-zinc-500 hover:text-zinc-300'}`}
              >
                <User size={16} className="mr-2" /> Client
              </button>
              <button 
                type="button" 
                onClick={() => setFormData({...formData, role: 'worker'})}
                className={`py-3 rounded-xl flex items-center justify-center border transition-all text-sm font-bold ${formData.role === 'worker' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'bg-zinc-800/50 border-zinc-700 text-zinc-500 hover:text-zinc-300'}`}
              >
                <Briefcase size={16} className="mr-2" /> Professional
              </button>
            </div>

            <div className="relative">
              <User className={`absolute left-4 top-1/2 -translate-y-1/2 ${formData.role === 'worker' ? 'text-emerald-500' : 'text-orange-500'}`} size={18} />
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className={`w-full pl-12 pr-4 py-3.5 bg-zinc-800/50 border border-zinc-700 rounded-xl outline-none text-white focus:border-${formData.role === 'worker' ? 'emerald' : 'orange'}-500 transition`}
                placeholder="Full Name"
              />
            </div>
            
            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${formData.role === 'worker' ? 'text-emerald-500' : 'text-orange-500'}`} size={18} />
              <input 
                required
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className={`w-full pl-12 pr-4 py-3.5 bg-zinc-800/50 border border-zinc-700 rounded-xl outline-none text-white focus:border-${formData.role === 'worker' ? 'emerald' : 'orange'}-500 transition`}
                placeholder="Email Address"
              />
            </div>

            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${formData.role === 'worker' ? 'text-emerald-500' : 'text-orange-500'}`} size={18} />
              <input 
                required
                type="password" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className={`w-full pl-12 pr-4 py-3.5 bg-zinc-800/50 border border-zinc-700 rounded-xl outline-none text-white focus:border-${formData.role === 'worker' ? 'emerald' : 'orange'}-500 transition`}
                placeholder="Password"
              />
            </div>

            <button 
              disabled={loading} 
              type="submit" 
              className={`w-full py-4 rounded-xl font-bold text-black transition disabled:opacity-50 ${formData.role === 'worker' ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-orange-500 hover:bg-orange-400'}`}
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-zinc-500 text-sm">Already have an account? </span>
            <Link href="/login" className={`font-bold text-sm ${formData.role === 'worker' ? 'text-emerald-500 hover:text-emerald-400' : 'text-orange-500 hover:text-orange-400'}`}>
              Login Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
