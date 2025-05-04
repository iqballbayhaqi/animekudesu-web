"use client";
import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface EpisodeCardProps {
  episodeNumber: number;
  title: string;
  description: string;
  img: string;
  detail_eps: string;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episodeNumber,
  title,
  description,
  img,
  detail_eps,
}) => {
  async function fetchEpisodeDetails() {
    const { data } = await axios.get(
      `https://animekudesu-be.gatradigital.com${detail_eps}`
    );
    return data;
  }

  const episodeDetails = useQuery({
    queryKey: ["episode-details"],
    queryFn: fetchEpisodeDetails,
  });

  const fetchEpisodeVideos = async () => {
    if (episodeDetails.data) {
      const response = await fetch(
        `https://animekudesu-be.gatradigital.com${episodeDetails.data.videos[0].video}`
      );
      const data = await response.json();
      window.open(data.url, "_blank");
    }
  };

  return (
    <div
      onClick={fetchEpisodeVideos}
      className="relative rounded-lg p-4 w-full sm:w-64 shadow-sm bg-cover bg-center transform transition-transform duration-300 hover:scale-105"
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
  );
};

export default EpisodeCard;
