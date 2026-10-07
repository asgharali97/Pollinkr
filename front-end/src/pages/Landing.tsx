import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/process/HowItWorks";
import SocialProof from "@/components/SocailProf";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";


export default function Landing() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground flex justify-center flex-col items-center font-sans">
      <div className="w-full sm:max-w-3xl md:max-w-4xl border-neutral-200">
      <Navbar />
      <Hero />
      <HowItWorks />
      <SocialProof />
      <CTA />
      <Footer />
      </div>
    </div>
  );
}
