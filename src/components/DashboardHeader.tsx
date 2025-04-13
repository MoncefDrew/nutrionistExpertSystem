'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';
import { 
  MessageSquare, 
  Sliders, 
  User, 
  LogOut, 
  Menu,
  X,
  ChevronDown,
  Activity,
  Utensils,
  BarChart,
  Settings,
  Bell,
  Home
} from 'lucide-react';

export function DashboardHeader() {
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Handle scroll effect for the header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileOpen]);

  const navigation = {
    client: [
      { name: 'Home', href: '/', icon: Home },
      { name: 'Chat', href: '/client/chat', icon: MessageSquare },
      { name: 'Preferences', href: '/client/preferences', icon: Settings },
    ],
    nutritionist: [
      { name: 'Home', href: '/', icon: Home },
      { name: 'Chat', href: '/admin/chat', icon: MessageSquare },
      { name: 'Rules', href: '/admin/rules', icon: Sliders },
    ],
  };

  const links = user?.role ? navigation[user.role] : [];

  const handleLogout = () => {
    logout();
    router.push('/login');
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      isScrolled ? 'bg-zinc-900/90 shadow-lg backdrop-blur-xl' : 'bg-zinc-900/70 backdrop-blur-md'
    } border-b border-zinc-800`}>
      <div className="max-w-6xl mx-auto px-4 ">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold text-lg">
              N
            </div>
            <span className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
              NutriExpert
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                    isActive 
                      ? 'bg-indigo-600/20 text-indigo-400' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button className="relative p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/70 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full"></span>
            </button>
            
            {/* Profile Dropdown */}
            <div className="hidden md:block relative profile-dropdown">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProfileOpen(!isProfileOpen);
                }}
                className="flex items-center gap-2 bg-zinc-800/80 text-white px-3 py-2 rounded-lg hover:bg-zinc-700/80 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm max-w-24 truncate">{user?.username}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-zinc-900 rounded-xl shadow-xl py-1 border border-zinc-800 animate-fadeIn overflow-hidden">
                  <div className="px-4 py-3 border-b border-zinc-800">
                    <p className="text-sm text-white font-medium">{user?.username}</p>
                    <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
                  </div>
                  
                  <div className="px-2 py-2">
                    {links.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <link.icon className="w-4 h-4" />
                        {link.name}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="px-2 py-2 border-t border-zinc-800">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/70 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 animate-slideDown">
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="px-4 py-3 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{user?.username}</p>
                  <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 space-y-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-indigo-600/20 text-indigo-400' 
                        : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                );
              })}
            </div>
            
            <div className="p-3 border-t border-zinc-800">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}