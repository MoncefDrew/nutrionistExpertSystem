import Link from "next/link"
import { Leaf } from "lucide-react"

export function AuthHeader() {
  return (
    <Link href="/" className="absolute left-4 top-4 flex items-center gap-2 md:left-8 md:top-8">
      <Leaf className="h-6 w-6 text-green-600" />
      <span className="font-bold text-gray-100">NutriExpert</span>
    </Link>
  )
}
