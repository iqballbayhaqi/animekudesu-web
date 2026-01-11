'use client'
import React, { useState, useEffect } from 'react'
import { UserRound, Bookmark, Search, Play, Bell } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-black/95 backdrop-blur-md shadow-lg' 
        : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
    }`}>
      <div className='flex justify-between items-center px-4 md:px-12 py-3'>
        {/* Logo & Menu */}
        <div className='flex items-center gap-8'>
          <Link href="/" className='flex items-center gap-2 group'>
            <Play className='text-red-600 fill-red-600 w-8 h-8 group-hover:scale-110 transition-transform' />
            <span className='text-red-600 font-heading text-2xl md:text-3xl tracking-wider group-hover:text-red-500 transition-colors'>
              ANIMEKUDESU
            </span>
          </Link>
          
          <ul className='hidden md:flex items-center gap-1'>
            <li>
              <Link href="/" className='px-4 py-2 text-sm font-medium text-white hover:text-gray-300 transition-colors'>
                Home
              </Link>
            </li>
            <li>
              <Link href="/genres" className='px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors'>
                Genres
              </Link>
            </li>
            <li>
              <Link href="/latest" className='px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors'>
                Latest
              </Link>
            </li>
            <li>
              <Link href="/popular" className='px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors'>
                Popular
              </Link>
            </li>
            <li>
              <Link href="#" className='px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors'>
                My List
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Icons */}
        <div className='flex items-center gap-5'>
          <Link href="/search" className='text-white hover:text-gray-300 transition-colors'>
            <Search className='w-5 h-5' />
          </Link>
          <button className='text-white hover:text-gray-300 transition-colors relative'>
            <Bell className='w-5 h-5' />
            <span className='absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full'></span>
          </button>
          <button className='text-white hover:text-gray-300 transition-colors'>
            <Bookmark className='w-5 h-5' />
          </button>
          <button className='flex items-center gap-2 hover:opacity-80 transition-opacity'>
            <div className='w-8 h-8 rounded bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center'>
              <UserRound className='w-5 h-5 text-white' />
            </div>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar