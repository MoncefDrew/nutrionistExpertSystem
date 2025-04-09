import { Apple, ChefHat, Users } from "lucide-react"

export function FeaturesSection() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-800">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Everything You Need for Better Nutrition
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
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
  )
}
