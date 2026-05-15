import FeaturedRestaurants from "@/components/FeaturedRestaurants";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <FeaturedRestaurants />
      <CTASection />
    </div>
  );
}
