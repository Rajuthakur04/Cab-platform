import React from 'react';
import { Phone } from 'lucide-react';

interface FloatingContactWidgetProps {
  phoneNumber?: string;
  whatsappMessage?: string;
}

export const FloatingContactWidget: React.FC<FloatingContactWidgetProps> = ({
  phoneNumber = '9308874698',
  whatsappMessage = 'Hii, I want to book the ride',
}) => {
  const callUrl = `tel:+91${phoneNumber}`;
  const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-7 z-50 flex flex-col items-end gap-3.5 select-none pointer-events-auto">
      {/* 1. Phone Call Floating Button */}
      <div className="group relative flex items-center">
        {/* Tooltip on Desktop hover */}
        <span className="hidden sm:inline-block pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 mr-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-sm text-white text-xs font-bold shadow-lg whitespace-nowrap">
          Call: +91 {phoneNumber}
        </span>

        <a
          href={callUrl}
          className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white flex items-center justify-center shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-orange-400/20"
          title={`Call Bihar Cabs at ${phoneNumber}`}
          aria-label="Direct Phone Call"
        >
          {/* Subtle glowing ring */}
          <span className="absolute inset-0 rounded-full bg-orange-400/30 animate-pulse pointer-events-none" />
          <Phone className="w-6 h-6 fill-current relative z-10" />
        </a>
      </div>

      {/* 2. WhatsApp Floating Button */}
      <div className="group relative flex items-center">
        {/* Tooltip on Desktop hover */}
        <span className="hidden sm:inline-block pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 mr-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-sm text-white text-xs font-bold shadow-lg whitespace-nowrap">
          WhatsApp: {phoneNumber}
        </span>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-xl shadow-emerald-600/40 hover:shadow-emerald-600/60 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-emerald-400/25"
          title="Chat on WhatsApp: Hii, I want to book the ride"
          aria-label="Chat on WhatsApp"
        >
          {/* Soft pulsing halo */}
          <span className="absolute -inset-1 rounded-full bg-emerald-400/30 animate-ping opacity-75 pointer-events-none" />

          {/* Official WhatsApp SVG Vector Icon */}
          <svg
            className="w-7 h-7 sm:w-8 sm:h-8 fill-current text-white relative z-10 drop-shadow-xs"
            viewBox="0 0 24 24"
          >
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.159.57 4.199 1.584 5.961l-1.584 5.867 6.073-1.592c1.71 1.002 3.708 1.564 5.927 1.564 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
      </div>
    </div>
  );
};
