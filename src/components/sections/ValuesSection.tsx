'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useLanguage } from '@/hooks/useLanguage';
import { staggerContainerVariants, staggerItemVariants, fadeInUpVariants, iconHoverVariants } from '@/lib/animations';

const ValuesSection = () => {
  const { translate: t } = useLanguage();

  const values = [
    {
      icon: 'mdi:map-marker',
      title: t('values.klang_valley'),
      description: t('values.klang_valley_desc'),
    },
    {
      icon: 'mdi:lock',
      title: t('values.discretion'),
      description: t('values.discretion_desc'),
    },
    {
      icon: 'mdi:chart-box',
      title: t('values.valuations'),
      description: t('values.valuations_desc'),
    },
    {
      icon: 'mdi:handshake',
      title: t('values.matchmaking'),
      description: t('values.matchmaking_desc'),
    },
  ];

  return (
    <section className="bg-surface py-20">
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
            {t('values.title')}
          </motion.h2>
          <motion.p
            className="body-lead max-w-2xl mx-auto"
            variants={fadeInUpVariants}
          >
            {t('values.description')}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainerVariants}
        >
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="bg-surface-container-lowest p-8 border-l-4 border-accent"
              variants={staggerItemVariants}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
            >
              <div className="flex items-start gap-4">
                <motion.div
                  className="flex-shrink-0 mt-1"
                  initial="rest"
                  whileHover="hover"
                  variants={iconHoverVariants}
                >
                  <Icon
                    icon={value.icon}
                    className="text-accent"
                    style={{ width: '32px', height: '32px' }}
                  />
                </motion.div>
                <div>
                  <h3 className="font-headline text-title-lg font-bold text-on-surface mb-3">
                    {value.title}
                  </h3>
                  <p className="text-body-sm text-on-surface-variant">
                    {value.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ValuesSection;
