/* eslint-disable @next/next/no-img-element */
"use client";
import React, { use } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import Image from "next/image";
import EpisodeCard from "@/components/EpisodeCard";
import dataSupport from "@/utils/dataSupport";
import { Play, Plus, ThumbsUp, Info } from "lucide-react";

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
        <div className="relative w-full min-h-[500px] md:min-h-[600px] lg:min-h-[700px]">
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
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/30" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end px-8 md:px-16 pb-16 pt-24">
            <div className="max-w-2xl">
              {/* Logo or Title */}
              {dataSupport.some((support) => support.slug === id) &&
              dataSupport.find((support) => support?.slug === id)?.logo !== "" ? (
                <img
                  src={dataSupport.find((support) => support.slug === id)?.logo || ""}
                  alt="Logo"
                  className="mb-4 w-auto h-[80px] md:h-[120px] lg:h-[150px] drop-shadow-2xl"
                />
              ) : (
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading mb-3 drop-shadow-2xl leading-tight">
                  {data.synonims}
                </h1>
              )}
              
              {/* Japanese Title */}
              <p className="text-base md:text-xl text-gray-300 mb-3 font-light">
                {data.japanese_title}
              </p>
              
              {/* Meta Info */}
              <div className="flex items-center gap-2 md:gap-3 mb-3 flex-wrap text-xs md:text-sm">
                <span className="text-green-500 font-semibold">{data.rating}% Match</span>
                <span className="border border-gray-500 px-2 py-0.5 text-xs">{data.type}</span>
                <span className="text-gray-400">{data.season}</span>
                <span className="border border-gray-500 px-2 py-0.5 text-xs">HD</span>
              </div>
              
              {/* Genres */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {data.genres.slice(0, 4).map((genre: { tag: string }, index: number) => (
                  <React.Fragment key={index}>
                    <span className="text-xs md:text-sm text-gray-300">{genre.tag}</span>
                    {index < Math.min(data.genres.length, 4) - 1 && (
                      <span className="text-gray-600">•</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
              
              {/* Description - Hidden on small screens */}
              <p className="hidden md:block text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed max-w-xl">
                {data.descriptions[0]}
              </p>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                <button className="bg-white hover:bg-gray-200 text-black font-semibold py-2 px-4 md:py-3 md:px-8 rounded flex items-center gap-2 transition-all text-sm md:text-base">
                  <Play className="w-5 h-5 md:w-6 md:h-6 fill-black" />
                  <span>Play</span>
                </button>
                <button className="bg-gray-600/80 hover:bg-gray-600 text-white font-semibold py-2 px-4 md:py-3 md:px-8 rounded flex items-center gap-2 transition-all text-sm md:text-base">
                  <Info className="w-5 h-5 md:w-6 md:h-6" />
                  <span>More Info</span>
                </button>
                <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-400 hover:border-white flex items-center justify-center transition-all">
                  <Plus className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-400 hover:border-white flex items-center justify-center transition-all">
                  <ThumbsUp className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Episode Section */}
      <section className="relative z-10 pb-16 bg-black">
        <div className="px-8 md:px-16">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-heading tracking-wide">EPISODES</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{data.episodes.length} Episodes</span>
            </div>
          </div>
          
          {/* Episode Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
        <div className="px-8 md:px-16 mt-16">
          <h2 className="text-2xl md:text-3xl font-heading tracking-wide mb-6">ABOUT THIS ANIME</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-900/50 rounded-lg p-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Synopsis</h3>
              <div className="text-gray-400 text-sm leading-relaxed space-y-3">
                {data.descriptions.map((desc: string, index: number) => (
                  <p key={index}>{desc}</p>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <span className="text-gray-500 w-24">English:</span>
                <span className="text-white">{data.english_title.trim()}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 w-24">Season:</span>
                <span className="text-white">{data.season}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 w-24">Studio:</span>
                <span className="text-white">{data.studio}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 w-24">Producers:</span>
                <span className="text-white">{data.producer}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 w-24">Released:</span>
                <span className="text-white">{data.released}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 w-24">Source:</span>
                <span className="text-white">{data.source}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 w-24">Rating:</span>
                <span className="text-yellow-400 flex items-center gap-1">
                  ★ {data.rating} <span className="text-gray-500">({data.rating_count})</span>
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-gray-500 w-24">Genres:</span>
                <div className="flex flex-wrap gap-2">
                  {data.genres.map((genre: { tag: string }, index: number) => (
                    <span key={index} className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-xs">
                      {genre.tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Anime;
