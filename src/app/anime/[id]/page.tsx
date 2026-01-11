/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import Image from "next/image";
import EpisodeCard from "@/components/EpisodeCard";
import dataSupport from "@/utils/dataSupport";

async function fetch(id: string) {
  const { data } = await axios.get(
    `https://animekudesu-be.gatradigital.com/detail-anime/${id}`
  );
  return data;
}

const Anime = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["detail-anime"],
    queryFn: () => fetch(id),
  });

  if (isLoading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  if (isError)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h1 className="text-white">Error</h1>
      </div>
    );

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
      <main className="relative bg-black text-white">
        <div className="relative w-full h-[90vh]">
          <Image
            src={
              dataSupport.find((support) => support.slug === id)?.landscape ||
              data.img
            }
            alt={data.title}
            layout="fill"
            objectFit="cover"
            className="brightness-50 object-center"
          />
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="p-8">
              {dataSupport.some((support) => support.slug === id) &&
              dataSupport.find((support) => support?.slug === id)?.logo !== "" ? (
                <img
                  src={
                    dataSupport.find((support) => support.slug === id)?.logo || ""
                  }
                  alt="Support Logo"
                  width={0}
                  height={250}
                  className="mb-4 w-auto h-[200px] sm:h-[250px]"
                />
              ) : (
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {data.synonims}
                </h1>
              )}
              <h1 className="text-xl md:text-4xl font-bold mb-4 w-1/2">
                {data.japanese_title}
              </h1>
              <div className="flex items-center gap-3 mb-4 text-sm text-gray-300 flex-wrap">
                <span>|</span>
                <span>{`${data.type}`}</span>
                <span>|</span>
                {data.genres.map((genre: { tag: string }, index: number) => (
                  <React.Fragment key={index}>
                    <a href="#" className="underline hover:text-white">
                      {genre.tag}
                    </a>
                    {index < data.genres.length - 1 && <span>|</span>}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex items-center mb-6">
                <span className="text-yellow-400 text-lg font-semibold mr-2">{`★ ${data.rating}`}</span>
                <span className="text-sm text-gray-300">{`(${data.rating_count})`}</span>
              </div>
              <button className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-md cursor-pointer">
                START WATCHING E1
              </button>
            </div>
            <div className="p-8 sm:grid grid-cols-1 md:grid-cols-2 gap-8 bg-gradient-to-t from-black via-black/70 to-transparent hidden w-full">
              <div className="text-sm text-gray-400 mb-4 h-48 overflow-y-scroll">
                {data.descriptions.map((desc: string, index: number) => (
                  <p key={index} className="text-gray-300 mb-2">
                    {desc}
                  </p>
                ))}
              </div>
              <div className="text-sm text-gray-400">
                <p>
                  <span className="font-semibold">English:</span>{" "}
                  {data.english_title.trim()}
                </p>
                <p>
                  <span className="font-semibold">Season:</span> {data.season}
                </p>
                <p>
                  <span className="font-semibold">Producers:</span>{" "}
                  {data.producer}
                </p>
                <p>
                  <span className="font-semibold">Studio:</span> {data.studio}
                </p>
                <p>
                  <span className="font-semibold">Released:</span>{" "}
                  {data.released}
                </p>
                <p>
                  <span className="font-semibold">Source:</span> {data.source}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="flex gap-4 p-8 flex-wrap justify-center">
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
  );
};

export default Anime;
