import React from 'react'
import { UserRound, Bookmark, Search, TvIcon } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <div className='flex justify-between items-center bg-gray-800 p-4 text-white sticky top-0 w-full shadow-md z-50'>
      <div className='flex items-center space-x-2'>
        <Link href="/" className='flex items-center space-x-2'>
          <TvIcon className='text-blue-400' />
          <p className='text-blue-400 font-bold text-2xl hover:text-white'>ANIMEKUDESU</p>
        </Link>
        <ul className='hidden md:flex space-x-4'>
            <li className='inline-block px-4 py-2 hover:bg-gray-700 rounded'>Genres</li>
            <li className='inline-block px-4 py-2 hover:bg-gray-700 rounded'>Latest</li>
            <li className='inline-block px-4 py-2 hover:bg-gray-700 rounded'>Popular</li>
        </ul>
      </div>
      <div className='flex space-x-4'>
        <Link href="/search">
          <Search />
        </Link>
        <Bookmark />
        <UserRound />
      </div>
    </div>
  )
}

export default Navbar