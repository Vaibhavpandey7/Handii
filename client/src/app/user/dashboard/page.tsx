"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, CheckCircle, Navigation, MessageCircle, Briefcase, Calendar } from "lucide-react";

export default function UserDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = "mock-user-123";

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/bookings/user/${userId}`);
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchBookings();
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Confirmed': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Completed': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Pending': return <Clock size={16} className="mr-2" />;
      case 'Confirmed': return <Navigation size={16} className="mr-2" />;
      case 'Completed': return <CheckCircle size={16} className="mr-2" />;
      default: return <Clock size={16} className="mr-2" />;
    }
  };

  return (
    <div className="min-h-screen bg-black p-6 md:p-12 font-sans overflow-hidden relative">
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-orange-600/20 rounded-full mix-blend-screen filter blur-[128px]"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-96 h-96 bg-zinc-600/20 rounded-full mix-blend-screen filter blur-[128px]"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <button onClick={() => router.push('/')} className="mb-8 flex items-center text-zinc-400 hover:text-zinc-100 transition">
          <ArrowLeft size={20} className="mr-2" /> Back to Space
        </button>

        <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-zinc-100 mb-2 tracking-tight">Command Center</h1>
            <p className="text-zinc-400 max-w-2xl">Manage your service requests, track active personnel, and review completed missions.</p>
          </div>
          <div className="hidden md:flex flex-col items-center justify-center p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
            <span className="text-3xl font-bold text-orange-500">{bookings.length}</span>
            <span className="text-xs text-orange-400 font-bold uppercase tracking-wider">Total Logs</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-orange-500 rounded-sm inline-block"></span> Active & Past Bookings
        </h2>

        {loading ? (
          <div className="text-center py-20 bg-zinc-900/30 backdrop-blur-md rounded-3xl border border-zinc-800">
            <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-zinc-400 font-medium">Downloading logs...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-zinc-900/30 backdrop-blur-md rounded-3xl border border-zinc-800 p-16 text-center">
            <div className="w-20 h-20 bg-zinc-800/30 border border-zinc-700/50 rounded-full flex items-center justify-center text-zinc-500 mx-auto mb-6">
              <Calendar size={32} />
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-2">No Service Logs Found</h3>
            <p className="text-zinc-400 mb-6">You have not initiated any requests recently.</p>
            <Link href="/user" className="inline-block bg-orange-500 hover:bg-orange-400 text-black font-bold py-3 px-6 rounded-xl transition">
              Find a Professional
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 transition-all hover:border-orange-500/30 hover:bg-zinc-800/80 group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-100">{booking.workerId?.name || 'Unknown Worker'}</h3>
                    <div className="flex items-center text-zinc-400 text-sm mt-1">
                      <Briefcase size={14} className="mr-2 text-orange-500" />
                      <span className="uppercase tracking-wider font-bold">{booking.workerId?.service_type || 'N/A'}</span>
                    </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center border ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)} {booking.status}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-8 pt-4 border-t border-zinc-800">
                  <span className="text-zinc-500 text-xs font-medium">
                    Initiated {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                  <Link href={`/user/chat/${booking._id}`} className="bg-zinc-800 hover:bg-orange-500 hover:text-black text-zinc-300 font-bold py-2.5 px-6 rounded-xl flex items-center transition border border-zinc-700 hover:border-transparent text-sm">
                    <MessageCircle size={16} className="mr-2" /> Open Comm Link
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
