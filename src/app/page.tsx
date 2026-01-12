/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import 'swiper/css/effect-fade';
import Link from "next/link";
import Loading from "@/components/Loading";
import ListItemHorizontal from "@/components/ListItemHorizontal";
import Footer from "@/components/Footer";
import { X, Play, Info, Plus, Star, Calendar, Film, Clock, Volume2, VolumeX } from "lucide-react";
import { getTrailerBySlug, getYouTubeEmbedUrl } from "@/utils/animeTrailers";

// create types for anime data
interface Anime {
  link: string;
  detail_url?: string;
  slug?: string;
  img: string;
  alt: string;
  title: string;
  episode: string;
  released: string;
  type: string;
  score: number;
}

interface Genres {
  title: string;
  id: string;
}

async function fetchNewAnime() {
  const { data } = await axios.get(
    "https://animekudesu-be.gatradigital.com/new-anime"
  );
  return data;
}

// /genres
async function fetchGenres() {
  const { data } = await axios.get(
    "https://animekudesu-be.gatradigital.com/genres"
  );
  return data;
}

// Helper to extract slug from anime object
// Priority: slug field > extract from detail_url > extract from link
function getAnimeSlug(anime: Anime): string {
  // If slug field exists, use it directly
  if (anime.slug) {
    return anime.slug;
  }
  
  // Try to extract from detail_url or link
  const url = anime.detail_url || anime.link || '';
  
  // Remove query params and hash
  const cleanUrl = url.split('?')[0].split('#')[0];
  
  // Get the last non-empty segment
  const parts = cleanUrl.split('/').filter(Boolean);
  const slug = parts[parts.length - 1] || '';
  
  return slug;
}

