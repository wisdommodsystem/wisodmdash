"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Trash2, XCircle, CheckCircle, Send, User, Shield } from "lucide-react";

export function TicketManagement() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (activeTicket) {
      fetchMessages(activeTicket._id);
      const interval = setInterval(() => fetchMessages(activeTicket._id), 5000);
      return () => clearInterval(interval);
    }
  }, [activeTicket]);

  const fetchTickets = async () => {
    const res = await fetch("/api/admin/tickets");
    const data = await res.json();
    if (Array.isArray(data)) setTickets(data);
  };

  const fetchMessages = async (ticketId: string) => {
    const res = await fetch(`/api/tickets/messages?ticketId=${ticketId}`);
    const data = await res.json();
    if (Array.isArray(data)) setMessages(data);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeTicket) return;

    try {
      const res = await fetch("/api/tickets/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: activeTicket._id,
          content: newMessage,
          senderId: "admin",
          senderName: "Wisdom AI"
        })
      });
      if (res.ok) {
        setNewMessage("");
        fetchMessages(activeTicket._id);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/tickets", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId: id, status })
    });
    fetchTickets();
    if (activeTicket?._id === id) {
      setActiveTicket({ ...activeTicket, status });
    }
  };

  const deleteTicket = async (id: string) => {
    if (!confirm("Are you sure? This will delete all messages.")) return;
    await fetch(`/api/admin/tickets?ticketId=${id}`, { method: "DELETE" });
    fetchTickets();
    if (activeTicket?._id === id) setActiveTicket(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[600px] lg:h-[750px]">
      {/* Sidebar: Ticket List */}
      <div className="w-full lg:w-[350px] rounded-xl border border-white/10 bg-[#151a2b] flex flex-col overflow-hidden h-[400px] lg:h-full">
        <div className="p-4 border-b border-white/10 bg-[#0f1424] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#5865F2]" />
            Active Tickets
          </h2>
          <span className="text-[10px] bg-[#5865F2]/20 text-[#5865F2] px-2 py-0.5 rounded-full font-bold">
            {tickets.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
          {tickets.map((t) => (
            <button
              key={t._id}
              onClick={() => setActiveTicket(t)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                activeTicket?._id === t._id 
                  ? 'bg-[#5865F2]/10 border-[#5865F2]/50 ring-1 ring-[#5865F2]/20' 
                  : 'hover:bg-white/5 border-transparent'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">{t.type}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                  t.status === 'Open' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {t.status}
                </span>
              </div>
              <p className="text-sm font-medium text-white truncate">{t.subject}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-[#5865F2]/20 flex items-center justify-center">
                    <User className="h-2.5 w-2.5 text-[#5865F2]" />
                  </div>
                  <span className="text-[10px] text-slate-400 truncate max-w-[100px]">{t.username}</span>
                </div>
                <span className="text-[9px] text-slate-600">
                  {new Date(t.createdAt).toLocaleDateString()}
                </span>
              </div>
            </button>
          ))}
          {tickets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="h-8 w-8 text-slate-700 mb-2" />
              <p className="text-xs text-slate-500">No tickets found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 rounded-xl border border-white/10 bg-[#151a2b] flex flex-col overflow-hidden h-[500px] lg:h-full">
        {activeTicket ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 bg-[#0f1424] flex flex-wrap gap-4 justify-between items-center">
              <div className="min-w-0">
                <h2 className="text-base md:text-lg font-semibold text-white truncate">{activeTicket.subject}</h2>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  From: <span className="text-[#5865F2] font-medium">{activeTicket.username}</span>
                </p>
              </div>
              <div className="flex gap-2">
                {activeTicket.status === "Open" ? (
                  <button 
                    onClick={() => updateStatus(activeTicket._id, "Closed")}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition active:scale-95"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Close Ticket</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => updateStatus(activeTicket._id, "Open")}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs hover:bg-emerald-500/20 transition active:scale-95"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Reopen</span>
                  </button>
                )}
                <button 
                  onClick={() => deleteTicket(activeTicket._id)}
                  className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition active:scale-95"
                  title="Delete Ticket"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0e1a]/50 custom-scrollbar">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex items-start gap-3 group px-2 py-1 rounded-lg transition-colors ${
                    msg.senderId === 'admin' ? 'bg-white/[0.02]' : ''
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {msg.senderId === 'admin' ? (
                      <img 
                        src="https://i.postimg.cc/7YXBBpPW/wisdomlogo.png" 
                        alt="Wisdom AI" 
                        className="h-10 w-10 rounded-full border border-purple-500/30 object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-[#5865F2] flex items-center justify-center text-sm font-bold text-white uppercase border border-white/10">
                        {msg.senderName[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-sm font-bold ${msg.senderId === 'admin' ? 'text-purple-400' : 'text-white'}`}>
                        {msg.senderId === 'admin' ? 'Wisdom AI' : msg.senderName}
                      </span>
                      {msg.senderId === 'admin' && (
                        <span className="bg-[#5865F2] text-[10px] text-white px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5 shadow-sm">
                          <Shield className="h-2.5 w-2.5" />
                          STAFF
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 font-medium">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed break-words whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-[#0f1424]">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Type your response..."
                  className="flex-1 rounded-xl bg-[#0a0e1a] border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#5865F2] transition"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="rounded-xl bg-[#5865F2] p-2.5 text-white hover:bg-[#4752c4] transition disabled:opacity-50 active:scale-95"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-[#0a0e1a]/20">
            <div className="h-20 w-20 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/5">
              <MessageSquare className="h-10 w-10 text-slate-700" />
            </div>
            <h3 className="text-lg font-semibold text-white">No Ticket Selected</h3>
            <p className="text-sm text-slate-500 max-w-[250px] mt-2">
              Select a ticket from the list to view the conversation and respond.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
