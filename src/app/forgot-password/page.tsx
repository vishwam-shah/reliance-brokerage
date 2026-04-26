'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import Button from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    // Handle password reset logic here
    console.log('Reset password for:', email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-surface py-12 flex items-center justify-center">
      <div className="container max-w-520px">
        <div className="mb-12">
          <Link href="/" className="nav-brand">
            Reliance Brokerage
          </Link>
        </div>

        {!submitted ? (
          <>
            <div className="mb-10">
              <span className="eyebrow">Account Recovery</span>
              <h1 className="font-headline text-display-sm text-on-surface mt-5 mb-3 font-bold">
                Reset Your Password
              </h1>
              <p className="text-body-sm text-on-surface-variant">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-surface-container-lowest p-8">
              <FormInput
                label="Email Address"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={setEmail}
                error={error}
                required
              />

              <button type="submit" className="btn btn-primary w-full">
                Send Reset Instructions
              </button>

              <p className="text-center text-body-sm text-on-surface-variant">
                Remember your password?{' '}
                <Link
                  href="/sign-in"
                  className="text-on-surface font-semibold underline hover:text-primary"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </>
        ) : (
          <div className="bg-surface-container-lowest p-12 text-center">
            <div className="w-16 h-16 bg-success text-on-primary mx-auto mb-6 flex items-center justify-center rounded-full">
              <Icon
                icon="mdi:check-circle"
                className="text-on-primary"
                style={{ width: '32px', height: '32px' }}
              />
            </div>
            <h2 className="font-headline text-title-lg font-bold text-on-surface mb-3">
              Check Your Email
            </h2>
            <p className="text-body-sm text-on-surface-variant mb-8">
              We've sent password reset instructions to <strong>{email}</strong>. Follow the link
              in the email to create a new password.
            </p>
            <p className="text-body-sm text-on-surface-variant mb-8">
              Didn't receive an email? Check your spam folder or{' '}
              <button
                onClick={() => setSubmitted(false)}
                className="text-on-surface font-semibold underline hover:text-primary"
              >
                try again
              </button>
              .
            </p>
            <Link href="/sign-in" className="btn btn-primary w-full">
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
