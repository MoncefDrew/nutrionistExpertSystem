import Link from "next/link"
import { Button } from "../../components/ui/button"

export function ContactSection() {
  return (
    <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Get in Touch</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
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
              <Link href="/auth/admin/sign-up">
                <Button className="bg-green-600 hover:bg-green-700">Sign Up Now</Button>
              </Link>
              <Link href="/auth/admin/sign-in">
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
