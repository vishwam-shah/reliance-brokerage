'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import type { FormInputProps } from '@/types';

const FormInput = ({
  label,
  type = 'text',
  placeholder,
  required = false,
  value,
  onChange,
  error,
  disabled = false,
  className = '',
}: FormInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const labelId = label?.toLowerCase().replace(/\s+/g, '-') || '';
  const errorId = `${labelId}-error`;

  return (
    <div
      className="form-group"
      data-error={error ? 'true' : 'false'}
    >
      {label && (
        <label className="form-label" htmlFor={labelId}>
          {label}
          {required && <span className="text-error"> *</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={labelId}
          type={type}
          className={`form-input ${className}`}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
        {error && (
          <Icon
            icon="mdi:alert-circle"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-error flex-shrink-0 pointer-events-none"
            style={{ width: '24px', height: '24px' }}
          />
        )}
      </div>
      {error && (
        <div id={errorId} className="text-error text-label-sm font-semibold mt-2 flex items-center gap-2">
          <Icon
            icon="mdi:information"
            className="flex-shrink-0"
            style={{ width: '16px', height: '16px' }}
          />
          {error}
        </div>
      )}
    </div>
  );
};

export default FormInput;
