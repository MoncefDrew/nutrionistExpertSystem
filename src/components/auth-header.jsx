'use client';
import Link from "next/link"
import { Leaf } from "lucide-react"
import { useAuthStore } from "../store/useAuthStore"

export function AuthHeader() {
  const { userType, logout } = useAuthStore();

  const navigation = {
    client: [
      { name: 'Chat', href: '/client/chat' },
      { name: 'Preferences', href: '/client/preferences' },
    ],
    admin: [
      { name: 'Chat', href: '/admin/chat' },
      { name: 'Rules', href: '/admin/rules' },
    ],
  };

  const links = userType ? navigation[userType] : [];

  return (
    <div className="absolute bg-[#171717] top-0 left-0 right-0 p-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <Leaf className="h-6 w-6 text-green-600" />
        <span className="font-bold text-gray-100">NutriExpert</span>
      </Link>

      <div className="flex items-center gap-6">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-gray-300 hover:text-white transition-colors"
          >
            {link.name}
          </Link>
        ))}
        <button
          onClick={logout}
          className="text-gray-300 hover:text-white transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
