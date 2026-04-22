"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, User, MapPin, Briefcase } from "lucide-react";

export default function WorkerRegistration() {
  const router = useRouter();
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    service_type: "",
    location: "",
    phone: "",
    experience: 0
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      router.push('/login');
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/workers`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/'), 3000);
      }
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-black p-6 md:p-12 font-sans overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-[20%] left-[-10%] w-96 h-96 bg-orange-600/20 rounded-full mix-blend-screen filter blur-[128px]"></div>
      <div className="absolute bottom-[-10%] right-[10%] w-96 h-96 bg-zinc-600/20 rounded-full mix-blend-screen filter blur-[128px]"></div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <button onClick={() => router.push('/')} className="mb-8 flex items-center text-zinc-400 hover:text-zinc-100 transition">
          <ArrowLeft size={20} className="mr-2" /> Back to Space
        </button>

        <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
          
          <h1 className="text-4xl font-extrabold text-zinc-100 mb-2 tracking-tight">Become a Professional</h1>
          <p className="text-zinc-400 mb-8 max-w-lg">Register your profile on the network. You will need to be verified by a sector admin before you appear in protocol searches.</p>

          {success ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center animate-[fadeIn_0.5s_ease-out]">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                ✓
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Profile Submitted!</h2>
              <p className="text-emerald-400 font-medium">Please wait for an administrator to clear your credentials.</p>
              <p className="text-sm text-zinc-400 mt-4 animate-pulse">Routing back to origin...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-zinc-100 mb-2 tracking-wide uppercase">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={18} />
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-zinc-800/30 border border-zinc-800 outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition text-zinc-100 placeholder:text-zinc-500"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-100 mb-2 tracking-wide uppercase">Service Type</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={18} />
                  <select 
                    required
                    value={formData.service_type}
                    onChange={e => setFormData({...formData, service_type: e.target.value})}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-zinc-800/30 border border-zinc-800 outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition text-zinc-100 appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="text-zinc-500">Select a Profession</option>
                    <option value="Plumber" className="bg-zinc-900">Plumber</option>
                    <option value="Electrician" className="bg-zinc-900">Electrician</option>
                    <option value="Carpenter" className="bg-zinc-900">Carpenter</option>
                    <option value="Painter" className="bg-zinc-900">Painter</option>
                    <option value="AC Technician" className="bg-zinc-900">AC Technician</option>
                    <option value="Cleaner" className="bg-zinc-900">Cleaner</option>
                    <option value="Mechanic" className="bg-zinc-900">Mechanic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-100 mb-2 tracking-wide uppercase">General Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={18} />
                  <input 
                    required
                    type="text" 
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-zinc-800/30 border border-zinc-800 outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition text-zinc-100 placeholder:text-zinc-500"
                    placeholder="e.g. Downtown, Uptown"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-zinc-100 mb-2 tracking-wide uppercase">Phone</label>
                  <input 
                    required
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-2xl bg-zinc-800/30 border border-zinc-800 outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition text-zinc-100 placeholder:text-zinc-500"
                    placeholder="555-0123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-100 mb-2 tracking-wide uppercase">Experience (Years)</label>
                  <input 
                    required
                    type="number" 
                    min="0"
                    value={formData.experience}
                    onChange={e => setFormData({...formData, experience: e.target.value === "" ? 0 : parseInt(e.target.value)})}
                    className="w-full px-4 py-3.5 rounded-2xl bg-zinc-800/30 border border-zinc-800 outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition text-zinc-100"
                  />
                </div>
              </div>

              <button disabled={submitting} type="submit" className="w-full mt-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold py-4 rounded-2xl shadow-[0_0_15px_rgba(249,115,22,0.4)] transition disabled:opacity-50 disabled:cursor-not-allowed">
                {submitting ? "Transmitting..." : "Initialize Profile"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
