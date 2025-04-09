import { Navbar } from "../components/Navbar"
import { HeroSection } from "../components/landing/hero-section"
import { FeaturesSection } from "../components/landing/features-section"
import { TestimonialsSection } from "../components/landing/testimonials-section"
import { PricingSection } from "../components/landing/pricing-section"
import { ContactSection } from "../components/landing/contact-section"
import { SiteFooter } from "../components/landing/site-footer"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  )
}
