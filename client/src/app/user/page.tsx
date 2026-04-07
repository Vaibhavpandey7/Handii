"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Search as SearchIcon, ArrowLeft, Briefcase, ChevronDown, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserSearch() {
  const router = useRouter();
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWorkers("", "");
  }, []);

  const fetchWorkers = async (srv: string, loc: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/workers?service=${srv}&location=${loc}`);
      const data = await res.json();
      setWorkers(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWorkers(service, location);
  };

  return (
    <div className="min-h-screen bg-black p-6 md:p-12 font-sans overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-orange-600/20 rounded-full mix-blend-screen filter blur-[128px]"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-96 h-96 bg-zinc-600/20 rounded-full mix-blend-screen filter blur-[128px]"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <button onClick={() => router.push('/')} className="mb-8 flex items-center text-zinc-400 hover:text-zinc-100 transition">
          <ArrowLeft size={20} className="mr-2" /> Back to Space
        </button>

        <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl mb-12">
          <h1 className="text-4xl font-extrabold text-zinc-100 mb-2 tracking-tight">Find a Professional</h1>
          <p className="text-zinc-400 mb-8 max-w-2xl">Locate verified experts in your designated sector. Filter by service requirement and regional proximity.</p>

          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={20} />
              <select 
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full pl-12 pr-10 py-4 appearance-none rounded-2xl bg-zinc-800/30 border border-zinc-700/50 outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition text-zinc-100" 
              >
                <option value="" className="bg-zinc-900">What service do you need?</option>
                <option value="Plumber" className="bg-zinc-900">Plumber</option>
                <option value="Electrician" className="bg-zinc-900">Electrician</option>
                <option value="Carpenter" className="bg-zinc-900">Carpenter</option>
                <option value="Painter" className="bg-zinc-900">Painter</option>
                <option value="AC Technician" className="bg-zinc-900">AC Technician</option>
                <option value="Cleaner" className="bg-zinc-900">Cleaner</option>
                <option value="Mechanic" className="bg-zinc-900">Mechanic</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={20} />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
              <input 
                type="text" 
                placeholder="Where? (fuzzy search)" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-800/30 border border-zinc-700/50 outline-none focus:border-zinc-500/50 focus:ring-2 focus:ring-zinc-500/20 transition text-zinc-100 placeholder:text-zinc-500" 
              />
            </div>
            <button type="submit" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold py-4 px-8 rounded-2xl shadow-[0_0_15px_rgba(249,115,22,0.3)] transition flex items-center justify-center">
              <SearchIcon size={20} className="mr-2" /> Search
            </button>
          </form>
        </div>

        <h2 className="text-2xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-orange-500 rounded-sm inline-block"></span> Directory Results
        </h2>
        
        {loading ? (
          <div className="text-center py-20 bg-zinc-900/30 backdrop-blur-md rounded-3xl border border-zinc-800">
            <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-zinc-400 font-medium">Scanning network...</p>
          </div>
        ) : workers.length === 0 ? (
          <div className="bg-zinc-900/30 backdrop-blur-md rounded-3xl border border-zinc-800 p-16 text-center">
            <div className="w-20 h-20 bg-zinc-800/30 border border-zinc-700/50 rounded-full flex items-center justify-center text-zinc-500 mx-auto mb-6">
              <SearchIcon size={32} />
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-2">No verified professionals found</h3>
            <p className="text-zinc-400">Expand your search radius or try alternate service types.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker: any) => (
              <div key={worker._id} className="group bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800 hover:border-orange-500/40 hover:bg-zinc-800/80 transition-all flex flex-col h-full hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all opacity-0 group-hover:opacity-100"></div>
                
                <div className="flex justify-between items-start mb-6 z-10 relative">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-100 tracking-wide flex items-center">
                      {worker.name}
                      {worker.verified && (
                        <span title="Verified Professional" className="ml-2 flex flex-shrink-0 items-center justify-center bg-emerald-500/10 text-emerald-400 rounded-full">
                           <CheckCircle size={16} className="fill-emerald-500/20" />
                        </span>
                      )}
                    </h3>
                    <p className="text-orange-400 font-medium text-sm mt-1 uppercase tracking-wider">{worker.service_type}</p>
                  </div>
                  <div className="bg-zinc-800/50 border border-zinc-700 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold text-yellow-400 flex items-center shadow-inner">
                    ⭐ <span className="ml-1 text-zinc-200">{worker.rating}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 mt-auto mb-6 z-10 relative">
                  <div className="flex items-center text-zinc-400 font-medium text-sm">
                    <MapPin size={16} className="mr-3 text-zinc-500" /> {worker.location}
                  </div>
                  <div className="flex items-center text-zinc-400 font-medium text-sm">
                    <Briefcase size={16} className="mr-3 text-orange-500" /> {worker.experience} years protocol experience
                  </div>
                </div>
                
                <div className="pt-4 border-t border-zinc-800 z-10 relative">
                  <Link href={`/user/worker/${worker._id}`} className="w-full flex items-center justify-center bg-zinc-800/30 hover:bg-orange-500 hover:text-black text-zinc-300 font-bold py-3.5 rounded-2xl transition-all border border-zinc-700 hover:border-transparent">
                    View Profile & Request
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