export default function Home() {
  const [popup, setPopup] = useState(true);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  
  const newAnime = useQuery({
    queryKey: ["new-anime"],
    queryFn: fetchNewAnime,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  const genres = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  // Handle slide change to track active slide
  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveSlideIndex(swiper.realIndex);
  }, []);

  if (newAnime.isLoading)
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <Loading />
        </div>
      </div>
    );
    
  if (newAnime.error) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex flex-col justify-center items-center h-[80vh] px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-white text-2xl font-heading mb-2">Oops! Something went wrong</h1>
          <p className="text-gray-400 text-center mb-6">
            {(newAnime.error as Error).message}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      
      {/* Hero Slider */}
      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          navigation
          pagination={{ 
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !w-3 !h-3 !bg-gray-500 !opacity-50',
            bulletActiveClass: '!bg-red-600 !opacity-100 !w-8 !rounded-full',
          }}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 60000, disableOnInteraction: false }}
          loop
          spaceBetween={0}
          slidesPerView={1}
          className="hero-swiper"
          onSlideChange={handleSlideChange}
        >
          {newAnime.data.data.slice(0, 8).map((anime: Anime, index: number) => {
            const slug = getAnimeSlug(anime);
            const trailer = getTrailerBySlug(slug);
            const isActiveSlide = activeSlideIndex === index;
            const trailerUrl = trailer && isActiveSlide ? getYouTubeEmbedUrl(slug, { muted: isMuted }) : null;

            return (
              <SwiperSlide key={index}>
                <div className="relative h-[70vh] md:h-[90vh] w-full overflow-hidden">
                  {/* Background - Video or Image */}
                  {trailer && trailerUrl && isActiveSlide ? (
                    <div className="absolute inset-0 w-full h-full">
                      <iframe
                        src={trailerUrl}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] sm:w-[200%] sm:h-[200%] md:w-[180%] md:h-[180%] lg:w-[150%] lg:h-[150%] pointer-events-none"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`${trailer.title || anime.title} Trailer`}
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0">
                      <img
                        src={anime.img}
                        alt={anime.alt}
                        className="object-cover w-full h-full transform scale-105"
                      />
                    </div>
                  )}

                  {/* Gradient Overlays - Netflix Style */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-10" />
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />

                  {/* Content */}
                  <div className="absolute inset-0 flex items-center z-20">
                    <div className="px-4 sm:px-8 md:px-16 max-w-3xl">
                      {/* Badge */}
                      <div className="flex items-center gap-2 sm:gap-3 mb-3 md:mb-4">
                        <span className="bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded">
                          NEW
                        </span>
                        {anime.score && Number(anime.score) > 0 && (
                          <span className="text-gray-300 text-xs sm:text-sm flex items-center gap-1">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
                            {Number(anime.score).toFixed(1)}
                          </span>
                        )}
                        {anime.type && (
                          <span className="text-gray-400 text-xs sm:text-sm">{anime.type}</span>
                        )}
                        {trailer && (
                          <span className="bg-purple-600 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded flex items-center gap-1">
                            <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white" />
                            TRAILER
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-heading text-white mb-2 sm:mb-4 drop-shadow-2xl leading-tight">
                        {anime.title}
                      </h1>

                      {/* Meta Info */}
                      <div className="flex items-center gap-2 sm:gap-3 mb-3 md:mb-4 text-xs sm:text-sm">
                        <span className="text-green-500 font-semibold">98% Match</span>
                        <span className="border border-gray-500 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs text-gray-300">HD</span>
                        <span className="text-gray-400 hidden sm:inline">{anime.released}</span>
                        <span className="text-gray-400">{anime.episode}</span>
                      </div>

                      {/* Description placeholder */}
                      <p className="text-gray-300 text-sm md:text-base mb-4 md:mb-6 line-clamp-2 max-w-xl leading-relaxed hidden md:block">
                        Watch the latest episode of {anime.title}. Stream now in HD quality on Animekudesu.
                      </p>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        <Link href={anime.link}>
                          <button className="bg-white hover:bg-gray-200 text-black font-semibold py-2 sm:py-3 px-4 sm:px-6 md:px-8 rounded flex items-center gap-1.5 sm:gap-2 transition-all transform hover:scale-105">
                            <Play className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 fill-black" />
                            <span className="text-xs sm:text-sm md:text-base">Play</span>
                          </button>
                        </Link>
                        <button 
                          onClick={() => setSelectedAnime(anime)}
                          className="bg-gray-600/80 hover:bg-gray-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 md:px-8 rounded flex items-center gap-1.5 sm:gap-2 transition-all"
                        >
                          <Info className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                          <span className="text-xs sm:text-sm md:text-base hidden sm:inline">More Info</span>
                          <span className="text-xs sm:hidden">Info</span>
                        </button>
                        <button className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border border-gray-500 sm:border-2 sm:border-gray-400 hover:border-white bg-black/30 hover:bg-black/50 flex items-center justify-center transition-all">
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mute/Unmute Button for Video */}
                  {trailer && isActiveSlide && (
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="absolute bottom-20 sm:bottom-24 right-4 sm:right-8 md:right-16 z-30 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border border-gray-500 sm:border-2 sm:border-gray-400 hover:border-white bg-black/60 flex items-center justify-center transition-all"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                      ) : (
                        <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                      )}
                    </button>
                  )}

                  {/* Slide Number Indicator */}
                  <div className="absolute bottom-6 sm:bottom-8 right-4 sm:right-8 md:right-16 flex items-center gap-2 z-20">
                    <span className="text-4xl sm:text-5xl md:text-7xl font-heading text-white/20">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Bottom fade into content */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
      </div>

      <div className="flex flex-col gap-4 my-4">
        <ListItemHorizontal 
          title="On Going Anime" 
          apifetch="https://animekudesu-be.gatradigital.com/ongoing-anime" 
          queryKey="on-going-anime" 
          categorySlug="ongoing"
        />
        <ListItemHorizontal 
          title="Completed Anime" 
          apifetch="https://animekudesu-be.gatradigital.com/completed-anime" 
          queryKey="completed-anime" 
          categorySlug="completed"
        />
        {!genres.isLoading && genres.data.data.map((genre: Genres, index: number) => (
          <ListItemHorizontal
            key={index}
            title={genre.title}
            apifetch={`https://animekudesu-be.gatradigital.com/genre-anime/${genre.id}`}
            queryKey={`genre-${genre.id}`}
            seeAllHref={`/genres/${genre.id}`}
          />
        ))}
      </div>

      {/* Footer */}
      <Footer />

      {/* Banner Popup */}
      {popup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="relative">
            <img
              src="/banner.png"
              alt="Placeholder"
              className="h-96"
            />
            <button 
              onClick={() => setPopup(false)} 
              className="absolute top-[-15px] right-[-15px] bg-gray-900 rounded-full p-2 hover:bg-gray-800 transition duration-300"
            >
              <X />
            </button>
          </div>
        </div>
      )}

      {/* Anime Info Modal */}
      {selectedAnime && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/90 z-[100] p-4 overflow-y-auto scrollbar-modal"
          onClick={() => setSelectedAnime(null)}
        >
          <div 
            className="relative bg-gray-900 rounded-lg w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedAnime(null)} 
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={selectedAnime.img}
                alt={selectedAnime.alt}
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
              
              {/* Title on Image */}
              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-3xl md:text-4xl font-heading text-white drop-shadow-2xl mb-3">
                  {selectedAnime.title}
                </h2>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <Link href={selectedAnime.link}>
                    <button className="bg-white hover:bg-gray-200 text-black font-semibold py-2 px-6 rounded flex items-center gap-2 transition-all">
                      <Play className="w-5 h-5 fill-black" />
                      <span>Play</span>
                    </button>
                  </Link>
                  <button className="w-10 h-10 rounded-full border-2 border-gray-400 hover:border-white bg-black/30 flex items-center justify-center transition-all">
                    <Plus className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              {/* Meta Info */}
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <span className="text-green-500 font-semibold">98% Match</span>
                {selectedAnime.score && Number(selectedAnime.score) > 0 && (
                  <span className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    {Number(selectedAnime.score).toFixed(1)}
                  </span>
                )}
                <span className="border border-gray-500 px-2 py-0.5 text-xs text-gray-300">HD</span>
              </div>
              
              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    Watch {selectedAnime.title} now on Animekudesu. Stream in high quality with no ads. 
                    Experience the best anime streaming with our curated collection.
                  </p>
                  
                  {/* Info Tags */}
                  <div className="flex flex-wrap gap-2">
                    {selectedAnime.type && (
                      <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-xs">
                        {selectedAnime.type}
                      </span>
                    )}
                    <span className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-xs">
                      Anime
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">Released:</span>
                    <span className="text-white">{selectedAnime.released || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Film className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">Episode:</span>
                    <span className="text-white">{selectedAnime.episode || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">~24 min/ep</span>
                  </div>
                </div>
              </div>
              
              {/* View Details Link */}
              <div className="mt-6 pt-4 border-t border-gray-800">
                <Link href={selectedAnime.link}>
                  <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded flex items-center justify-center gap-2 transition-all">
                    <Info className="w-5 h-5" />
                    <span>View Full Details & Episodes</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
