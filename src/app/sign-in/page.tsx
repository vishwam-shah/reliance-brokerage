'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useLanguage } from '@/hooks/useLanguage';
import Button from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';

export default function SignInPage() {
  const { translate: t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      setSubmitStatus('idle');

      try {
        // Simulate API call with delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock validation - in production, call actual API
        if (email && password.length >= 6) {
          setSubmitStatus('success');
          // In production: redirect to dashboard or store auth token
          console.log('Sign in successful:', { email });
        } else {
          setSubmitStatus('error');
          setErrors({ submit: 'Invalid email or password' });
        }
      } catch (error) {
        setSubmitStatus('error');
        setErrors({ submit: 'Connection error. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      {/* Left: Editorial Branding */}
      <div className="hidden lg:flex bg-primary relative overflow-hidden items-center justify-center p-24">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=60"
            alt="Decorative background - institutional office architecture"
            fill
            className="object-cover"
            sizes="50vw"
          />
        </div>

        <div className="relative z-10 max-w-480px text-center">
          <Link href="/" className="inline-block mb-12">
            <div className="font-headline text-headline-lg font-bold text-on-primary">
              Reliance Brokerage
            </div>
          </Link>
          <h1 className="font-headline text-4xl md:text-5xl text-on-primary font-light mb-8 leading-tight">
            Institutional Access.
            <br />
            <em className="italic font-light">Absolute Privacy.</em>
          </h1>
          <p className="text-body-lg text-on-primary opacity-90 leading-relaxed mb-16">
            Your portal to Malaysia's most exclusive business acquisition network. Complete
            discretion, institutional-grade security.
          </p>

          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <Icon
                icon="mdi:verified-user"
                className="text-accent flex-shrink-0"
                style={{ width: '48px', height: '48px' }}
              />
              <span className="font-label text-label-sm text-on-primary opacity-75 uppercase tracking-widest">
                Bank-Grade Encryption
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Icon
                icon="mdi:eye-off"
                className="text-accent flex-shrink-0"
                style={{ width: '48px', height: '48px' }}
              />
              <span className="font-label text-label-sm text-on-primary opacity-75 uppercase tracking-widest">
                Ironclad Confidentiality
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Icon
                icon="mdi:shield"
                className="text-accent flex-shrink-0"
                style={{ width: '48px', height: '48px' }}
              />
              <span className="font-label text-label-sm text-on-primary opacity-75 uppercase tracking-widest">
                PDPA &amp; AML Compliant
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Sign In Form */}
      <div className="flex items-center justify-center p-8 md:p-16 bg-surface">
        <div className="w-full max-w-440px">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10">
            <Link href="/" className="nav-brand">
              Reliance Brokerage
            </Link>
          </div>

          <div className="mb-10">
            <span className="eyebrow">Institutional Portal</span>
            <h2 className="font-headline text-display-sm text-on-surface mt-5 mb-3 font-bold">
              Welcome Back
            </h2>
            <p className="text-body-sm text-on-surface-variant">
              Sign in to your account to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                <label className="form-label">Password</label>
                <Link
                  href="/forgot-password"
                  className="font-label text-label-xs text-on-surface-variant underline hover:text-on-surface"
                >
                  Forgot password?
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

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-primary"
                defaultChecked
              />
              <span className="text-body-sm text-on-surface-variant">
                Keep me signed in for 30 days
              </span>
            </label>

            {submitStatus === 'error' && errors.submit && (
              <div className="bg-error-container bg-opacity-10 border-l-4 border-error p-4 text-body-sm text-error rounded-none">
                <div className="flex gap-3">
                  <Icon
                    icon="mdi:alert-circle"
                    className="text-error flex-shrink-0"
                    style={{ width: '20px', height: '20px' }}
                  />
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
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin inline-block">⏳</span>
                  Signing in...
                </span>
              ) : submitStatus === 'success' ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon
                    icon="mdi:check-circle"
                    style={{ width: '20px', height: '20px' }}
                  />
                  Success! Redirecting...
                </span>
              ) : (
                t('common.sign_in_button')
              )}
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-black bg-opacity-20" />
              <span className="font-label text-label-xs text-on-surface-variant uppercase tracking-widest whitespace-nowrap">
                or
              </span>
              <div className="flex-1 h-px bg-black bg-opacity-20" />
            </div>

            <Link
              href="/register"
              className="btn btn-secondary w-full text-center"
            >
              {t('common.register_button')}
            </Link>
          </form>

          <p className="mt-8 text-label-xs text-on-surface-variant text-center leading-relaxed">
            By signing in, you agree to the{' '}
            <Link
              href="/legal-hub#terms"
              className="text-on-surface underline hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/legal-hub#privacy"
              className="text-on-surface underline hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
