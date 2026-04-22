"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Briefcase, Calendar, MessageCircle } from "lucide-react";

export default function WorkerDashboard() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchBookings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/bookings/worker/me`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setBookings(data);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchBookings();
  }, [token]);

  const updateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
      }
    } catch (err) {
        console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Confirmed': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Completed': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  if (loading) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black p-6 md:p-12 font-sans overflow-hidden relative">
      <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-emerald-600/10 rounded-full mix-blend-screen filter blur-[128px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-zinc-600/20 rounded-full mix-blend-screen filter blur-[128px]"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <button onClick={() => router.push('/')} className="mb-8 flex items-center text-zinc-400 hover:text-zinc-100 transition">
          <ArrowLeft size={20} className="mr-2" /> Back to Space
        </button>

        <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-zinc-100 mb-2 tracking-tight">Professional Terminal</h1>
              <p className="text-zinc-400 max-w-2xl">Access your job requests, confirm schedules, and communicate with clients.</p>
            </div>
            
            <div className="flex items-center bg-zinc-800/80 px-4 py-2 border border-zinc-700/50 rounded-xl">
               <span className="text-emerald-500 font-bold tracking-wider uppercase text-xs">Logged in: {user?.name}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-zinc-800/50">
            <div className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-700/50">
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-wider mb-2">Total Jobs</p>
              <p className="text-3xl font-extrabold text-zinc-100">{bookings.length}</p>
            </div>
            <div className="bg-yellow-500/5 rounded-2xl p-6 border border-yellow-500/20">
              <p className="text-yellow-500/80 text-sm font-bold uppercase tracking-wider mb-2">Pending</p>
              <p className="text-3xl font-extrabold text-yellow-500">{bookings.filter(b => b.status === 'Pending').length}</p>
            </div>
            <div className="bg-emerald-500/5 rounded-2xl p-6 border border-emerald-500/20">
              <p className="text-emerald-500/80 text-sm font-bold uppercase tracking-wider mb-2">Completed</p>
              <p className="text-3xl font-extrabold text-emerald-500">{bookings.filter(b => b.status === 'Completed').length}</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-emerald-500 rounded-sm inline-block"></span> Work Orders
        </h2>

        {bookings.length === 0 ? (
          <div className="bg-zinc-900/30 backdrop-blur-md rounded-3xl border border-zinc-800 p-16 text-center">
            <div className="w-20 h-20 bg-zinc-800/30 border border-zinc-700/50 rounded-full flex items-center justify-center text-zinc-500 mx-auto mb-6">
              <Briefcase size={32} />
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-2">No active work orders</h3>
            <p className="text-zinc-400">Your schedule is completely clear.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 transition-all hover:border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-zinc-100">{booking.userId}</h3>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-sm font-medium flex items-center">
                    <Calendar size={14} className="mr-2" /> Request initiated on {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  {booking.status === 'Pending' && (
                    <button 
                      onClick={() => updateStatus(booking._id, 'Confirmed')}
                      className="flex-1 md:flex-none px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm rounded-xl transition"
                    >
                      Confirm
                    </button>
                  )}
                  {booking.status === 'Confirmed' && (
                    <button 
                      onClick={() => updateStatus(booking._id, 'Completed')}
                      className="flex-1 md:flex-none px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm rounded-xl transition"
                    >
                      Mark Complete
                    </button>
                  )}
                  <Link href={`/worker/chat/${booking._id}`} className="flex-1 md:flex-none flex items-center justify-center px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-sm rounded-xl transition border border-zinc-700 hover:border-transparent">
                    <MessageCircle size={16} className="mr-2" /> Comm
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
