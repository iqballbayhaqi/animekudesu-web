"use client";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import Loading from "@/components/Loading";
import ListItemHorizontal from "@/components/ListItemHorizontal";

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

export default function Home() {
  const newAnime = useQuery({
    queryKey: ["new-anime"],
    queryFn: fetchNewAnime,
  });

  const genres = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
  });

  if (newAnime.isLoading)
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
          <div className="">
            <Loading />
          </div>
        </div>
      </div>
    );
    
  if (newAnime.error) return <div>Error: {(newAnime.error as Error).message}</div>;

  return (
    <div className="bg-black">
      <Navbar />
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        spaceBetween={0}
        slidesPerView={1} // <--- satu per satu
        className="overflow-hidden"
      >
        {newAnime.data.data.map((anime, index) => (
          <SwiperSlide key={index}>
            <Link href={anime.link}>
              <div className="relative group h-[65vh] md:h-[85vh] w-full cursor-pointer overflow-hidden">
                {/* Gambar */}
                <img
                  src={anime.img}
                  alt={anime.alt}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500"></div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 p-6 z-10">
                  <h3 className="text-white text-2xl md:text-5xl font-bold drop-shadow-md">
                    {anime.title}
                  </h3>
                  <p className="text-gray-300 text-sm mt-2">
                    {anime.episode} ・ {anime.released}
                  </p>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex flex-col gap-4 my-4">
        <ListItemHorizontal title="On Going Anime" apifetch="https://animekudesu-be.gatradigital.com/ongoing-anime" queryKey="on-going-anime" />
        <ListItemHorizontal title="Completed Anime" apifetch="https://animekudesu-be.gatradigital.com/completed-anime" queryKey="completed-anime" />
        <ListItemHorizontal title="Completed Anime" apifetch="https://animekudesu-be.gatradigital.com/completed-anime" queryKey="completed-anime" />
        {!genres.isLoading && genres.data.data.map((genre, index) => (
          <ListItemHorizontal
            key={index}
            title={genre.title}
            apifetch={`https://animekudesu-be.gatradigital.com/genre-anime/${genre.id}`}
            queryKey={`genre-${genre.id}`}
          />
        ))}
      </div>
    </div>
  );
}
