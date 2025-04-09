import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Apple, Carrot, ChefHat, Leaf, Users } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">NutriExpert</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:underline underline-offset-4">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:underline underline-offset-4">
              Pricing
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:underline underline-offset-4">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/auth/sign-in">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-green-600 hover:bg-green-700" size="sm">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Your Personal Nutrition Expert System
                </h1>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get personalized nutrition plans, expert advice, and track your progress with our comprehensive
                  nutrition management system.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth/sign-up">
                    <Button className="bg-green-600 hover:bg-green-700">Get Started</Button>
                  </Link>
                  <Link href="#features">
                    <Button variant="outline">Learn More</Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:ml-auto">
                <Image
                  src="/placeholder.svg?height=550&width=550"
                  alt="Healthy food and nutrition"
                  width={550}
                  height={550}
                  className="rounded-lg object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-800">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Everything You Need for Better Nutrition
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides comprehensive tools for both clients and nutrition experts.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="rounded-full bg-green-100 p-4">
                  <Apple className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Personalized Plans</h3>
                <p className="text-center text-gray-500">
                  Get nutrition plans tailored to your specific health goals, dietary restrictions, and preferences.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="rounded-full bg-green-100 p-4">
                  <ChefHat className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Recipe Database</h3>
                <p className="text-center text-gray-500">
                  Access thousands of healthy recipes that align with your nutrition plan and dietary needs.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="rounded-full bg-green-100 p-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Expert Guidance</h3>
                <p className="text-center text-gray-500">
                  Connect with certified nutritionists for personalized advice and ongoing support.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Success Stories</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See how our platform has helped people achieve their nutrition and health goals.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
              <div className="rounded-lg border p-6">
                <div className="flex items-start gap-4">
                  <Image
                    src="/placeholder.svg?height=60&width=60"
                    alt="Client"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div>
                    <p className="text-gray-500 italic">
                      "The personalized nutrition plan helped me lose 20 pounds in 3 months. The expert guidance was
                      invaluable!"
                    </p>
                    <p className="mt-2 font-semibold">Sarah J.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border p-6">
                <div className="flex items-start gap-4">
                  <Image
                    src="/placeholder.svg?height=60&width=60"
                    alt="Client"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div>
                    <p className="text-gray-500 italic">
                      "As a nutritionist, this platform has made it so much easier to manage my clients and provide them
                      with personalized care."
                    </p>
                    <p className="mt-2 font-semibold">Dr. Michael T.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Simple, Transparent Pricing</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that works best for you or your practice.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
              <div className="flex flex-col rounded-lg border p-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold">For Clients</h3>
                  <p className="text-gray-500">Access personalized nutrition plans and expert guidance.</p>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <Carrot className="mr-2 h-4 w-4 text-green-600" />
                    <span>Personalized nutrition plans</span>
                  </li>
                  <li className="flex items-center">
                    <Carrot className="mr-2 h-4 w-4 text-green-600" />
                    <span>Recipe database access</span>
                  </li>
                  <li className="flex items-center">
                    <Carrot className="mr-2 h-4 w-4 text-green-600" />
                    <span>Progress tracking</span>
                  </li>
                  <li className="flex items-center">
                    <Carrot className="mr-2 h-4 w-4 text-green-600" />
                    <span>Monthly consultation</span>
                  </li>
                </ul>
                <Link href="/auth/sign-up" className="mt-auto">
                  <Button className="w-full bg-green-600 hover:bg-green-700">Sign Up as Client</Button>
                </Link>
              </div>
              <div className="flex flex-col rounded-lg border p-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold">For Nutritionists</h3>
                  <p className="text-gray-500">Manage clients and provide expert guidance.</p>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <Carrot className="mr-2 h-4 w-4 text-green-600" />
                    <span>Client management dashboard</span>
                  </li>
                  <li className="flex items-center">
                    <Carrot className="mr-2 h-4 w-4 text-green-600" />
                    <span>Plan creation tools</span>
                  </li>
                  <li className="flex items-center">
                    <Carrot className="mr-2 h-4 w-4 text-green-600" />
                    <span>Progress monitoring</span>
                  </li>
                  <li className="flex items-center">
                    <Carrot className="mr-2 h-4 w-4 text-green-600" />
                    <span>Unlimited clients</span>
                  </li>
                </ul>
                <Link href="/auth/sign-up" className="mt-auto">
                  <Button className="w-full bg-green-600 hover:bg-green-700">Sign Up as Nutritionist</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Get in Touch</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Have questions? Our team is here to help.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-lg py-12">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <p className="text-center text-gray-500">
                  Email us at <span className="font-semibold">support@nutriexpert.com</span> or call us at{" "}
                  <span className="font-semibold">(555) 123-4567</span>.
                </p>
                <div className="flex gap-4">
                  <Link href="/auth/sign-up">
                    <Button className="bg-green-600 hover:bg-green-700">Sign Up Now</Button>
                  </Link>
                  <Link href="/auth/sign-in">
                    <Button variant="outline">Sign In</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-gray-50">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">NutriExpert</span>
          </div>
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} NutriExpert. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-gray-500 hover:underline">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
