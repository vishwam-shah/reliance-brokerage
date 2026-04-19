'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useLanguage } from '@/hooks/useLanguage';
import Button from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';

export default function RegisterPage() {
  const { translate: t } = useLanguage();
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.businessName) newErrors.businessName = 'Business name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('Register:', formData);
        // In production: redirect to sign-in or dashboard
      } catch (error) {
        setErrors({ submit: 'Registration failed. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-surface pt-20 pb-12">
      <div className="container max-w-640px mx-auto">
        <div className="mb-10">
          <span className="eyebrow">Create Your Account</span>
          <h1 className="font-headline text-display-sm text-on-surface mt-5 mb-3 font-bold">
            List Your Business
          </h1>
          <p className="text-body-sm text-on-surface-variant">
            Join Malaysia's premier business marketplace. Confidential, secure, and
            institutional-grade.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-surface-container-lowest p-8">
          <div className="grid grid-cols-2 gap-6">
            <FormInput
              label="First Name"
              placeholder="John"
              value={formData.firstName}
              onChange={(value) => handleChange('firstName', value)}
              error={errors.firstName}
              required
            />
            <FormInput
              label="Last Name"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(value) => handleChange('lastName', value)}
              error={errors.lastName}
              required
            />
          </div>

          <FormInput
            label={t('common.email')}
            type="email"
            placeholder="you@company.com"
            value={formData.email}
            onChange={(value) => handleChange('email', value)}
            error={errors.email}
            required
          />

          <FormInput
            label="Phone Number"
            type="tel"
            placeholder="+60 12 345 6789"
            value={formData.phone}
            onChange={(value) => handleChange('phone', value)}
            error={errors.phone}
            required
          />

          <FormInput
            label="Business Name"
            placeholder="Your Company Ltd."
            value={formData.businessName}
            onChange={(value) => handleChange('businessName', value)}
            error={errors.businessName}
            required
          />

          <FormInput
            label={t('common.password')}
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(value) => handleChange('password', value)}
            error={errors.password}
            required
          />

          <FormInput
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(value) => handleChange('confirmPassword', value)}
            error={errors.confirmPassword}
            required
          />

          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 mt-1 accent-primary" required />
            <span className="text-body-sm text-on-surface-variant">
              I agree to the{' '}
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
            </span>
          </label>

          {errors.submit && (
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
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>

          <p className="text-center text-body-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link
              href="/sign-in"
              className="text-on-surface font-semibold underline hover:text-primary"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
