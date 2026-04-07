"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/workers?all=true`);
      const data = await res.json();
      setWorkers(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleVerify = async (id: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/workers/${id}/verify`, { method: "PATCH" });
      fetchWorkers(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black p-6 md:p-12 font-sans overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-[30%] left-[-10%] w-96 h-96 bg-zinc-600/20 rounded-full mix-blend-screen filter blur-[128px]"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-96 h-96 bg-orange-600/20 rounded-full mix-blend-screen filter blur-[128px]"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <button onClick={() => router.push('/')} className="mb-8 flex items-center text-zinc-400 hover:text-zinc-100 transition">
          <ArrowLeft size={20} className="mr-2" /> Back to Space
        </button>

        <h1 className="text-4xl font-extrabold text-zinc-100 mb-2 tracking-tight">Admin Dashboard</h1>
        <p className="text-zinc-400 mb-8 max-w-2xl">Validate protocol workers, enforce verification standards, and manage platform integrity.</p>
        
        <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
          
          <div className="overflow-x-auto relative z-10 p-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider">
                  <th className="p-6 text-zinc-400 font-bold">Worker</th>
                  <th className="p-6 text-zinc-400 font-bold">Service & Location</th>
                  <th className="p-6 text-zinc-400 font-bold">Status</th>
                  <th className="p-6 text-zinc-400 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center p-12">
                      <div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
                      <span className="text-zinc-400">Loading directory...</span>
                    </td>
                  </tr>
                ) : workers.map((worker: any) => (
                  <tr key={worker._id} className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors group">
                    <td className="p-6">
                      <div className="font-bold text-zinc-100 tracking-wide">{worker.name}</div>
                      <div className="text-sm text-zinc-400 font-medium">{worker.phone}</div>
                    </td>
                    <td className="p-6">
                      <div className="font-bold text-orange-400 uppercase tracking-widest text-xs">{worker.service_type}</div>
                      <div className="text-sm text-zinc-500 mt-1">{worker.location}</div>
                    </td>
                    <td className="p-6">
                      {worker.verified ? (
                        <span className="inline-flex items-center text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)] px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                          <CheckCircle size={14} className="mr-1.5" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-amber-500 bg-amber-500/10 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)] px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                          <Clock size={14} className="mr-1.5" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="p-6 text-right">
                      {!worker.verified && (
                        <button 
                          onClick={() => handleVerify(worker._id)}
                          className="bg-zinc-800/30 hover:bg-orange-500 hover:text-black border border-zinc-700 hover:border-transparent text-zinc-300 font-bold py-2.5 px-6 rounded-xl text-sm transition-all shadow-[0_0_10px_rgba(249,115,22,0)] hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] group-hover:bg-orange-500/10"
                        >
                          Verify Worker
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
