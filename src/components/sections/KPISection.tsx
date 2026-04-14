'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations';

const KPISection = () => {
  const { translate: t } = useLanguage();

  const stats = [
    {
      label: t('kpis.listings_label'),
      description: t('kpis.listings_desc'),
      value: '287',
    },
    {
      label: t('kpis.transitions_label'),
      description: t('kpis.transitions_desc'),
      value: '612',
    },
    {
      label: t('kpis.years_label'),
      description: t('kpis.years_desc'),
      value: '15',
    },
    {
      label: t('kpis.completion_label'),
      description: t('kpis.completion_desc'),
      value: '91%',
    },
  ];

  return (
    <section className="bg-surface py-20">
      <div className="container">
        <motion.div
          className="kpi-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainerVariants}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              variants={staggerItemVariants}
            >
              <div className="mb-4">
                <p className="label-overline text-on-surface-variant mb-2">
                  {stat.label}
                </p>
                <h3 className="font-headline text-4xl font-bold text-on-surface">
                  {stat.value}
                </h3>
              </div>
              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default KPISection;
