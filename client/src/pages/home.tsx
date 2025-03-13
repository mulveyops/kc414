import { HeroSection } from "@/components/hero-section";
import { BioSection } from "@/components/bio-section";
import { MusicSection } from "@/components/music-section";
import { MerchSection } from "@/components/merch-section";
import { ServicesSection } from "@/components/services-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <BioSection />
      <MusicSection preview />
      <MerchSection preview />
      <ServicesSection preview />
      <Footer />
    </div>
  );
}