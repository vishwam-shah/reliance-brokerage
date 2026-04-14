'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { buttonHoverVariants } from '@/lib/animations';
import type { ButtonProps } from '@/types';

const AnimatedButton = ({
  variant = 'primary',
  size = 'md',
  children,
  href,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
  };
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const MotionLink = motion(Link);
  const MotionButton = motion.button;

  if (href) {
    return (
      <MotionLink
        href={href}
        className={classes}
        initial="rest"
        whileHover={!disabled ? 'hover' : 'rest'}
        whileTap={!disabled ? 'tap' : 'rest'}
        variants={buttonHoverVariants}
      >
        {children}
      </MotionLink>
    );
  }

  return (
    <MotionButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      initial="rest"
      whileHover={!disabled ? 'hover' : 'rest'}
      whileTap={!disabled ? 'tap' : 'rest'}
      variants={buttonHoverVariants}
    >
      {children}
    </MotionButton>
  );
};

export default AnimatedButton;
