"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, User, MapPin, Briefcase, Star, MessageCircle, CheckCircle } from "lucide-react";

export default function WorkerDetails() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();
  const [worker, setWorker] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/workers?all=true`);
        const data = await res.json();
        const found = data.find((w: any) => w._id === params.id);
        setWorker(found);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchWorker();
  }, [params.id]);

  const handleBook = async () => {
    if (!token) {
      router.push('/login');
      return;
    }
    setBooking(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/bookings`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ workerId: worker._id })
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/user/chat/${data._id}`);
      } else {
        alert(data.error || "Booking failed");
      }
    } catch (err) {
      console.error(err);
    }
    setBooking(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-black p-12 text-center text-zinc-400 flex items-center justify-center font-sans">
      <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
    </div>
  );
  
  if (!worker) return <div className="min-h-screen bg-black p-12 text-center text-zinc-400 font-bold font-sans flex items-center justify-center">Record Not Found</div>;

  return (
    <div className="min-h-screen bg-black p-6 md:p-12 font-sans overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-[30%] left-[20%] w-96 h-96 bg-orange-600/20 rounded-full mix-blend-screen filter blur-[128px]"></div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <button onClick={() => router.back()} className="mb-6 flex items-center text-zinc-400 hover:text-zinc-100 transition">
          <ArrowLeft size={20} className="mr-2" /> Return to Directory
        </button>

        <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 relative">
          <div className="h-32 bg-gradient-to-r from-orange-900/50 to-zinc-900/50 relative overflow-hidden">
             <div className="absolute inset-0 bg-white/5 mix-blend-overlay"></div>
          </div>
          
          <div className="relative px-8 pb-8">
            <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center border-4 border-black shadow-[0_0_15px_rgba(249,115,22,0.3)] -mt-12 mb-4 text-4xl transform transition-transform hover:scale-105 cursor-default">
              🧑🏽‍🔧
            </div>
            
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-extrabold text-zinc-100 flex items-center">
                  {worker.name}
                  {worker.verified && (
                    <span title="Verified Professional" className="ml-3 flex items-center justify-center bg-emerald-500/10 text-emerald-400 rounded-full">
                       <CheckCircle size={24} className="fill-emerald-500/20" />
                    </span>
                  )}
                </h1>
                <p className="text-xl text-orange-400 font-bold tracking-wide uppercase mt-1">{worker.service_type}</p>
              </div>
              <div className="flex items-center bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold px-4 py-2 rounded-full shadow-inner">
                <Star size={18} className="fill-yellow-500 mr-2" /> {worker.rating}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center text-zinc-300 bg-zinc-800/30 p-4 rounded-xl border border-zinc-700">
                <MapPin className="text-zinc-400 mr-3" size={24} />
                <div>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Location Node</p>
                  <p className="font-medium text-zinc-100">{worker.location}</p>
                </div>
              </div>
              <div className="flex items-center text-zinc-300 bg-zinc-800/30 p-4 rounded-xl border border-zinc-700">
                <Briefcase className="text-orange-500 mr-3" size={24} />
                <div>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Time in Service</p>
                  <p className="font-medium text-zinc-100">{worker.experience} years</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <button 
                onClick={handleBook}
                disabled={booking}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold py-5 rounded-2xl shadow-[0_0_15px_rgba(249,115,22,0.4)] transition flex items-center justify-center text-lg disabled:opacity-50"
              >
                <MessageCircle className="mr-3" /> {booking ? "Initiating Handshake..." : "Initiate Booking & Comm Link"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
