'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../store/useAuthStore';
import { 
  MessageSquare, 
  Sliders, 
  User, 
  LogOut, 
  Menu,
  X,
  ChevronDown 
} from 'lucide-react';

export function DashboardHeader() {
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigation = {
    client: [
      { name: 'Chat', href: '/client/chat', icon: MessageSquare },
      { name: 'Preferences', href: '/client/preferences', icon: Sliders },
    ],
    nutritionist: [
      { name: 'Chat', href: '/admin/chat', icon: MessageSquare },
      { name: 'Rules', href: '/admin/rules', icon: Sliders },
    ],
  };

  const links = user?.role ? navigation[user.role] : [];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">NutriExpert</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-zinc-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Profile Dropdown */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 bg-zinc-800 text-white px-3 py-2 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="text-sm">{user?.username}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-900 rounded-lg shadow-lg py-1 border border-zinc-800">
                <div className="px-4 py-2 border-b border-zinc-800">
                  <p className="text-sm text-white font-medium">{user?.username}</p>
                  <p className="text-xs text-zinc-400">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-zinc-300 hover:text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800">
          <div className="px-4 py-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
} 