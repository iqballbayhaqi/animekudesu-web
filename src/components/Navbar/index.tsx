'use client'
import React, { useState, useEffect } from 'react'
import { UserRound, Bookmark, Search, Play, Bell, Menu, X, Home, Film, Clock, TrendingUp, Heart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/genres', label: 'Genres', icon: Film },
    { href: '/latest', label: 'Latest', icon: Clock },
    { href: '/popular', label: 'Popular', icon: TrendingUp },
    { href: '#', label: 'My List', icon: Heart },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-black/95 backdrop-blur-md shadow-lg' 
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
      }`}>
        <div className='flex justify-between items-center px-4 md:px-12 py-3'>
          {/* Logo & Menu */}
          <div className='flex items-center gap-8'>
            <Link href="/" className='flex items-center gap-2 group'>
              <Play className='text-red-600 fill-red-600 w-7 h-7 md:w-8 md:h-8 group-hover:scale-110 transition-transform' />
              <span className='text-red-600 font-heading text-xl md:text-3xl tracking-wider group-hover:text-red-500 transition-colors'>
                ANIMEKUDESU
              </span>
            </Link>
            
            {/* Desktop Menu */}
            <ul className='hidden md:flex items-center gap-1'>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      isActiveLink(link.href) 
                        ? 'text-white' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Icons */}
          <div className='flex items-center gap-3 md:gap-5'>
            <Link href="/search" className='text-white hover:text-gray-300 transition-colors'>
              <Search className='w-5 h-5' />
            </Link>
            <button className='hidden md:block text-white hover:text-gray-300 transition-colors relative'>
              <Bell className='w-5 h-5' />
              <span className='absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full'></span>
            </button>
            <button className='hidden md:block text-white hover:text-gray-300 transition-colors'>
              <Bookmark className='w-5 h-5' />
            </button>
            <button className='hidden md:flex items-center gap-2 hover:opacity-80 transition-opacity'>
              <div className='w-8 h-8 rounded bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center'>
                <UserRound className='w-5 h-5 text-white' />
              </div>
            </button>
            
            {/* Hamburger Button - Mobile Only */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='md:hidden text-white hover:text-gray-300 transition-colors p-1'
              aria-label='Toggle menu'
            >
              {isMobileMenuOpen ? (
                <X className='w-6 h-6' />
              ) : (
                <Menu className='w-6 h-6' />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-72 bg-gray-900 z-50 md:hidden transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Menu Header */}
        <div className='flex items-center justify-between p-4 border-b border-gray-800'>
          <span className='text-red-600 font-heading text-xl tracking-wider'>MENU</span>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className='text-gray-400 hover:text-white transition-colors p-1'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Menu Links */}
        <nav className='p-4'>
          <ul className='space-y-1'>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActiveLink(link.href)
                        ? 'bg-red-600/20 text-red-500'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className='w-5 h-5' />
                    <span className='font-medium'>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Divider */}
        <div className='mx-4 border-t border-gray-800' />

        {/* Additional Links */}
        <div className='p-4'>
          <ul className='space-y-1'>
            <li>
              <Link 
                href="/search"
                className='flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all'
              >
                <Search className='w-5 h-5' />
                <span className='font-medium'>Search</span>
              </Link>
            </li>
            <li>
              <button className='flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all w-full'>
                <Bell className='w-5 h-5' />
                <span className='font-medium'>Notifications</span>
                <span className='ml-auto w-2 h-2 bg-red-600 rounded-full'></span>
              </button>
            </li>
            <li>
              <button className='flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all w-full'>
                <Bookmark className='w-5 h-5' />
                <span className='font-medium'>Bookmarks</span>
              </button>
            </li>
          </ul>
        </div>

        {/* User Profile Section */}
        <div className='absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-gray-900'>
          <button className='flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-800 transition-all'>
            <div className='w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center'>
              <UserRound className='w-6 h-6 text-white' />
            </div>
            <div className='text-left'>
              <p className='text-white font-medium'>Guest User</p>
              <p className='text-gray-500 text-sm'>Sign in to your account</p>
            </div>
          </button>
        </div>
      </div>
    </>
  )
}

export default Navbar