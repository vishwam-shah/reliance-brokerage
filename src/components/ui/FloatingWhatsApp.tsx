'use client';

import { Icon } from '@iconify/react';

const WHATSAPP_NUMBER = '60142642414';

const FloatingWhatsApp = () => {
  const msg = 'Hello Reliance Brokerage, I have an enquiry about your services.';
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-toast w-14 h-14 bg-[#25D366] flex items-center justify-center shadow-modal hover:scale-110 transition-transform"
      style={{ borderRadius: '50%' }}
    >
      <Icon icon="mdi:whatsapp" className="text-white" style={{ width: '32px', height: '32px' }} />
    </a>
  );
};

export default FloatingWhatsApp;
