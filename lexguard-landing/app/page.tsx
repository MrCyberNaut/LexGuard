import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Problem } from "@/components/problem";
import { ProductPreview } from "@/components/product-preview";
import { Features } from "@/components/features";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f4f0] selection:bg-[#5b48e8]/20">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Problem />
      <ProductPreview />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}
