import { HeroSection } from "@/components/hero-section";
import { MusicSection } from "@/components/music-section";
import { MerchSection } from "@/components/merch-section";
import { ServicesSection } from "@/components/services-section";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <MusicSection />
      <MerchSection />
      <ServicesSection />
      <ContactForm />
      <Footer />
    </div>
  );
}
