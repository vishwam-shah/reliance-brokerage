'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import Button from '@/components/ui/Button';
import { staggerContainerVariants, staggerItemVariants, fadeInUpVariants } from '@/lib/animations';

const ProcessSection = () => {
  const { translate: t } = useLanguage();

  const steps = [
    {
      title: t('process.steps.list'),
      description: t('process.steps.list_desc'),
    },
    {
      title: t('process.steps.screen'),
      description: t('process.steps.screen_desc'),
    },
    {
      title: t('process.steps.introduce'),
      description: t('process.steps.introduce_desc'),
    },
    {
      title: t('process.steps.due_diligence'),
      description: t('process.steps.due_diligence_desc'),
    },
    {
      title: t('process.steps.complete'),
      description: t('process.steps.complete_desc'),
    },
  ];

  return (
    <section className="bg-surface-container py-20">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainerVariants}
        >
          <motion.h2
            className="font-headline text-display-md font-bold text-on-surface mb-4"
            variants={fadeInUpVariants}
          >
            {t('process.title')}
          </motion.h2>
          <motion.p
            className="body-lead max-w-2xl mx-auto"
            variants={fadeInUpVariants}
          >
            {t('process.description')}
          </motion.p>
        </motion.div>

        <motion.div
          className="process-grid mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainerVariants}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex flex-col"
              variants={staggerItemVariants}
            >
              <div className="text-center">
                <motion.div
                  className="inline-flex items-center justify-center w-12 h-12 bg-primary text-on-primary font-headline font-bold text-title-lg mb-4 rounded-none"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {index + 1}
                </motion.div>
                <h3 className="font-headline text-title-lg font-bold text-on-surface mb-3">
                  {step.title}
                </h3>
                <p className="text-body-sm text-on-surface-variant">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUpVariants}
        >
          <Button href="/how-it-works" variant="secondary">
            {t('process.explore')}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSection;
