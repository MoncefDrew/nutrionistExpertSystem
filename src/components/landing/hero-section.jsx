import Link from "next/link"
import Image from "next/image"
import { Button } from "../../components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Your Personal Nutrition Expert System
            </h1>
            <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Get personalized nutrition plans, expert advice, and track your progress with our comprehensive nutrition
              management system.
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
  )
}
