"use client"
import Link from "next/link"
import { Leaf, User, LogOut, MessageSquare, Settings, ChevronDown } from "lucide-react"
import { Button } from "./ui/button"
import { useAuthStore } from "../store/useAuthStore"
import { useState, useRef, useEffect } from "react"

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    // You might want to add router.push('/') here if you want to redirect after logout
  }

  const menuItems = {
    client: [
      { label: 'Chat', href: '/client/chat', icon: MessageSquare },
      { label: 'Preferences', href: '/client/preferences', icon: Settings },
    ],
    nutritionist: [
      { label: 'Chat', href: '/admin/chat', icon: MessageSquare },
      { label: 'Rules', href: '/admin/rules', icon: Settings },
    ],
  }

  return (
    <header className="border-b w-full bg-white fixed top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="text-xl font-bold text-gray-800">NutriExpert</span>
        </div>
        
        <nav className="hidden md:flex gap-6">
          <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
            Features
          </Link>
          <Link href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
            Testimonials
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
            Pricing
          </Link>
          <Link href="#contact" className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated() ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 bg-gray-200 text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <User size={18} />
                <span className="text-sm">{user?.username}</span>
                <ChevronDown size={16} className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm text-gray-800 font-medium">{user?.username}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>

                  {menuItems[user?.role === 'nutritionist' ? 'nutritionist' : 'client'].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon size={16} />
                      {item.label}
                    </Link>
                  ))}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-100 transition-colors w-full"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/client/sign-in">
                <Button variant="outline" size="sm" className="text-gray-600 border-gray-300 hover:bg-gray-100 hover:text-gray-800">
                  Sign In as Client
                </Button>
              </Link>
              
              <div className="h-4 w-px bg-gray-300 mx-2" />
              
              <Link href="/auth/admin/sign-in">
                <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-500 hover:bg-gray-100">
                  Sign in as Admin
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
