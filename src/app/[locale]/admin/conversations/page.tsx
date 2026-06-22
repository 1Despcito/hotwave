"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Trash2, Globe, Clock, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  sessionId: string;
  messages: Message[];
  language: string | null;
  pageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

const LANG_LABELS: Record<string, string> = {
  ar: "🇪🇬 عربي",
  en: "🇬🇧 English",
  ru: "🇷🇺 Russian",
  fr: "🇫🇷 French",
};

export default function ConversationsAdminPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/conversations");
      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch {
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConversations(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this conversation?")) return;
    setDeleting(id);
    await fetch("/api/admin/conversations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setConversations((prev) => prev.filter((c) => c.id !== id));
    setDeleting(null);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleString("en-US", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-[#050505] p-6 md:p-10" dir="ltr">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
              <MessageSquare className="w-6 h-6" />
            </span>
            Customer Conversations
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {conversations.length} recorded sessions
          </p>
        </div>
        <button
          onClick={fetchConversations}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-gray-800 text-gray-400 hover:text-white hover:border-orange-500/40 transition-all text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Conversations List */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-24">
          <MessageSquare className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500">No conversations yet</p>
          <p className="text-gray-600 text-sm mt-1">They will appear here once customers interact with the bot</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {conversations.map((conv) => {
            const msgCount = Array.isArray(conv.messages) ? conv.messages.length : 0;
            const firstUserMsg = Array.isArray(conv.messages)
              ? conv.messages.find((m) => m.role === "user")?.content || ""
              : "";
            const isExpanded = expanded === conv.id;

            return (
              <motion.div
                key={conv.id}
                layout
                className="bg-[#0a0a0a] border border-gray-800 hover:border-orange-500/20 rounded-2xl overflow-hidden transition-colors"
              >
                {/* Conversation Header */}
                <div
                  className="p-5 cursor-pointer flex items-center gap-4"
                  onClick={() => setExpanded(isExpanded ? null : conv.id)}
                >
                  {/* Avatar */}
                  <div className="w-11 h-11 shrink-0 rounded-full bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {(conv.language === 'ar' ? '🇪🇬' : conv.language === 'en' ? '🇬🇧' : conv.language === 'ru' ? '🇷🇺' : '🌍')}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/20 font-mono">
                        {conv.sessionId.slice(-12)}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {msgCount} messages
                      </span>
                      {conv.language && (
                        <span className="text-xs text-gray-500">
                          {LANG_LABELS[conv.language] || conv.language}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm truncate">
                      {firstUserMsg || <span className="text-gray-600 italic">No messages</span>}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(conv.updatedAt)}
                      </span>
                      {conv.pageUrl && (
                        <span className="flex items-center gap-1 truncate max-w-[200px]">
                          <Globe className="w-3 h-3 shrink-0" />
                          {conv.pageUrl.replace(/https?:\/\/[^/]+/, '')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(conv.id); }}
                      disabled={deleting === conv.id}
                      className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </div>

                {/* Messages Expanded */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gray-800/60 p-5 flex flex-col gap-3 max-h-[500px] overflow-y-auto"
                        style={{ background: 'rgba(0,0,0,0.3)' }}>
                        {Array.isArray(conv.messages) && conv.messages.map((msg, idx) => (
                          <div
                            key={msg.id || idx}
                            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}
                          >
                            <div className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold
                              ${msg.role === 'user'
                                ? 'bg-orange-600/20 text-orange-400 border border-orange-500/30'
                                : 'bg-gray-800 text-gray-400 border border-gray-700'
                              }`}
                            >
                              {msg.role === 'user' ? '👤' : '🤖'}
                            </div>
                            <div
                              className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                                ${msg.role === 'user'
                                  ? 'bg-orange-500/15 text-orange-100 border border-orange-500/20 rounded-br-sm'
                                  : 'bg-gray-800/60 text-gray-300 border border-gray-700/50 rounded-bl-sm'
                                }`}
                            >
                              {msg.content || '...'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
