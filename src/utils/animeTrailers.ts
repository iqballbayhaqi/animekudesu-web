/**
 * Anime Trailers Configuration
 * 
 * File ini berisi konfigurasi video trailer untuk anime.
 * Untuk menambahkan trailer baru, tambahkan object baru ke array animeTrailers.
 * 
 * Format:
 * {
 *   slug: "anime-slug",           // Slug anime (sama dengan URL detail)
 *   youtubeId: "video-id",        // ID video YouTube (dari URL)
 *   title: "Nama Anime",          // Judul anime (opsional, untuk referensi)
 * }
 * 
 * Contoh mengambil YouTube ID dari URL:
 * URL: https://www.youtube.com/watch?v=-G9BqkgZXRA
 * YouTube ID: -G9BqkgZXRA
 * 
 * URL: https://youtu.be/VQGCKyvzIM4
 * YouTube ID: VQGCKyvzIM4
 */

export interface AnimeTrailer {
  slug: string;
  youtubeId: string;
  title?: string;
}

const animeTrailers: AnimeTrailer[] = [
  {
    slug: "naruto-kecil",
    youtubeId: "-G9BqkgZXRA",
    title: "Naruto",
  },
  {
    slug: "naruto-shippuden",
    youtubeId: "aLzKjDRoQgA",
    title: "Naruto Shippuden",
  },
  {
    slug: "boruto-naruto-next-generations",
    youtubeId: "ppLE9xycGm4",
    title: "Boruto Naruto Next Generations",
  },
  {
    slug: "si-vis",
    youtubeId: "COu-9u67kRg",
    title: "SI-VIS",
  },
  {
    slug: "digimon-beatbreak",
    youtubeId: "uvHjGnHrn4Y",
    title: "Digimon Beatbreak",
  },
  {
    slug: "kaya-chan-wa-kowakunai",
    youtubeId: "k0b4dBXryKY",
    title: "Kaya-chan wa Kowakunai",
  },
  {
    slug: "ao-no-orchestra-season-2",
    youtubeId: "gLR5Xa2nAtY",
    title: "Ao no Orchestra Season 2",
  },
  {
    slug: "mato-seihei-no-slave",
    youtubeId: "ENN3Ati242c",
    title: "Mato Seihei no Slave",
  },
  {
    slug: "mato-seihei-no-slave-season-2",
    youtubeId: "HV5DcLBjN2I",
    title: "Mato Seihei no Slave Season 2",
  },
  {
    slug: "one-piece",
    youtubeId: "MCb13lbVGE0",
    title: "One Piece",
  },
  {
    slug: "shingeki-no-kyojin-the-final-season-part-2",
    youtubeId: "EIVVnLlhzr0",
    title: "Shingeki no Kyojin The Final Season Part 2",
  },
  {
    slug: "ikoku-nikki",
    youtubeId: "1sG-sUROdgE",
    title: "Ikoku Nikki",
  },
  {
    slug: "jujutsu-kaisen-season-3",
    youtubeId: "RYI-WG_HFV8",
    title: "Jujutsu Kaisen Season 3",
  },
  {
    slug: "uruwashi-no-yoi-no-tsuki",
    youtubeId: "p3PByW3BErQ",
    title: "Uruwashi no Yoi no Tsuki",
  },
  {
    slug: "goumon-baito-kun-no-nichijou",
    youtubeId: "adYllv555BE",
    title: "Goumon Baito-kun no Nichijou",
  },
  {
    slug: "kizoku-tensei-megumareta-umare-kara-saikyou-no-chikara-wo-eru",
    youtubeId: "-NocYI3Lwds",
    title: "Kizoku Tensei Megumareta Umare Kara Saikyou no Chikara wo Eru",
  },
  {
    slug: "vigilante-boku-no-hero-academia-illegals-season-2",
    youtubeId: "i-8-xFFIOoM",
    title: "Vigilante Boku no Hero Academia Illegals Season 2",
  },
  {
    slug: "jigokuraku-season-2",
    youtubeId: "7KnLE6ATZS0",
    title: "Jigokuraku Season 2",
  },
  {
    slug: "majutsushi-kunon-wa-mieteiru",
    youtubeId: "9YNk_ntZ-Ws",
    title: "Majutsushi Kuno on wa Mieteiru",
  },
  {
    slug: "spy-x-family-part-2",
    youtubeId: "ZGVbFUFpbZ4",
    title: "Spy x Family Part 2",
  },
  {
    slug: "2-5-jigen-no-ririsa",
    youtubeId: "IbZ9-zGw1-8",
    title: "2.5 Jigen no Ririsa",
  }
];

/**
 * Get trailer by anime slug
 * @param slug - Anime slug
 * @returns AnimeTrailer object or undefined
 */
export function getTrailerBySlug(slug: string): AnimeTrailer | undefined {
  return animeTrailers.find((trailer) => trailer.slug === slug);
}

/**
 * Check if anime has trailer
 * @param slug - Anime slug
 * @returns boolean
 */
export function hasTrailer(slug: string): boolean {
  return animeTrailers.some((trailer) => trailer.slug === slug);
}

/**
 * Get YouTube embed URL
 * @param slug - Anime slug
 * @param options - Embed options
 * @returns YouTube embed URL or null
 */
export function getYouTubeEmbedUrl(
  slug: string,
  options: {
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
    controls?: boolean;
  } = {}
): string | null {
  const trailer = getTrailerBySlug(slug);
  if (!trailer) return null;

  const {
    autoplay = true,
    muted = true,
    loop = true,
    controls = false,
  } = options;

  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    mute: muted ? "1" : "0",
    loop: loop ? "1" : "0",
    playlist: trailer.youtubeId, // Required for loop
    controls: controls ? "1" : "0",
    showinfo: "0",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    enablejsapi: "1",
  });

  return `https://www.youtube.com/embed/${trailer.youtubeId}?${params.toString()}`;
}

export default animeTrailers;
