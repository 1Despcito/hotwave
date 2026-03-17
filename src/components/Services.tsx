'use client';

import { motion } from 'framer-motion';
import { Sailboat, Map, Tent, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const services = [
  {
    title: 'Sea Trips',
    description: 'Explore the vibrant coral reefs, swim with dolphins, and relax on pristine islands.',
    icon: <Sailboat className="w-8 h-8 text-brand-cyan" />,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop',
    color: 'from-brand-cyan/20 to-transparent',
    emoji: '⛵',
  },
  {
    title: 'Safari Adventures',
    description: 'Conquer the desert dunes on a quad bike, visit Bedouin villages, and watch the sunset.',
    icon: <Map className="w-8 h-8 text-brand-orange" />,
    image: 'https://images.unsplash.com/photo-1548574505-12caf0050b5b?auto=format&fit=crop&q=80&w=1000',
    color: 'from-brand-orange/20 to-transparent',
    emoji: '🏜️',
  },
  {
    title: 'Horseback Riding',
    description: 'Ride along the beach or through the desert trails, suitable for all experience levels.',
    icon: <Tent className="w-8 h-8 text-yellow-500" />,
    image: 'https://images.unsplash.com/photo-1534142491173-0975608bfa79?auto=format&fit=crop&q=80&w=1000',
    color: 'from-yellow-500/20 to-transparent',
    emoji: '🐎',
  },
];

export default function Services() {
  return (
    <section className="py-24 bg-brand-navy-light relative overflow-hidden" id="services">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-cyan/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white"
          >
            Our Prime <span className="text-gradient">Adventures</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto font-sans text-lg"
          >
            Curated experiences to make your stay in Hurghada unforgettable. Choose your next thrill.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="group relative rounded-3xl overflow-hidden bg-brand-navy border border-gray-800 hover:border-brand-orange/50 transition-colors shadow-lg"
            >
              {/* Card Image */}
              <div className="relative h-64 w-full overflow-hidden">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md rounded-full w-12 h-12 flex items-center justify-center text-2xl border border-white/10">
                  {service.emoji}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-8 relative">
                <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="mb-4 bg-brand-navy-light w-16 h-16 rounded-2xl flex items-center justify-center border border-gray-700 shadow-inner">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold font-heading mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-orange group-hover:to-brand-cyan transition-all">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 font-sans leading-relaxed mb-6">
                    {service.description}
                  </p>
                  
                  <button className="text-brand-cyan font-semibold flex items-center gap-2 group/btn">
                    Discover More
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
