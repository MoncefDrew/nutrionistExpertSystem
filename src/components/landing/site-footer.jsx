import Link from "next/link"
import { Leaf } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t bg-gray-50 w-full">
      <div className="container flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between md:py-12 mx-auto px-4 md:px-6">
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
  )
}
