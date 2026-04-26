'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import Button from '@/components/ui/Button';
import { staggerContainerVariants, staggerItemVariants, fadeInUpVariants } from '@/lib/animations';

const CTASection = () => {
  const { translate: t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-surface py-20">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#475569] p-10 md:p-16 text-center shadow-modal">
          {/* Decorative glow */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent/25 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent/15 blur-3xl pointer-events-none" />

          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainerVariants}
            className="relative"
          >
            <motion.span
              className="inline-block text-accent font-label font-semibold text-label-sm uppercase tracking-widest mb-4"
              variants={fadeInUpVariants}
            >
              Get Started Today
            </motion.span>

            <motion.h2
              className="font-headline text-display-sm md:text-display-md font-bold text-white mb-5"
              variants={fadeInUpVariants}
            >
              {t('cta_final.title')}
            </motion.h2>

            <motion.p
              className="text-body-md md:text-body-lg max-w-2xl mx-auto mb-8 text-white/75"
              variants={fadeInUpVariants}
            >
              {t('cta_final.description')}
            </motion.p>

            <motion.div
              className="flex gap-3 justify-center flex-wrap"
              variants={staggerContainerVariants}
            >
              <motion.div variants={staggerItemVariants}>
                <Button
                  href="/register"
                  variant="primary"
                  size="lg"
                  className="!bg-white !text-primary hover:!bg-white/90 shadow-lg"
                >
                  {t('cta_final.contact')}
                </Button>
              </motion.div>
              <motion.div variants={staggerItemVariants}>
                <Button
                  href="/listings"
                  variant="ghost"
                  size="lg"
                  className="!bg-white/10 !text-white border !border-white/20 hover:!bg-white/20 backdrop-blur-md"
                >
                  {t('cta_final.browse')}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
