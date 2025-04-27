import React from 'react'
import { UserRound, Bookmark, Search, TvIcon } from 'lucide-react';

const Navbar = () => {
  return (
    <div className='flex justify-between items-center bg-gray-800 p-4 text-white'>
      <div className='flex items-center space-x-2'>
        <div className='flex items-center space-x-2'>
          <TvIcon className='text-blue-400' />
          <p className='text-blue-400 font-bold text-2xl'>ANIMEKUDESU</p>
        </div>
        <ul>
            <li className='inline-block px-4 py-2 hover:bg-gray-700 rounded'>Home</li>
            <li className='inline-block px-4 py-2 hover:bg-gray-700 rounded'>Genres</li>
            <li className='inline-block px-4 py-2 hover:bg-gray-700 rounded'>Latest</li>
            <li className='inline-block px-4 py-2 hover:bg-gray-700 rounded'>Popular</li>
        </ul>
      </div>
      <div className='flex space-x-4'>
        <Search />
        <Bookmark />
        <UserRound />
      </div>
    </div>
  )
}

export default Navbar