import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Carrot } from "lucide-react"

export function PricingSection() {
  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Simple, Transparent Pricing</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
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
  )
}
