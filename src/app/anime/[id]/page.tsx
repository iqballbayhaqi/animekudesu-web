/* eslint-disable @next/next/no-img-element */
"use client";
import React, { use, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import Image from "next/image";
import EpisodeCard from "@/components/EpisodeCard";
import Footer from "@/components/Footer";
import dataSupport from "@/utils/dataSupport";
import { getTrailerBySlug, getYouTubeEmbedUrl } from "@/utils/animeTrailers";
import { Play, Plus, Check, ThumbsUp, Info, Volume2, VolumeX, X, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { isInMyList, toggleMyList, isAnimeLiked, toggleLikeAnime } from "@/utils/myList";
import groupByProvider from "@/utils/groupByProvider";

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
  const [isInList, setIsInList] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [episodeDetails, setEpisodeDetails] = useState<{
    videos: { id: string; title: string; video: string; type: string }[];
    title: string;
    description: string;
  } | null>(null);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc'); // desc = newest first, asc = oldest first
  
  // Get trailer info from config
  const trailer = getTrailerBySlug(id);
  const trailerUrl = getYouTubeEmbedUrl(id, { muted: isMuted });
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ["detail-anime", id],
    queryFn: () => fetchAnimeDetail(id),
  });

  // Check if anime is in My List and Liked
  useEffect(() => {
    if (data) {
      const link = `/anime/${id}`;
      
      const checkList = () => {
        setIsInList(isInMyList(link));
      };
      
      const checkLiked = () => {
        setIsLiked(isAnimeLiked(link));
      };
      
      checkList();
      checkLiked();
      
      // Listen for updates
      const handleListUpdate = () => checkList();
      const handleLikedUpdate = () => checkLiked();
      
      window.addEventListener('mylist-updated', handleListUpdate);
      window.addEventListener('liked-updated', handleLikedUpdate);
      
      return () => {
        window.removeEventListener('mylist-updated', handleListUpdate);
        window.removeEventListener('liked-updated', handleLikedUpdate);
      };
    }
  }, [data, id]);

  // Handle add/remove from My List
  const handleToggleMyList = useCallback(() => {
    if (!data) return;
    
    toggleMyList({
      link: `/anime/${id}`,
      img: data.img,
      alt: data.title,
      title: data.title,
      episode: `${data.episodes?.length || 0} Episodes`,
      released: data.released,
      type: data.type,
      score: parseFloat(data.rating) || 0,
    });
  }, [data, id]);

  // Handle like/unlike
  const handleToggleLike = useCallback(() => {
    toggleLikeAnime(`/anime/${id}`);
  }, [id]);

  // Fetch video URL
  const fetchVideoUrl = useCallback(async (videoPath: string) => {
    try {
      const response = await fetch(`https://animekudesu-be.gatradigital.com${videoPath}`);
      const videoData = await response.json();
      setVideoUrl(videoData.url);
    } catch (error) {
      console.error('Failed to fetch video:', error);
    }
  }, []);

  // Play latest episode
  const handlePlayLatest = useCallback(async () => {
    if (!data || !data.episodes || data.episodes.length === 0) return;
    
    // Get the latest episode (last in the array)
    const latestEpisode = data.episodes[data.episodes.length - 1];
    
    try {
      setVideoUrl(null);
      setEpisodeDetails(null);
      setShowPlayer(true);
      
      const response = await axios.get(
        `https://animekudesu-be.gatradigital.com${latestEpisode.detail_eps}`
      );
      
      setEpisodeDetails(response.data);
      
      // Auto-play first video
      if (response.data.videos && response.data.videos.length > 0) {
        fetchVideoUrl(response.data.videos[0].video);
      }
    } catch (error) {
      console.error('Failed to fetch episode:', error);
    }
  }, [data, fetchVideoUrl]);

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
                      <span className="text-gray-600">�</span>
                    )}
                  </React.Fragment>
                ))}
                {data.genres.length > 3 && (
                  <span className="hidden md:inline text-gray-600">�</span>
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
                <button 
                  onClick={handlePlayLatest}
                  className="bg-white hover:bg-gray-200 text-black font-semibold py-1.5 px-3 sm:py-2 sm:px-4 md:py-3 md:px-8 rounded flex items-center gap-1.5 sm:gap-2 transition-all text-xs sm:text-sm md:text-base"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 fill-black" />
                  <span>Play</span>
                </button>
                <button 
                  onClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gray-600/80 hover:bg-gray-600 text-white font-semibold py-1.5 px-3 sm:py-2 sm:px-4 md:py-3 md:px-8 rounded flex items-center gap-1.5 sm:gap-2 transition-all text-xs sm:text-sm md:text-base"
                >
                  <Info className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  <span className="hidden sm:inline">More Info</span>
                  <span className="sm:hidden">Info</span>
                </button>
                <button 
                  onClick={handleToggleMyList}
                  className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border sm:border-2 flex items-center justify-center transition-all ${
                    isInList
                      ? 'border-green-500 bg-green-500/30 hover:bg-green-500/50'
                      : 'border-gray-500 sm:border-gray-400 hover:border-white'
                  }`}
                  title={isInList ? 'Remove from My List' : 'Add to My List'}
                >
                  {isInList ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-500" />
                  ) : (
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  )}
                </button>
                <button 
                  onClick={handleToggleLike}
                  className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border sm:border-2 flex items-center justify-center transition-all ${
                    isLiked
                      ? 'border-blue-500 bg-blue-500/30 hover:bg-blue-500/50'
                      : 'border-gray-500 sm:border-gray-400 hover:border-white'
                  }`}
                  title={isLiked ? 'Unlike' : 'Like'}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 ${isLiked ? 'text-blue-500 fill-blue-500' : ''}`} />
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
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm text-gray-400">{data.episodes.length} Episodes</span>
              {/* Sort Toggle Button */}
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors text-xs sm:text-sm"
                title={sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
              >
                {sortOrder === 'desc' ? (
                  <>
                    <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Terbaru</span>
                  </>
                ) : (
                  <>
                    <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Terlama</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Episode Grid - 2 columns on mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {(sortOrder === 'desc' 
              ? data.episodes.slice().reverse() 
              : data.episodes.slice()
            ).map(
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
        <div id="about-section" className="px-4 sm:px-6 md:px-16 mt-8 md:mt-16">
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
                  ? {data.rating} <span className="text-gray-500">({data.rating_count})</span>
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

      {/* Video Player Modal */}
      {showPlayer && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center bg-black/90 z-[100] p-0 sm:p-4 overflow-y-auto scrollbar-modal">
          <div className="relative bg-gray-900 sm:rounded-lg w-full max-w-4xl shadow-2xl max-h-full sm:max-h-[90vh] overflow-y-auto scrollbar-modal">
            {/* Close Button */}
            <button 
              onClick={() => {
                setShowPlayer(false);
                setVideoUrl(null);
                setEpisodeDetails(null);
              }} 
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            {/* Video Player */}
            <div className="relative aspect-video bg-black sm:rounded-t-lg overflow-hidden">
              {videoUrl ? (
                <iframe
                  src={videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title="Video Player"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin w-8 h-8 sm:w-10 sm:h-10 border-4 border-red-600 border-t-transparent rounded-full" />
                </div>
              )}
            </div>
            
            {/* Episode Info */}
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-2xl font-heading text-white mb-1 sm:mb-2">
                {episodeDetails?.title || 'Loading...'}
              </h2>
              <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-none">
                {episodeDetails?.description}
              </p>
              
              {/* Server Selection */}
              {episodeDetails?.videos && (
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-white">Select Server</h3>
                  {Object.entries(groupByProvider(episodeDetails.videos)).map(
                    ([providerName, videos], index) => (
                      <div key={index} className="bg-gray-800/50 rounded-lg p-3 sm:p-4">
                        <h4 className="text-xs sm:text-sm font-medium text-gray-400 mb-2 sm:mb-3 uppercase tracking-wider">
                          {providerName}
                        </h4>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {videos.map((video: { video: string; title: string }, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => fetchVideoUrl(video.video)}
                              className="bg-gray-700 hover:bg-red-600 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm font-medium transition-colors"
                            >
                              {video.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Anime;
