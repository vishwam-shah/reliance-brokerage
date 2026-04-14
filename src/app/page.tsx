import HeroSection from '@/components/sections/HeroSection';
import KPISection from '@/components/sections/KPISection';
import ProcessSection from '@/components/sections/ProcessSection';
import ValuesSection from '@/components/sections/ValuesSection';
import CTASection from '@/components/sections/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <KPISection />
      <ProcessSection />
      <ValuesSection />
      <CTASection />
    </>
  );
}
