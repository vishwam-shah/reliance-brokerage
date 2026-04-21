'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';
import { useLanguage } from '@/hooks/useLanguage';
import { redirectForRole } from '@/hooks/useSession';
import FormInput from '@/components/ui/FormInput';

export default function SignInClient() {
  const { translate: t } = useLanguage();
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = t('sign_in.error_email');
    if (!password) newErrors.password = t('sign_in.error_password');
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data?.error?.message ?? t('sign_in.error_invalid');
        toast.error(msg);
        setErrors({ submit: msg });
        return;
      }
      toast.success(`Welcome back, ${data.user.name}`);
      const redirect = search.get('redirect');
      router.push(redirect ?? redirectForRole(data.user.role));
      router.refresh();
    } catch {
      toast.error(t('sign_in.error_connection'));
      setErrors({ submit: t('sign_in.error_connection') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      <div className="hidden lg:flex bg-primary relative overflow-hidden items-center justify-center p-24">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=60"
            alt="Decorative background"
            fill
            className="object-cover"
            sizes="50vw"
          />
        </div>
        <div className="relative z-10 max-w-480px text-center">
          <Link href="/" className="inline-flex items-center gap-3 mb-12">
            <Image src="/logo.jpeg" alt="Reliance Brokerage" width={44} height={44} className="rounded-md" />
            <div className="font-headline text-headline-lg font-bold text-on-primary">
              Reliance Brokerage
            </div>
          </Link>
          <h1 className="font-headline text-4xl md:text-5xl text-on-primary font-light mb-8 leading-tight">
            {t('sign_in.headline')}
            <br />
            <em className="italic font-light">{t('sign_in.headline_em')}</em>
          </h1>
          <p className="text-body-lg text-on-primary opacity-90 leading-relaxed mb-16">
            {t('sign_in.panel_desc')}
          </p>
          <div className="flex flex-col gap-5">
            {[
              { icon: 'mdi:verified-user', key: 'badge1' },
              { icon: 'mdi:eye-off', key: 'badge2' },
              { icon: 'mdi:shield', key: 'badge3' },
            ].map(({ icon, key }) => (
              <div key={key} className="flex items-center gap-4">
                <Icon icon={icon} className="text-accent flex-shrink-0" style={{ width: '48px', height: '48px' }} />
                <span className="font-label text-label-sm text-on-primary opacity-75 uppercase tracking-widest">
                  {t(`sign_in.${key}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 md:p-16 bg-surface">
        <div className="w-full max-w-440px">
          <div className="lg:hidden mb-10">
            <Link href="/" className="nav-brand flex items-center gap-2">
              <Image src="/logo.jpeg" alt="Reliance Brokerage" width={36} height={36} className="rounded-md" />
              <span>Reliance Brokerage</span>
            </Link>
          </div>

          <div className="mb-10">
            <span className="eyebrow">{t('sign_in.eyebrow')}</span>
            <h2 className="font-headline text-display-sm text-on-surface mt-5 mb-3 font-bold">
              {t('sign_in.title')}
            </h2>
            <p className="text-body-sm text-on-surface-variant">
              {t('sign_in.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
            <FormInput
              label={t('common.email')}
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={setEmail}
              error={errors.email}
              required
            />

            <div className="form-group">
              <div className="flex justify-between items-baseline mb-2">
                <label className="form-label">{t('common.password')}</label>
                <Link
                  href="/forgot-password"
                  className="font-label text-label-xs text-on-surface-variant underline hover:text-on-surface"
                >
                  {t('sign_in.forgot_password')}
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input pr-12"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-invalid={!!errors.password}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer p-0"
                  aria-label="Toggle password visibility"
                >
                  <Icon
                    icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'}
                    className="text-outline"
                    style={{ width: '24px', height: '24px' }}
                  />
                </button>
              </div>
              {errors.password && (
                <span className="text-error text-label-sm mt-1">{errors.password}</span>
              )}
            </div>

            {errors.submit && (
              <div className="bg-error-container bg-opacity-10 border-l-4 border-error p-4 text-body-sm text-error rounded-none">
                <div className="flex gap-3">
                  <Icon icon="mdi:alert-circle" className="text-error flex-shrink-0" style={{ width: '20px', height: '20px' }} />
                  <span>{errors.submit}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? t('sign_in.signing_in') : t('common.sign_in_button')}
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-black bg-opacity-20" />
              <span className="font-label text-label-xs text-on-surface-variant uppercase tracking-widest whitespace-nowrap">
                {t('sign_in.or_divider')}
              </span>
              <div className="flex-1 h-px bg-black bg-opacity-20" />
            </div>

            <Link href="/register" className="btn btn-secondary w-full text-center">
              {t('common.register_button')}
            </Link>
          </form>

          <p className="mt-8 text-label-xs text-on-surface-variant text-center leading-relaxed">
            {t('sign_in.terms_prefix')}{' '}
            <Link href="/legal-hub#terms" className="text-on-surface underline hover:text-primary">
              {t('sign_in.terms_link')}
            </Link>{' '}
            {t('sign_in.and')}{' '}
            <Link href="/legal-hub#privacy" className="text-on-surface underline hover:text-primary">
              {t('sign_in.privacy_link')}
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
