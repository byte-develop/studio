import { Navigation } from '@/components/navigation';
import { HeroSection } from '@/components/hero-section';
import { ServicesSection } from '@/components/services-section';
import { PortfolioSection } from '@/components/portfolio-section';
import { TeamSection } from '@/components/team-section';
import { ProcessSection } from '@/components/process-section';
import { TechnologiesSection } from '@/components/technologies-section';
import { ContactSection } from '@/components/contact-section';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <div className="bg-deep-black text-white overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <TeamSection />
      <ProcessSection />
      <TechnologiesSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
