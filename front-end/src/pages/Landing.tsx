import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import SocialProof from "@/components/SocailProf";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";


export default function Landing() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground flex justify-center flex-col items-center font-sans">
      <div className="max-w-400 border border-dashed border-neutral-200">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <SocialProof />
      <CTA />
      <Footer />
      </div>
    </div>
  );
}