/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import SearchInput from '@/components/SearchInput'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import Link from 'next/link';
import Loading from '@/components/Loading';

interface Anime {
  detail_url: string;
  img: string;
  alt: string;
  title: string;
  type: string;
  score: number;
  genres?: Genre[];
  slug: string;
}

interface Genre {
  tag: string;
}

const fetchAnime = async (query: string) => {
  const res = await axios.get(`https://animekudesu-be.gatradigital.com/search-anime?search=${encodeURIComponent(query)}`);
  return res.data;
};

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['search-anime', searchTerm],
    queryFn: () => fetchAnime(searchTerm),
    enabled: !!searchTerm, // hanya jalan kalau searchTerm tidak kosong
    staleTime: 1000 * 60 * 5, // cache 5 menit
  });

  return (
    <div>
      <Navbar />
      <SearchInput callAction={(query) => setSearchTerm(query)} />
      <div>
        {isLoading && <div className='flex justify-center items-center min-h-36'><Loading /></div>}
        {error && <p className="mt-4 text-red-500">Terjadi kesalahan.</p>}

        {data && data.data.length > 0 && (
          <div className="flex flex-wrap mt-6 mx-10 text-white space-y-2 h-[200px]">
            {data.data.map((anime: Anime, index: number) => {
              return (
                <div key={index} className="w-1/2 md:w-1/4 lg:w-1/5 px-2">
                  <Link href={`/anime${anime.slug}`}>
                    <div className="group rounded-md">
                      <div className="aspect-[2/3] overflow-hidden rounded-md bg-gray-800 border-none">
                        <img
                          src={anime.img}
                          alt={anime.alt}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div>
                        <h3 className="text-white mt-2 text-sm font-semibold truncate">
                          {anime.title}
                        </h3>
                        <div className="flex items-center">
                          <p className="text-gray-400 text-xs">{`${anime.type} | ${anime.score}`}</p>
                          <Star
                            className="text-yellow-400 text-xs ml-1"
                            size={15}
                          />
                        </div>
                          <div className="flex gap-1 mt-2 overflow-x-auto scrollbar-hide">
                            {(anime?.genres?.length ?? 0) > 2 ? (
                            <div className="overflow-hidden whitespace-nowrap">
                            <div className="inline-block animate-marquee">
                              {anime.genres?.map((genre: Genre, index: number) => (
                              <span
                              key={index}
                              className="bg-gray-700 text-gray-300 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap mx-1"
                              >
                              {genre.tag}
                              </span>
                              ))}
                            </div>
                            
                            </div>
                            ) : (
                            anime.genres?.map((genre: Genre, index: number) => (
                            <span
                              key={index}
                              className="bg-gray-700 text-gray-300 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap"
                            >
                              {genre.tag}
                            </span>
                            ))
                            )}
                          </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )})}
          </div>
        )}

        {data && data.data.length === 0 && (
          <img src="/not_found.png" alt="Not Found" className="w-full h-[50vh] object-contain mt-10" />
        )}
      </div>
    </div>
  )
}

export default SearchPage