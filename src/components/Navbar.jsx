import Link from "next/link"
import { Leaf } from "lucide-react"
import { Button } from "../components/ui/button"

export function Navbar() {
  return (
    <header className="border-b w-full">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto">
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
          <Link href="/auth/client/sign-in">
            <Button variant="outline" size="sm">
              Sign In as Client
            </Button>
          </Link>
          
          <div className="h-4 w-px bg-gray-200 mx-2" />
          <Link href="/auth/admin/sign-in">
            <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
              Sign in as Admin
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
