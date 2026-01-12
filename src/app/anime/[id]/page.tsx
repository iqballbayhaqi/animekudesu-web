/* eslint-disable @next/next/no-img-element */
"use client";
import React, { use, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import Image from "next/image";
import EpisodeCard from "@/components/EpisodeCard";
import Footer from "@/components/Footer";
import dataSupport from "@/utils/dataSupport";
import { getTrailerBySlug, getYouTubeEmbedUrl } from "@/utils/animeTrailers";
import { Play, Plus, ThumbsUp, Info, Volume2, VolumeX } from "lucide-react";

async function fetchAnimeDetail(id: string) {
  const { data } = await axios.get(
    `https://animekudesu-be.gatradigital.com/detail-anime/${id}`
  );
  return data;
}

interface AnimePageProps {
  params: Promise<{ id: string }>;
}

const Anime = (props: AnimePageProps) => {
  const { id } = use(props.params);
  const [isMuted, setIsMuted] = useState(true);
  
  // Get trailer info from config
  const trailer = getTrailerBySlug(id);
  const trailerUrl = getYouTubeEmbedUrl(id, { muted: isMuted });
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ["detail-anime", id],
    queryFn: () => fetchAnimeDetail(id),
  });

  if (isLoading)
    return (
      <div className="w-full h-screen flex justify-center items-center bg-black">
        <Loading />
      </div>
    );
  if (isError)
    return (
      <div className="w-full h-screen flex justify-center items-center bg-black">
        <h1 className="text-white">Error</h1>
      </div>
    );

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <main className="relative">
        <div className="relative w-full h-[70vh] min-h-[400px] max-h-[500px] md:min-h-[600px] md:max-h-none lg:min-h-[700px] overflow-hidden">
          {/* Video Background for supported anime */}
          {trailer && trailerUrl ? (
            <>
              <div className="absolute inset-0 w-full h-full">
                <iframe
                  src={trailerUrl}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] sm:w-[200%] sm:h-[200%] md:w-[150%] md:h-[150%] pointer-events-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${trailer.title || 'Anime'} Trailer`}
                />
              </div>
              
              {/* Mute/Unmute Button - positioned differently on mobile */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute bottom-4 right-4 md:bottom-24 md:right-16 z-30 w-9 h-9 md:w-12 md:h-12 rounded-full border border-gray-500 md:border-2 md:border-gray-400 hover:border-white bg-black/60 md:bg-black/50 flex items-center justify-center transition-all"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 md:w-6 md:h-6 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 md:w-6 md:h-6 text-white" />
                )}
              </button>
            </>
          ) : (
            <Image
              src={
                dataSupport.find((support) => support.slug === id)?.landscape ||
                data.img
              }
              alt={data.title}
              layout="fill"
              objectFit="cover"
              className="object-top"
            />
          )}
          
          {/* Gradient Overlays - stronger on mobile for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 md:via-black/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 md:via-black/20 to-black/30 z-10" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end px-4 sm:px-6 md:px-16 pb-8 md:pb-16 pt-20 z-20">
            <div className="max-w-2xl">
              {/* Logo or Title */}
              {dataSupport.some((support) => support.slug === id) &&
              dataSupport.find((support) => support?.slug === id)?.logo !== "" ? (
                <img
                  src={dataSupport.find((support) => support.slug === id)?.logo || ""}
                  alt="Logo"
                  className="mb-3 md:mb-4 w-auto h-[60px] sm:h-[80px] md:h-[120px] lg:h-[150px] drop-shadow-2xl"
                />
              ) : (
                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-heading mb-2 md:mb-3 drop-shadow-2xl leading-tight">
                  {data.synonims}
                </h1>
              )}
              
              {/* Japanese Title - smaller on mobile */}
              <p className="text-sm sm:text-base md:text-xl text-gray-300 mb-2 md:mb-3 font-light line-clamp-1">
                {data.japanese_title}
              </p>
              
              {/* Meta Info */}
              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-2 md:mb-3 flex-wrap text-[10px] sm:text-xs md:text-sm">
                <span className="text-green-500 font-semibold">{data.rating}% Match</span>
                <span className="border border-gray-500 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs">{data.type}</span>
                <span className="text-gray-400 hidden sm:inline">{data.season}</span>
                <span className="border border-gray-500 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs">HD</span>
              </div>
              
              {/* Genres - show fewer on mobile */}
              <div className="flex items-center gap-1.5 sm:gap-2 mb-3 md:mb-4 flex-wrap">
                {data.genres.slice(0, 3).map((genre: { tag: string }, index: number) => (
                  <React.Fragment key={index}>
                    <span className="text-[10px] sm:text-xs md:text-sm text-gray-300">{genre.tag}</span>
                    {index < Math.min(data.genres.length, 3) - 1 && (
                      <span className="text-gray-600">•</span>
                    )}
                  </React.Fragment>
                ))}
                {data.genres.length > 3 && (
                  <span className="hidden md:inline text-gray-600">•</span>
                )}
                {data.genres.slice(3, 4).map((genre: { tag: string }, index: number) => (
                  <span key={index + 3} className="hidden md:inline text-xs md:text-sm text-gray-300">{genre.tag}</span>
                ))}
              </div>
              
              {/* Description - Hidden on mobile */}
              <p className="hidden md:block text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed max-w-xl">
                {data.descriptions[0]}
              </p>
              
              {/* Action Buttons - compact on mobile */}
              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                <button className="bg-white hover:bg-gray-200 text-black font-semibold py-1.5 px-3 sm:py-2 sm:px-4 md:py-3 md:px-8 rounded flex items-center gap-1.5 sm:gap-2 transition-all text-xs sm:text-sm md:text-base">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 fill-black" />
                  <span>Play</span>
                </button>
                <button className="bg-gray-600/80 hover:bg-gray-600 text-white font-semibold py-1.5 px-3 sm:py-2 sm:px-4 md:py-3 md:px-8 rounded flex items-center gap-1.5 sm:gap-2 transition-all text-xs sm:text-sm md:text-base">
                  <Info className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  <span className="hidden sm:inline">More Info</span>
                  <span className="sm:hidden">Info</span>
                </button>
                <button className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border border-gray-500 sm:border-2 sm:border-gray-400 hover:border-white flex items-center justify-center transition-all">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>
                <button className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border border-gray-500 sm:border-2 sm:border-gray-400 hover:border-white flex items-center justify-center transition-all">
                  <ThumbsUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Episode Section */}
      <section className="relative z-10 pb-8 md:pb-16 bg-black">
        <div className="px-4 sm:px-6 md:px-16">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-heading tracking-wide">EPISODES</h2>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
              <span>{data.episodes.length} Episodes</span>
            </div>
          </div>
          
          {/* Episode Grid - 2 columns on mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {data.episodes
              .slice()
              .reverse()
              .map(
                (
                  episode: {
                    episode: number;
                    title: string;
                    description: string;
                    detail_eps: string;
                  },
                  index: number
                ) => (
                  <EpisodeCard
                    key={index}
                    episodeNumber={episode.episode}
                    title={episode.title}
                    description={episode.description}
                    img={data.img}
                    detail_eps={episode.detail_eps}
                  />
                )
              )}
          </div>
        </div>
        
        {/* More Details Section */}
        <div className="px-4 sm:px-6 md:px-16 mt-8 md:mt-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-heading tracking-wide mb-4 md:mb-6">ABOUT THIS ANIME</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 bg-gray-900/50 rounded-lg p-4 sm:p-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 md:mb-4 text-white">Synopsis</h3>
              <div className="text-gray-400 text-xs sm:text-sm leading-relaxed space-y-2 sm:space-y-3">
                {data.descriptions.map((desc: string, index: number) => (
                  <p key={index}>{desc}</p>
                ))}
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3 text-sm">
              <div className="flex gap-2">
                <span className="text-gray-500 w-20 sm:w-24 flex-shrink-0 text-xs sm:text-sm">English:</span>
                <span className="text-white text-xs sm:text-sm">{data.english_title.trim()}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 w-20 sm:w-24 flex-shrink-0 text-xs sm:text-sm">Season:</span>
                <span className="text-white text-xs sm:text-sm">{data.season}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 w-20 sm:w-24 flex-shrink-0 text-xs sm:text-sm">Studio:</span>
                <span className="text-white text-xs sm:text-sm">{data.studio}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 w-20 sm:w-24 flex-shrink-0 text-xs sm:text-sm">Producers:</span>
                <span className="text-white text-xs sm:text-sm line-clamp-2">{data.producer}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 w-20 sm:w-24 flex-shrink-0 text-xs sm:text-sm">Released:</span>
                <span className="text-white text-xs sm:text-sm">{data.released}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 w-20 sm:w-24 flex-shrink-0 text-xs sm:text-sm">Source:</span>
                <span className="text-white text-xs sm:text-sm">{data.source}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 w-20 sm:w-24 flex-shrink-0 text-xs sm:text-sm">Rating:</span>
                <span className="text-yellow-400 flex items-center gap-1 text-xs sm:text-sm">
                  ★ {data.rating} <span className="text-gray-500">({data.rating_count})</span>
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-gray-500 w-20 sm:w-24 flex-shrink-0 text-xs sm:text-sm">Genres:</span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {data.genres.map((genre: { tag: string }, index: number) => (
                    <span key={index} className="bg-red-600/20 text-red-400 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs">
                      {genre.tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Anime;
