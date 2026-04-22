"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Send } from "lucide-react";

export default function WorkerBookingChat() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();
  const [booking, setBooking] = useState<any>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetchBooking();
    const interval = setInterval(fetchBooking, 3000);
    return () => clearInterval(interval);
  }, [params.id, token]);

  const fetchBooking = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/bookings/${params.id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setBooking(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    // Optimistic UI update
    const prevText = text;
    setText("");
    
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/bookings/${params.id}/messages`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text: prevText })
      });
      fetchBooking(); // update immediately
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black p-12 text-center flex items-center justify-center font-sans">
      <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex flex-col p-6 md:p-12 font-sans relative overflow-hidden h-screen">
      <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-emerald-600/10 rounded-full mix-blend-screen filter blur-[128px] pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col h-full">
        <div className="flex items-center mb-6">
          <button onClick={() => router.push('/worker/dashboard')} className="flex items-center text-zinc-400 hover:text-zinc-100 transition mr-4 bg-zinc-900/60 border border-zinc-800 p-3 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <ArrowLeft size={20} />
          </button>
          <div className="bg-zinc-900/60 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-2xl border border-zinc-800 flex-1 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-zinc-100">Comm Link: {booking?.userId}</h1>
              <p className="text-sm text-emerald-500 font-bold uppercase tracking-wider mt-1">Client Connection Established</p>
            </div>
            <div className={`px-4 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider border ${
              booking?.status === 'Pending' ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' :
              booking?.status === 'Confirmed' ? 'text-orange-500 bg-orange-500/10 border-orange-500/20' :
              'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
            }`}>
              {booking?.status}
            </div>
          </div>
        </div>

        <div className="flex-1 bg-zinc-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-800 overflow-hidden flex flex-col mb-4">
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
            <div className="text-center w-full my-4">
              <span className="bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">Secure Channel Open</span>
            </div>
            
            {booking?.messages?.map((msg: any, i: number) => {
              const isWorker = msg.sender === "Worker";
              return (
                <div key={i} className={`flex ${isWorker ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-5 py-3.5 ${
                    isWorker 
                      ? "bg-emerald-500/90 text-black font-medium rounded-tr-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
                      : "bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-tl-sm shadow-inner"
                  }`}>
                    <p className="text-[15px]">{msg.text}</p>
                    <p className={`text-[10px] mt-1.5 font-bold uppercase ${isWorker ? "text-emerald-900" : "text-zinc-500"}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              );
            })}
            
            {booking?.messages?.length === 0 && (
              <div className="text-center text-zinc-500 font-medium py-12">
                Awaiting input... Initiate the sequence to contact the client.
              </div>
            )}
          </div>

          <div className="p-5 bg-zinc-900/80 border-t border-zinc-800">
            <form onSubmit={sendMessage} className="flex relative">
              <input 
                type="text" 
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 py-4 pl-6 pr-16 bg-zinc-800/50 rounded-2xl border border-zinc-700 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 text-zinc-100 placeholder:text-zinc-500 transition"
                placeholder="Transmit message..."
              />
              <button type="submit" disabled={!text.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center disabled:opacity-50 transition shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Send size={20} className="-ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
