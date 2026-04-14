'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import Button from '@/components/ui/Button';
import {
  fadeInUpVariants,
  slideInRightVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from '@/lib/animations';

const HeroSection = () => {
  const { translate: t } = useLanguage();

  return (
    <section className="bg-surface py-24 md:py-32 min-h-screen flex items-center">
      <div className="container">
        <div className="hero-grid">
          {/* Left: Copy */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainerVariants}
          >
            <motion.span
              className="eyebrow"
              variants={fadeInUpVariants}
            >
              {t('hero.eyebrow')}
            </motion.span>

            <motion.h1
              className="display-hero mt-8 mb-6 max-w-680px"
              variants={fadeInUpVariants}
            >
              {t('hero.title')}
            </motion.h1>

            <motion.p
              className="body-lead max-w-560px mb-12"
              variants={fadeInUpVariants}
            >
              {t('hero.description')}
            </motion.p>

            <motion.div
              className="flex gap-4 flex-wrap"
              variants={staggerContainerVariants}
            >
              <motion.div variants={staggerItemVariants}>
                <Button href="/valuations" variant="primary" size="lg">
                  {t('hero.cta1')}
                </Button>
              </motion.div>
              <motion.div variants={staggerItemVariants}>
                <Button href="/listings" variant="secondary" size="lg">
                  {t('hero.cta2')}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right: Image + Stat Monolith */}
          <motion.div
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideInRightVariants}
          >
            <div className="aspect-[4/5] bg-surface-container overflow-hidden max-h-600px">
              <Image
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80&fm=jpg"
                alt="Institutional architectural interior — Reliance Brokerage"
                width={600}
                height={750}
                className="w-full h-full object-cover opacity-80 contrast-110"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-30" />
            </div>

            {/* Stat Monolith Overlay */}
            <motion.div
              className="absolute bottom-0 -left-8 -right-8 md:bottom-0 md:-left-8 p-10 bg-primary text-on-primary max-w-280px shadow-modal"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
            >
              <p className="label-overline opacity-75 mb-2">
                {t('stat_monolith.label')}
              </p>
              <h3 className="font-headline text-5xl font-black text-on-primary mb-3">
                {t('stat_monolith.value')}
              </h3>
              <p className="text-body-sm font-light text-on-primary opacity-75">
                {t('stat_monolith.description')}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
