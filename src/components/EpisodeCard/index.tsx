"use client";
import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { X, Play, Clock } from "lucide-react";
import groupByProvider from "@/utils/groupByProvider";

interface EpisodeCardProps {
  episodeNumber: number;
  title: string;
  description: string;
  img: string;
  detail_eps: string;
}

type PlayerOption = {
  id: string;
  title: string;
  post: string;
  action: string;
  nume: string;
  type: string;
  video: string;
};

type EpisodeDetails = {
  videos: PlayerOption[];
  title: string;
  description: string;
};

const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episodeNumber,
  title,
  description,
  img,
  detail_eps,
}) => {
  const [popup, setPopup] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  async function fetchEpisodeDetails() {
    const { data } = await axios.get(
      `https://animekudesu-be.gatradigital.com${detail_eps}`
    );
    return data;
  }

  const [episodeDetails, setEpisodeDetails] = useState<EpisodeDetails | null>(null);

  const fetchEpisodeDetailsOnTrigger = async () => {
    setEpisodeDetails(null);
    const data = await fetchEpisodeDetails();
    console.log('data', data);
    fetchEpisodeVideos(data.videos[0].video);
    setEpisodeDetails(data);
  };

  const fetchEpisodeVideos = async (video: string) => {
    console.log('video', video);
    
      const response = await fetch(
        `https://animekudesu-be.gatradigital.com${video}`
      );
      const data = await response.json();
      setVideoUrl(data.url);
  };

  useEffect(() => {
    if (episodeDetails) {
      setPopup(true);
    }
    
  }, [episodeDetails])

  return (
    <Fragment>
      {/* Episode Card - Netflix Style */}
      <div
        onClick={fetchEpisodeDetailsOnTrigger}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative bg-gray-900 rounded-md overflow-hidden cursor-pointer hover:bg-gray-800 transition-all duration-300"
      >
        <div className="flex gap-4 p-3">
          {/* Thumbnail */}
          <div className="relative w-32 h-20 flex-shrink-0 rounded overflow-hidden">
            <img 
              src={img} 
              alt={title}
              className="w-full h-full object-cover"
            />
            {/* Play overlay on hover */}
            <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                <Play className="w-5 h-5 text-black fill-black ml-0.5" />
              </div>
            </div>
            {/* Episode number badge */}
            <div className="absolute bottom-1 right-1 bg-black/80 px-2 py-0.5 rounded text-xs font-medium">
              {episodeNumber}
            </div>
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-white text-sm truncate">
                Episode {episodeNumber}
              </h3>
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Clock className="w-3 h-3" />
                <span>24m</span>
              </div>
            </div>
            <p className="text-gray-400 text-xs line-clamp-2">{title}</p>
            <p className="text-gray-500 text-xs mt-1 line-clamp-1">{description}</p>
          </div>
        </div>
        
        {/* Bottom border highlight on hover */}
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 transform origin-left transition-transform duration-300 ${isHovered ? 'scale-x-100' : 'scale-x-0'}`} />
      </div>

      {/* Video Popup Modal */}
      {popup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-[100] p-4 overflow-y-auto scrollbar-modal">
          <div className="relative bg-gray-900 rounded-lg w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-modal">
            {/* Close Button */}
            <button 
              onClick={() => setPopup(false)} 
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-t-lg overflow-hidden">
              {videoUrl ? (
                <iframe
                  src={videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title="Video Player"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full" />
                </div>
              )}
            </div>
            
            {/* Episode Info */}
            <div className="p-6">
              <h2 className="text-2xl font-heading text-white mb-2">{episodeDetails?.title}</h2>
              <p className="text-gray-400 mb-6">{episodeDetails?.description}</p>
              
              {/* Server Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Select Server</h3>
                {Object.entries(groupByProvider(episodeDetails?.videos || [])).map(
                  ([providerName, videos], index) => (
                    <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
                        {providerName}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {videos.map((video, idx) => (
                          <button
                            key={idx}
                            onClick={() => fetchEpisodeVideos(video.video)}
                            className="bg-gray-700 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                          >
                            {video.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default EpisodeCard;
