"use client";
import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
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
      // window.open(data.url, "_blank");
      setVideoUrl(data.url);
  };

  useEffect(() => {
    if (episodeDetails) {
      setPopup(true);
    }
    
  }, [episodeDetails])

  return (
    <Fragment>
      <div
        onClick={fetchEpisodeDetailsOnTrigger}
        className="relative rounded-lg p-4 w-full sm:w-64 shadow-sm bg-cover bg-center transform transition-transform duration-300 hover:scale-105 cursor-pointer"
        style={{ backgroundImage: `url(${img})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
        <div className="relative">
          <h2 className="text-2xl font-bold mb-2 text-white shadow-lg">
            EPS. {episodeNumber}
          </h2>
          <p className="text-base text-white shadow-lg">{title}</p>
          <p className="text-base text-white shadow-lg">{description}</p>
        </div>
      </div>

      {popup && <div className="fixed inset-0 flex items-start justify-center bg-[#000000a4] z-50 pt-10 overflow-y-auto">
        <div className="relative bg-gray-900 rounded-lg p-4 w-full sm:w-1/2 shadow-lg">
          <div className="">
            {videoUrl ? (
              <iframe
              src={videoUrl}
              className="w-full h-[400px] rounded-lg"
              allowFullScreen
              title="Video Player"
              ></iframe>
            ) : (
              <div className="w-full h-[400px] rounded-lg">
              <p className="text-white text-center">Loading...</p>
              </div>
            )}
            <div className="mt-4">
              <p className="text-2xl">{episodeDetails?.title}</p>
              <p className="text-white">{episodeDetails?.description}</p>  
            </div>
            <div>
              {Object.entries(groupByProvider(episodeDetails?.videos || [])).map(
                ([providerName, videos], index) => (
                  <div key={index} className="mt-4">
                    <h2 className="text-white text-lg mb-2">{providerName}</h2>
                    <div className="flex flex-wrap gap-2">
                      {videos.map((video, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 bg-gray-800 rounded-lg gap-4 w-full sm:w-auto"
                        >
                          <p className="text-white">{video.title}</p>
                          <button
                            onClick={() => fetchEpisodeVideos(video.video)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer"
                          >
                            Watch
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
          <div onClick={() => setPopup(false)} className="absolute top-[-15px] right-[-15px] bg-gray-900 rounded-full p-2 cursor-pointer hover:bg-gray-800 transition duration-300">
            <X />
          </div>
        </div>
        </div>}
    </Fragment>
  );
};

export default EpisodeCard;
