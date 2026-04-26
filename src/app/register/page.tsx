'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';
import { useLanguage } from '@/hooks/useLanguage';
import { redirectForRole } from '@/hooks/useSession';
import FormInput from '@/components/ui/FormInput';

type Role = 'buyer' | 'seller';

export default function RegisterPage() {
  const { translate: t } = useLanguage();
  const router = useRouter();
  const [role, setRole] = useState<Role>('buyer');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.firstName) e.firstName = t('register.error_first_name');
    if (!formData.lastName) e.lastName = t('register.error_last_name');
    if (!formData.email) e.email = t('register.error_email');
    if (!formData.phone) e.phone = t('register.error_phone');
    if (!formData.password) e.password = t('register.error_password');
    else if (formData.password.length < 8) e.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(formData.password)) e.password = 'Must contain an uppercase letter';
    else if (!/[a-z]/.test(formData.password)) e.password = 'Must contain a lowercase letter';
    else if (!/[0-9]/.test(formData.password)) e.password = 'Must contain a number';
    if (formData.password !== formData.confirmPassword) {
      e.confirmPassword = t('register.error_confirm_password');
    }
    if (role === 'seller' && !formData.businessName) {
      e.businessName = t('register.error_business_name');
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          company: formData.businessName,
          role,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data?.error?.message ?? t('register.error_submit');
        const fieldErrors = data?.error?.details as Record<string, string[]> | undefined;
        const mapped: Record<string, string> = {};
        if (fieldErrors) {
          for (const [k, v] of Object.entries(fieldErrors)) {
            if (v?.[0]) mapped[k] = v[0];
          }
        }
        setErrors({ submit: msg, ...mapped });
        toast.error(msg);
        return;
      }
      toast.success('Account created — welcome!');
      router.push(redirectForRole(data.user.role));
      router.refresh();
    } catch {
      toast.error(t('register.error_submit'));
      setErrors({ submit: t('register.error_submit') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const ne = { ...prev };
        delete ne[field];
        return ne;
      });
    }
  };

  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="container max-w-640px mx-auto">
        <div className="mb-10">
          <span className="eyebrow">{t('register.eyebrow')}</span>
          <h1 className="font-headline text-display-sm text-on-surface mt-5 mb-3 font-bold">
            {t('register.title')}
          </h1>
          <p className="text-body-sm text-on-surface-variant">
            {t('register.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-surface-container-lowest p-8" noValidate>
          {/* Role selector */}
          <div>
            <label className="form-label mb-3 block">I am a…</label>
            <div className="grid grid-cols-2 gap-3">
              {(['buyer', 'seller'] as Role[]).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`p-5 border-2 text-left transition-all ${
                    role === r
                      ? 'border-primary bg-primary bg-opacity-5'
                      : 'border-outline-variant hover:border-primary'
                  }`}
                >
                  <Icon
                    icon={r === 'buyer' ? 'mdi:briefcase-search' : 'mdi:storefront'}
                    style={{ width: '28px', height: '28px' }}
                    className={role === r ? 'text-primary' : 'text-on-surface-variant'}
                  />
                  <div className="font-headline font-bold text-on-surface mt-2 capitalize">
                    {r}
                  </div>
                  <p className="text-label-xs text-on-surface-variant mt-1">
                    {r === 'buyer'
                      ? 'Browse & acquire verified businesses'
                      : 'List your business for sale or rent'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormInput
              label={t('register.first_name')}
              placeholder={t('register.first_name_placeholder')}
              value={formData.firstName}
              onChange={(v) => handleChange('firstName', v)}
              error={errors.firstName}
              required
            />
            <FormInput
              label={t('register.last_name')}
              placeholder={t('register.last_name_placeholder')}
              value={formData.lastName}
              onChange={(v) => handleChange('lastName', v)}
              error={errors.lastName}
              required
            />
          </div>

          <FormInput
            label={t('common.email')}
            type="email"
            placeholder="you@company.com"
            value={formData.email}
            onChange={(v) => handleChange('email', v)}
            error={errors.email}
            required
          />

          <FormInput
            label={t('register.phone')}
            type="tel"
            placeholder={t('register.phone_placeholder')}
            value={formData.phone}
            onChange={(v) => handleChange('phone', v)}
            error={errors.phone}
            required
          />

          <FormInput
            label={role === 'seller' ? t('register.business_name') : 'Company (optional)'}
            placeholder={t('register.business_name_placeholder')}
            value={formData.businessName}
            onChange={(v) => handleChange('businessName', v)}
            error={errors.businessName}
            required={role === 'seller'}
          />

          <FormInput
            label={t('common.password')}
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(v) => handleChange('password', v)}
            error={errors.password}
            required
          />

          <FormInput
            label={t('register.confirm_password')}
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(v) => handleChange('confirmPassword', v)}
            error={errors.confirmPassword}
            required
          />

          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 mt-1 accent-primary" required />
            <span className="text-body-sm text-on-surface-variant">
              {t('register.agree_prefix')}{' '}
              <Link href="/legal-hub#terms" className="text-on-surface underline hover:text-primary">
                {t('register.terms')}
              </Link>{' '}
              {t('register.and')}{' '}
              <Link href="/legal-hub#privacy" className="text-on-surface underline hover:text-primary">
                {t('register.privacy')}
              </Link>
            </span>
          </label>

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
            {isSubmitting ? t('register.creating_account') : t('register.submit')}
          </button>

          <p className="text-center text-body-sm text-on-surface-variant">
            {t('register.already_have')}{' '}
            <Link href="/sign-in" className="text-on-surface font-semibold underline hover:text-primary">
              {t('register.sign_in_link')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
