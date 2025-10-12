import Hero from "@/components/Hero";
import SpiritualJourney from "@/components/SpiritualJourney";
import SpecialPujas from "@/components/SpecialPujas";
import Services from "@/components/Services";
import SpiritualTools from "@/components/SpiritualTools";
import About from "@/components/About";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <SpiritualJourney />
      <SpecialPujas />
      <Services />
      <SpiritualTools />
      <About />
      <Contact />
    </main>
  );
}