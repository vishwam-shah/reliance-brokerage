'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import Button from '@/components/ui/Button';
import { staggerContainerVariants, staggerItemVariants, fadeInUpVariants } from '@/lib/animations';

const CTASection = () => {
  const { translate: t } = useLanguage();

  return (
    <section className="bg-primary text-on-primary py-20">
      <div className="container text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainerVariants}
        >
          <motion.h2
            className="font-headline text-display-md font-bold mb-6"
            variants={fadeInUpVariants}
          >
            {t('cta_final.title')}
          </motion.h2>

          <motion.p
            className="body-lead max-w-2xl mx-auto mb-8 text-on-primary opacity-90"
            variants={fadeInUpVariants}
          >
            {t('cta_final.description')}
          </motion.p>

          <motion.div
            className="flex gap-4 justify-center flex-wrap"
            variants={staggerContainerVariants}
          >
            <motion.div variants={staggerItemVariants}>
              <Button
                href="/register"
                variant="primary"
                size="lg"
                className="!bg-on-primary !text-primary hover:!bg-surface-container-low"
              >
                {t('cta_final.contact')}
              </Button>
            </motion.div>
            <motion.div variants={staggerItemVariants}>
              <Button
                href="/listings"
                variant="ghost"
                size="lg"
                className="!text-on-primary border border-on-primary hover:!bg-primary-dim"
              >
                {t('cta_final.browse')}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
