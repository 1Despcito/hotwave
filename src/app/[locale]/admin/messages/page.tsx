"use client";

import { useState, useEffect } from "react";

type Message = { id: string; name: string; email: string; message: string; createdAt: string; read: boolean };

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const res = await fetch("/api/messages");
    if (res.ok) setMessages(await res.json());
    setIsLoading(false);
  };

  const handleMarkAsRead = async (id: string) => {
    const res = await fetch(`/api/messages/${id}`, { method: "PUT" });
    if (res.ok) fetchMessages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
    if (res.ok) fetchMessages();
  };

  if (isLoading) return <div className="text-white">Loading messages...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6 font-heading">Inbox Messages 📨</h1>
      
      <div className="bg-[#0a0a0a] rounded-3xl shadow-xl border border-gray-800 overflow-hidden">
        <ul className="divide-y divide-gray-800/50">
          {messages.map(msg => (
            <li key={msg.id} className={`p-6 md:p-8 transition-colors ${!msg.read ? 'bg-brand-cyan/5 hover:bg-brand-cyan/10' : 'bg-[#111111] hover:bg-white/[0.02]'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">{msg.name}</h3>
                  <p className="text-sm text-gray-400">{msg.email}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(msg.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-300 border-l-2 border-brand-cyan pl-4 py-3 bg-black/40 rounded-r-xl pr-4 leading-relaxed font-sans">
                {msg.message}
              </div>
              <div className="mt-6 flex space-x-4">
                {!msg.read && (
                  <button onClick={() => handleMarkAsRead(msg.id)} className="text-brand-cyan hover:text-cyan-300 text-sm font-bold transition-colors bg-brand-cyan/10 px-4 py-2 rounded-lg">
                    Mark as Read
                  </button>
                )}
                <button onClick={() => handleDelete(msg.id)} className="text-red-400 hover:text-red-300 text-sm font-bold transition-colors bg-red-400/10 px-4 py-2 rounded-lg">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        {messages.length === 0 && <div className="p-6 text-center text-gray-500">No incoming messages found.</div>}
      </div>
    </div>
  );
}
