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

  if (isLoading) return <div className="text-white">جاري التحميل...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">الرسائل الواردة</h1>
      
      <div className="bg-[#111111] rounded-lg shadow-sm border border-gray-800 overflow-hidden">
        <ul className="divide-y divide-gray-800">
          {messages.map(msg => (
            <li key={msg.id} className={`p-6 transition-colors ${!msg.read ? 'bg-blue-900/10' : 'bg-[#111111] hover:bg-gray-800/30'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">{msg.name}</h3>
                  <p className="text-sm text-gray-400">{msg.email}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(msg.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-300 border-r-4 border-brand-cyan pl-4 py-2 bg-[#1a1a1a] rounded-l pr-2">
                {msg.message}
              </div>
              <div className="mt-4 flex space-x-4 space-x-reverse">
                {!msg.read && (
                  <button onClick={() => handleMarkAsRead(msg.id)} className="text-brand-cyan hover:text-cyan-400 text-sm font-medium transition-colors">
                    تحديد كمقروءة
                  </button>
                )}
                <button onClick={() => handleDelete(msg.id)} className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
                  حذف
                </button>
              </div>
            </li>
          ))}
        </ul>
        {messages.length === 0 && <div className="p-6 text-center text-gray-500">لا توجد رسائل واردة.</div>}
      </div>
    </div>
  );
}
