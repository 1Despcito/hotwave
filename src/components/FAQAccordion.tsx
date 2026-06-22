"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
};

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div 
            key={index} 
            className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${isOpen ? 'bg-[#111111] border-brand-orange/50 shadow-lg' : 'bg-black/40 border-gray-800 hover:border-gray-700'}`}
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
              <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-brand-orange' : 'text-white'}`}>
                {item.question}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isOpen ? 'bg-brand-orange/20 text-brand-orange' : 'bg-white/5 text-gray-400'}`}
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-6 pb-6 text-gray-400 leading-relaxed font-sans">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
