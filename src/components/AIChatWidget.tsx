// @ts-nocheck
"use client";

import { useChat } from "@ai-sdk/react";
import { X, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";

const STORAGE_KEY = "hotwave_chat_messages";
const SESSION_KEY = "hotwave_chat_session";

function getSessionId() {
  if (typeof window === 'undefined') return '';
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export default function AIChatWidget({ locale = 'ar' }: { locale?: string }) {
  const t = useTranslations('Chat');
  const [isOpen, setIsOpen] = useState(false);

  // Get sessionId via ref — evaluated on client render only
  const sidRef = useRef('');
  if (typeof window !== 'undefined' && !sidRef.current) {
    sidRef.current = getSessionId();
  }

  // Load persisted messages from localStorage (client-only)
  const [savedMessages] = useState(() => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  });

  const { messages, sendMessage, status, error, setMessages } = useChat({
    api: "/api/chat",
    initialMessages: savedMessages,
    headers: () => ({ 'x-session-id': sidRef.current }),
  });
  const [localInput, setLocalInput] = useState("");
  const isLoading = status === "submitted" || status === "streaming";
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persist messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bot-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fire-pulse {
          0%, 100% { box-shadow: 0 0 25px rgba(255, 107, 0, 0.5), 0 0 50px rgba(255, 60, 0, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 107, 0, 0.8), 0 0 80px rgba(255, 60, 0, 0.5); }
        }
        @keyframes ring-pulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        .bot-float { animation: bot-float 3s ease-in-out infinite; }
        .fire-glow { animation: fire-pulse 2s ease-in-out infinite; }
        .ring-anim::before, .ring-anim::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid rgba(255, 107, 0, 0.6);
          animation: ring-pulse 2s ease-out infinite;
        }
        .ring-anim::after { animation-delay: 1s; }
        .hw-scrollbar::-webkit-scrollbar { width: 4px; }
        .hw-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .hw-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,107,0,0.3); border-radius: 10px; }
      `}} />

      {/* Toggle Button */}
      <div className="fixed bottom-6 rtl:right-6 rtl:left-auto ltr:left-6 ltr:right-auto z-50">
        <div className="relative">
          {/* Pulse Rings (only when closed) */}
          {!isOpen && (
            <div className="ring-anim absolute inset-0 rounded-full pointer-events-none" />
          )}

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(!isOpen)}
            className={`relative w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-500 fire-glow overflow-visible ${!isOpen ? 'bot-float' : ''}`}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
            }}
            aria-label="مساعد الذكاء الاصطناعي"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#ff6200] to-[#cc3d00] flex items-center justify-center shadow-lg"
                >
                  <X size={30} className="text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="bot"
                  initial={{ scale: 0, rotate: 90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                  className="w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-orange-500/60 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #1a0a00, #2d1200)' }}
                >
                  <Image
                    src="/hotwave-bot.png"
                    alt="HotWave AI"
                    width={72}
                    height={72}
                    className="object-cover w-full h-full scale-110"
                    priority
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="fixed bottom-24 rtl:right-6 rtl:left-auto ltr:left-6 ltr:right-auto w-[340px] sm:w-[390px] h-[550px] max-h-[80vh] rounded-3xl overflow-hidden z-50 flex flex-col"
            style={{
              background: 'rgba(10, 8, 5, 0.95)',
              border: '1px solid rgba(255, 107, 0, 0.25)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,107,0,0.1)',
              backdropFilter: 'blur(20px)',
            }}
            dir="rtl"
          >
            {/* Decorative background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-orange-600/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-orange-800/10 blur-3xl" />
            </div>

            {/* Header */}
            <div className="relative shrink-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff4500] via-[#ff6200] to-[#ff8c00]" />
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)' }}
              />
              <div className="relative z-10 flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 shrink-0 rounded-full overflow-hidden border-2 border-white/30" style={{minWidth:'44px',minHeight:'44px',maxWidth:'44px',maxHeight:'44px'}}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/hotwave-bot.png"
                      alt="Bot"
                      style={{width:'44px',height:'44px',objectFit:'cover',objectPosition:'top center'}}
                    />
                    {/* Online indicator */}
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-orange-500 shadow" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight tracking-wide">
                      {t('title')}
                    </h3>
                    <p className="text-orange-100 text-[11px] mt-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
                      {t('subtitle')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto hw-scrollbar flex flex-col gap-3">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center justify-center h-full gap-4 text-center"
                >
                  <div className="w-20 h-20 relative">
                    <Image
                      src="/hotwave-bot.png"
                      alt="Bot"
                      width={80}
                      height={80}
                      className="object-contain drop-shadow-xl"
                    />
                  </div>
                  <div>
                    <p className="text-orange-300 font-semibold text-sm mb-1">{t('welcome')}</p>
                    <p className="text-gray-500 text-xs max-w-[200px] leading-relaxed">{t('welcome_sub')}</p>
                  </div>
                  {/* Quick Suggestions */}
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {['🌊 رحلات بحرية', '🏜️ سفاري', '🐴 ركوب خيل'].map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setLocalInput(s.slice(2).trim());
                        }}
                        className="px-3 py-1.5 text-xs rounded-full border border-orange-500/40 text-orange-300 hover:bg-orange-500/20 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((m) => (
                <motion.div
                  initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20, y: 5 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  key={m.id}
                  className={`max-w-[85%] text-sm leading-relaxed ${
                    m.role === "user"
                      ? "self-start"
                      : "self-end"
                  }`}
                >
                  {m.role === 'assistant' && (
                    <div className="flex items-end gap-2 flex-row-reverse">
                      <div className="w-7 h-7 shrink-0 rounded-full overflow-hidden border border-orange-500/40" style={{minWidth:'28px',minHeight:'28px',maxWidth:'28px',maxHeight:'28px'}}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/hotwave-bot.png" alt="" style={{width:'28px',height:'28px',objectFit:'cover',objectPosition:'top center'}} />
                      </div>
                      <div
                        className="p-4 rounded-3xl text-gray-200"
                        style={{ background: 'rgba(255,107,0,0.12)', border: '1px solid rgba(255,107,0,0.2)' }}
                      >
                        {m.content || (m.parts ? m.parts.map((p: any) => p.text || '').join('') : '') || '...'}
                      </div>
                    </div>
                  )}
                  {m.role === 'user' && (
                    <div
                      className="p-4 rounded-3xl text-white"
                      style={{ background: 'linear-gradient(135deg, #ff6200, #ff4500)' }}
                    >
                      {m.content || (m.parts ? m.parts.map((p: any) => p.text || '').join('') : '') || '...'}
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoading && !error && (
                <div className="self-end flex items-end gap-2 flex-row-reverse">
                  <div className="w-7 h-7 shrink-0 rounded-full overflow-hidden border border-orange-500/40" style={{minWidth:'28px',minHeight:'28px',maxWidth:'28px',maxHeight:'28px'}}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/hotwave-bot.png" alt="" style={{width:'28px',height:'28px',objectFit:'cover',objectPosition:'top center'}} />
                  </div>
                  <div
                    className="p-3.5 rounded-2xl rounded-bl-sm flex gap-1.5 items-center"
                    style={{ background: 'rgba(255,107,0,0.12)', border: '1px solid rgba(255,107,0,0.2)' }}
                  >
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 0.7, delay }}
                        className="w-2 h-2 rounded-full bg-orange-400"
                      />
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="text-red-400 text-xs p-3 rounded-xl border border-red-500/20 bg-red-500/10">
                  خطأ في الخادم: {error?.message || String(error)}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              className="shrink-0 p-3"
              style={{ borderTop: '1px solid rgba(255,107,0,0.15)', background: 'rgba(20,15,10,0.8)' }}
            >
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!localInput.trim() || isLoading) return;
                  const content = localInput;
                  setLocalInput("");
                  await sendMessage({ role: "user", content });
                }}
                className="flex items-center gap-2"
              >
                <input
                  name="prompt"
                  value={localInput}
                  onChange={(e) => setLocalInput(e.target.value)}
                  placeholder={t('placeholder')}
                  className="flex-1 rounded-full px-4 py-2.5 text-sm text-white outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,107,0,0.2)',
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid rgba(255,107,0,0.6)';
                    e.target.style.boxShadow = '0 0 15px rgba(255,107,0,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid rgba(255,107,0,0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isLoading || !localInput.trim()}
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #ff6200, #ff4500)',
                    boxShadow: localInput.trim() ? '0 4px 15px rgba(255,98,0,0.4)' : 'none'
                  }}
                >
                  <Send size={16} className="text-white rtl:rotate-180 -ml-0.5" />
                </motion.button>
              </form>
              <p className="text-center text-[10px] text-gray-600 mt-2">
                مدعوم بالذكاء الاصطناعي · Hot Wave 🔥
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
