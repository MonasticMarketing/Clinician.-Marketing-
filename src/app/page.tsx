import Hero from "@/components/Hero";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import CredibilityStrip from "@/components/sections/CredibilityStrip";
import Faq from "@/components/sections/Faq";
import HowItWorks from "@/components/sections/HowItWorks";
import Pricing from "@/components/sections/Pricing";
import Services from "@/components/sections/Services";
import WhoWeServe from "@/components/sections/WhoWeServe";
import { faqJsonLd } from "@/lib/structured-data";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Hero />
      <CredibilityStrip />
      <WhoWeServe />
      <Services />
      <Pricing />
      <HowItWorks />
      <About />
      <Faq />
      <Contact />
    </>
  );
}
