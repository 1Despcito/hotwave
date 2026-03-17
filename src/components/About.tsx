'use client';

import { motion } from 'framer-motion';
import { Compass, Shield, Users, Camera } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    icon: <Compass className="w-6 h-6 text-brand-cyan" />,
    title: 'Expert Guides',
    description: 'Local professionals who know every hidden gem in the Red Sea and desert.',
  },
  {
    icon: <Shield className="w-6 h-6 text-brand-orange" />,
    title: 'Top Safety Standards',
    description: 'We prioritize your well-being with well-maintained equipment and protocols.',
  },
  {
    icon: <Users className="w-6 h-6 text-yellow-500" />,
    title: 'Small Groups',
    description: 'Intimate groups ensuring you get a personalized and uncrowded experience.',
  },
  {
    icon: <Camera className="w-6 h-6 text-green-400" />,
    title: 'Memorable Moments',
    description: 'We capture the best moments so focused only on enjoying the ride.',
  },
];

export default function About() {
  return (
    <section className="py-24 bg-brand-navy relative overflow-hidden" id="about">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Grid */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-cyan/10 rounded-full blur-[100px] -z-10" />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="relative h-64 rounded-3xl overflow-hidden shadow-2xl shadow-brand-cyan/20">
                  <Image 
                    src="https://images.unsplash.com/photo-1548574505-12caf0050b5b?auto=format&fit=crop&q=80&w=1000" 
                    alt="Snorkeling in Hurghada" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="relative h-48 rounded-3xl overflow-hidden shadow-2xl shadow-brand-orange/20">
                  <Image 
                    src="https://images.unsplash.com/photo-1534142491173-0975608bfa79?auto=format&fit=crop&q=80&w=1000" 
                    alt="Desert Safari" 
                    fill 
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative h-48 rounded-3xl overflow-hidden shadow-2xl shadow-brand-orange/20">
                  <Image 
                    src="https://images.unsplash.com/photo-1598282361136-2182bece71d1?auto=format&fit=crop&q=80&w=1000" 
                    alt="Sunset over water" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="relative h-64 rounded-3xl overflow-hidden bg-brand-navy-light border border-gray-800 p-6 flex flex-col justify-center">
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-cyan mb-2">10+</div>
                  <div className="text-white font-heading text-xl">Years of Adventures</div>
                  <p className="text-gray-400 mt-2 font-sans text-sm">Crafting perfect memories for thousands of happy travelers.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white">
              Why <span className="text-gradient">Hot Wave</span>?
            </h2>
            <p className="text-gray-300 font-sans text-lg mb-10 leading-relaxed">
              Based in the heart of Hurghada, Hot Wave isn&apos;t just another tourism company. We are a family of ocean lovers, desert wanderers, and adventure seekers dedicated to showing you the authentic beauty of the Red Sea coast.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4 items-start group">
                  <div className="w-12 h-12 rounded-2xl bg-brand-navy-light flex items-center justify-center shrink-0 border border-gray-800 group-hover:border-gray-600 transition-colors">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-bold font-heading mb-2 text-lg group-hover:text-brand-cyan transition-colors">{feature.title}</h4>
                    <p className="text-gray-400 font-sans text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-12 px-8 py-4 bg-brand-navy-light text-white font-semibold rounded-full border border-gray-700 hover:border-brand-orange transition-colors inline-block"
            >
              Learn More About Us
            </motion.button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
