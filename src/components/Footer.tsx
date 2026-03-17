import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-navy border-t border-gray-800 pt-16 pb-8">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold font-heading mb-4 text-white">
              HOT <span className="text-brand-orange">WAVE</span>
            </h3>
            <p className="text-gray-400 font-sans leading-relaxed mb-6">
              Your premier partner for unforgettable tourism experiences in Hurghada, Egypt.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-brand-navy-light text-gray-400 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors border border-gray-800">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-brand-navy-light text-gray-400 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors border border-gray-800">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-brand-navy-light text-gray-400 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors border border-gray-800">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3 font-sans text-gray-400">
              <li><a href="#" className="hover:text-brand-cyan transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-brand-cyan transition-colors">Our Services</a></li>
              <li><a href="#" className="hover:text-brand-cyan transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-brand-cyan transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-6">Adventures</h4>
            <ul className="space-y-3 font-sans text-gray-400">
              <li><a href="#" className="hover:text-brand-orange transition-colors">Sea Trips</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Desert Safari</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Horseback Riding</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">City Tours</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4 font-sans text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />
                <span>Sheraton Road, Hurghada, Red Sea Governorate, Egypt</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-cyan shrink-0" />
                <span>+20 123 456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-cyan shrink-0" />
                <span>info@hotwave-eg.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between text-gray-500 font-sans text-sm">
          <p>&copy; {new Date().getFullYear()} Hot Wave Tourism. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
