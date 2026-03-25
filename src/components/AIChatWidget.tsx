// @ts-nocheck
"use client";

import { useChat } from "@ai-sdk/react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

export default function AIChatWidget({ locale = 'ar' }: { locale?: string }) {
  const t = useTranslations('Chat');
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, status, error } = useChat({
    api: "/api/chat",
  });
  const [localInput, setLocalInput] = useState("");
  const isLoading = status === "submitted" || status === "streaming";

  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed bottom-6 rtl:right-6 rtl:left-auto ltr:left-6 ltr:right-auto z-50">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes wave-spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }
        `}} />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative group w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,107,0,0.6)] hover:shadow-[0_0_50px_rgba(255,107,0,0.8)] transition-shadow duration-500 overflow-hidden"
          aria-label="مساعد الذكاء الاصطناعي"
        >
          {/* Base gradient matching the image */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#ff602a] via-[#e58a69] to-[#60a5fa]" />
          
          {/* 3D Wave Animations inside the sphere */}
          {!isOpen && (
            <>
              {/* Wave 1 */}
              <div 
                className="absolute top-1/2 left-1/2 w-[250%] h-[250%] opacity-40 mix-blend-overlay"
                style={{
                  background: 'linear-gradient(transparent 30%, rgba(255,255,255,0.8) 50%, transparent 70%)',
                  borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
                  animation: 'wave-spin 6s linear infinite'
                }}
              />
              {/* Wave 2 */}
              <div 
                className="absolute top-1/2 left-1/2 w-[200%] h-[200%] opacity-30 mix-blend-screen"
                style={{
                  background: 'linear-gradient(transparent 40%, #fff 50%, transparent 60%)',
                  borderRadius: '60% 40% 30% 70% / 50% 60% 40% 50%',
                  animation: 'wave-spin 4s linear infinite reverse'
                }}
              />
              {/* Inner 3D Highlight */}
              <div className="absolute inset-0 rounded-full shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.2),inset_10px_10px_20px_rgba(255,255,255,0.4)]" />
            </>
          )}

          {/* Inner Content */}
          <div className="relative z-10 font-bold text-white text-center leading-tight tracking-wider" style={{ fontFamily: 'var(--font-inter), sans-serif', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            {isOpen ? (
              <X size={32} className="drop-shadow-lg" />
            ) : (
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-12 h-12 object-contain filter drop-shadow-md" 
              />
            )}
          </div>
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-24 left-6 w-[340px] sm:w-[400px] h-[550px] max-h-[80vh] bg-white/80 backdrop-blur-2xl rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.2)] border border-white/40 flex flex-col overflow-hidden z-50"
            dir="rtl"
          >
            {/* Header */}
            <div className="relative p-5 bg-gradient-to-r from-blue-600/90 to-cyan-500/90 text-white flex justify-between items-center backdrop-blur-md border-b border-white/10 shrink-0">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
              <div className="relative z-10">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-cyan-200" />
                  <h3 className="font-bold text-lg tracking-tight">{t('title')}</h3>
                </div>
                <p className="text-blue-100 text-xs mt-1 font-medium bg-black/10 inline-block px-2 py-0.5 rounded-full">{t('subtitle')}</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="relative z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-5 overflow-y-auto bg-slate-50/50 flex flex-col gap-4 scroll-smooth">
              {messages.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-12 flex flex-col items-center gap-3"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                    <MessageCircle size={32} />
                  </div>
                  <p className="text-slate-500 text-sm max-w-[200px] leading-relaxed">
                    {t('welcome')}<br />{t('welcome_sub')}
                  </p>
                </motion.div>
              )}
              
              {messages.map((m) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  key={m.id}
                  className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    m.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white self-end rounded-br-sm"
                      : "bg-white border border-slate-100 text-slate-700 self-start rounded-bl-sm"
                  }`}
                >
                  {m.content || (m.parts ? m.parts.map((p: any) => p.text || '').join('') : '') || '...'}
                </motion.div>
              ))}
              
              {isLoading && !error && (
                <div className="bg-white border border-slate-100 text-slate-500 self-start rounded-2xl rounded-bl-sm shadow-sm p-4 text-sm flex gap-1.5 items-center">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }} className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 self-start rounded-2xl p-4 text-xs font-mono shadow-sm max-w-[85%] break-words">
                  خطأ في الخادم: {error?.message || String(error)}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/90 backdrop-blur-md border-t border-slate-100/80 shrink-0">
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!localInput.trim() || isLoading) return;
                const content = localInput;
                setLocalInput("");
                await sendMessage({ role: "user", content });
              }} className="relative flex items-center">
                <input
                  name="prompt"
                  value={localInput}
                  onChange={(e) => setLocalInput(e.target.value)}
                  placeholder={t('placeholder')}
                  className="w-full bg-slate-100/80 border border-slate-200/60 rounded-full pl-12 pr-5 py-3.5 text-sm text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-inner"
                />
                <button
                  type="submit"
                  disabled={isLoading || !localInput.trim()}
                  className="absolute left-1.5 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                >
                  <Send size={18} className="rtl:rotate-180 -ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
