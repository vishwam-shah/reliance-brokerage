'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useLanguage } from '@/hooks/useLanguage';

const WHATSAPP_NUMBER = '60142642414';
const EMAIL = 'contactus@reliance-brokerage.com';
const FACEBOOK_URL = 'https://www.facebook.com/share/1AzzSAjE4m/';

export default function ContactPage() {
  const { translate: t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hello Reliance Brokerage,\n\nNew Enquiry:\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nMessage:\n${form.message}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-surface pt-24 pb-20">
      <div className="container max-w-4xl">
        <div className="mb-16">
          <span className="eyebrow">{t('contact.eyebrow')}</span>
          <h1 className="font-headline text-display-lg font-bold text-on-surface mt-5 mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            {t('contact.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-headline text-headline-sm font-bold text-on-surface mb-6">
                {t('contact.direct_contact')}
              </h2>
              <div className="space-y-4">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-surface-container-lowest border border-outline-variant hover:border-accent transition-colors group"
                >
                  <div className="w-12 h-12 bg-[#25D366] flex items-center justify-center flex-shrink-0">
                    <Icon icon="mdi:whatsapp" className="text-white" style={{ width: '24px', height: '24px' }} />
                  </div>
                  <div>
                    <p className="font-label font-bold text-label-sm text-on-surface-variant uppercase tracking-widest mb-1">WhatsApp</p>
                    <p className="font-headline font-bold text-on-surface group-hover:text-accent transition-colors">+60 14-264 2414</p>
                  </div>
                </a>

                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center gap-4 p-4 bg-surface-container-lowest border border-outline-variant hover:border-accent transition-colors group"
                >
                  <div className="w-12 h-12 bg-primary flex items-center justify-center flex-shrink-0">
                    <Icon icon="mdi:email" className="text-on-primary" style={{ width: '24px', height: '24px' }} />
                  </div>
                  <div>
                    <p className="font-label font-bold text-label-sm text-on-surface-variant uppercase tracking-widest mb-1">Email</p>
                    <p className="font-headline font-bold text-on-surface group-hover:text-accent transition-colors break-all">{EMAIL}</p>
                  </div>
                </a>

                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-surface-container-lowest border border-outline-variant hover:border-accent transition-colors group"
                >
                  <div className="w-12 h-12 bg-[#1877F2] flex items-center justify-center flex-shrink-0">
                    <Icon icon="mdi:facebook" className="text-white" style={{ width: '24px', height: '24px' }} />
                  </div>
                  <div>
                    <p className="font-label font-bold text-label-sm text-on-surface-variant uppercase tracking-widest mb-1">Facebook</p>
                    <p className="font-headline font-bold text-on-surface group-hover:text-accent transition-colors">Reliance Brokerage Sales & Negotiator</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-surface-container-lowest border-l-4 border-accent p-6">
              <h3 className="font-headline font-bold text-on-surface mb-2">{t('contact.response_title')}</h3>
              <p className="text-body-sm text-on-surface-variant">{t('contact.response_desc')}</p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="font-headline text-headline-sm font-bold text-on-surface mb-6">
              {t('contact.send_enquiry')}
            </h2>
            {submitted ? (
              <div className="bg-surface-container-lowest p-10 text-center border border-outline-variant">
                <Icon icon="mdi:check-circle" className="text-success mx-auto mb-4" style={{ width: '48px', height: '48px' }} />
                <h3 className="font-headline text-title-lg font-bold text-on-surface mb-2">{t('contact.success_title')}</h3>
                <p className="text-body-sm text-on-surface-variant mb-6">{t('contact.success_desc')}</p>
                <button onClick={() => setSubmitted(false)} className="btn btn-ghost">{t('contact.send_another')}</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="form-group">
                  <label className="form-label">{t('contact.full_name')} <span className="text-error">*</span></label>
                  <input type="text" className="form-input" placeholder={t('contact.name_placeholder')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('contact.email')} <span className="text-error">*</span></label>
                  <input type="email" className="form-input" placeholder={t('contact.email_placeholder')} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('contact.phone')}</label>
                  <input type="tel" className="form-input" placeholder={t('contact.phone_placeholder')} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('contact.message')} <span className="text-error">*</span></label>
                  <textarea className="form-input min-h-[120px] resize-y" placeholder={t('contact.message_placeholder')} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-primary w-full">
                  <Icon icon="mdi:whatsapp" style={{ width: '18px', height: '18px' }} className="mr-2" />
                  {t('contact.send_button')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
