/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import axios from "axios";
import { Star } from "lucide-react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";

interface ListItemHorizontalProps {
  title: string;
  placeholder?: boolean;
  apifetch: string;
  queryKey?: string;
}

interface Anime {
  detail_url: string;
  img: string;
  alt: string;
  title: string;
  type: string;
  score: number;
  genres?: Genre[];
}

interface Genre {
  tag: string;
}

const ListItemHorizontal = (props: ListItemHorizontalProps) => {
  const { title, placeholder, apifetch, queryKey } = props;

  async function fetch() {
    const { data } = await axios.get(apifetch);
    return data;
  }

  const data = useQuery({
    queryKey: [queryKey || Math.random().toString(36).substring(2, 15)],
    queryFn: fetch,
  });

  return (
    <div className="w-full px-4">
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
        }}
      >
        {(placeholder || data.isLoading
          ? Array.from({ length: 10 })
          : data.data.data
        ).map((anime: Anime, index: number) => {
          return (
            <SwiperSlide key={index}>
              {placeholder || data.isLoading ? (
                <div className="group rounded-md animate-pulse">
                  <div className="aspect-[2/3] overflow-hidden rounded-md bg-gray-700">
                    {/* Placeholder untuk gambar */}
                    <div className="w-full h-full bg-gray-600" />
                  </div>
                  <div>
                    {/* Placeholder untuk title */}
                    <div className="h-4 bg-gray-600 rounded mt-2 w-3/4" />

                    {/* Placeholder untuk type & score */}
                    <div className="flex items-center mt-2 space-x-2">
                      <div className="h-3 w-20 bg-gray-600 rounded" />
                      <div className="h-3 w-3 bg-yellow-400 rounded-full" />
                    </div>

                    {/* Placeholder untuk genres */}
                    <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide">
                      <div className="h-5 w-16 bg-gray-600 rounded-full" />
                      <div className="h-5 w-16 bg-gray-600 rounded-full" />
                      <div className="h-5 w-16 bg-gray-600 rounded-full" />
                    </div>
                  </div>
                </div>
              ) : (
                <Link href={anime.detail_url}>
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
                            {anime.genres?.map((genre, index) => (
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
                          anime.genres?.map((genre, index) => (
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
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default ListItemHorizontal;
