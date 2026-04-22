"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Send } from "lucide-react";

export default function BookingChat() {
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

  if (loading) return <div className="min-h-screen bg-slate-50 p-12 text-center text-slate-500">Loading chat...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-6 md:pt-12 px-4 md:px-12 max-w-4xl mx-auto h-screen">
      <div className="flex items-center mb-6">
        <button onClick={() => router.push('/user')} className="flex items-center text-slate-500 hover:text-slate-800 transition mr-4 bg-white p-2 rounded-full shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex-1 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Booking: {booking?.workerId?.name}</h1>
            <p className="text-sm text-[var(--color-legacy-primary)]">{booking?.workerId?.service_type}</p>
          </div>
          <div className="bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 rounded-full uppercase tracking-wider">
            {booking?.status}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col mb-6">
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
          <div className="text-center w-full">
            <span className="bg-slate-100 text-slate-400 text-xs font-bold px-3 py-1 rounded-full">Conversation Started</span>
          </div>
          
          {booking?.messages?.map((msg: any, i: number) => {
            const isUser = msg.sender === "User";
            return (
              <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                  isUser 
                    ? "bg-[var(--color-legacy-primary)] text-white rounded-tr-sm shadow-md" 
                    : "bg-slate-100 text-slate-800 rounded-tl-sm"
                }`}>
                  <p className="text-[15px]">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${isUser ? "text-blue-200" : "text-slate-400"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            );
          })}
          
          {booking?.messages?.length === 0 && (
            <div className="text-center text-slate-400 font-medium py-12">
              Send a message to {booking?.workerId?.name} describing your requirements!
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <form onSubmit={sendMessage} className="flex relative">
            <input 
              type="text" 
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 py-4 pl-6 pr-14 rounded-full border border-slate-200 outline-none focus:border-[var(--color-legacy-primary)] focus:ring-1 focus:ring-[var(--color-legacy-primary)] shadow-sm"
              placeholder="Type your message..."
            />
            <button type="submit" disabled={!text.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--color-legacy-primary)] text-white flex items-center justify-center disabled:opacity-50 transition shadow-md hover:bg-blue-700">
              <Send size={18} className="-ml-1" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
