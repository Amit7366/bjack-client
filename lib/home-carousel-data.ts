import type { GameTile } from "./game-tile";
import { popularGames } from "./home-games-data";

export type ExclusiveCarouselGame = GameTile;

export type CarouselSlide = {
  image: string;
  /** i18n key under `t.home.games` */
  gameId?: string;
  /** Provider game_code from server game data */
  gameCode?: string;
  /** used when `gameId` is not set */
  title?: string;
};

export const eventSlideImages = [
  "https://img.b112j.com/upload/announcement/image_304033.jpg",
  "https://img.b112j.com/upload/announcement/image_304033.jpg",
  "https://img.b112j.com/upload/announcement/image_296754.jpg",
  "https://img.b112j.com/upload/announcement/image_297951.jpg",
];

const exclusiveCarouselBannerImages = [
  "https://img.b112j.com/upload/h5Announcement/image_303040.png",
  "https://img.b112j.com/upload/h5Announcement/image_303092.png",
  "https://img.b112j.com/upload/h5Announcement/image_302600.png",
  "https://img.b112j.com/upload/h5Announcement/image_303094.png",
  "https://img.b112j.com/upload/h5Announcement/image_303096.png",
  "https://img.b112j.com/upload/h5Announcement/image_303098.png",
  "https://img.b112j.com/upload/h5Announcement/image_303100.png",
  "https://img.b112j.com/upload/h5Announcement/image_303040.png",
  "https://img.b112j.com/upload/h5Announcement/image_303092.png",
  "https://img.b112j.com/upload/h5Announcement/image_302600.png",
  "https://img.b112j.com/upload/h5Announcement/image_303094.png",
  "https://img.b112j.com/upload/h5Announcement/image_303096.png",
  "https://img.b112j.com/upload/h5Announcement/image_303098.png",
  "https://img.b112j.com/upload/h5Announcement/image_303100.png",
];

/**
 * Same `GameTile` shape as `popularGames` / vendor lobby; banner URLs override `image`;
 * `id` is row-unique for lists (i18n still keys off {@link CarouselSlide.gameId}).
 */
export const exclusiveCarouselGames: ExclusiveCarouselGame[] =
  exclusiveCarouselBannerImages.map((image, index) => {
    const base = popularGames[index % popularGames.length];
    return {
      ...base,
      id: `exclusive-carousel-${index}`,
      image,
    };
  });

export const exclusiveCarouselSlides: CarouselSlide[] = exclusiveCarouselGames.map(
  (g, index) => ({
    image: g.image,
    gameId: popularGames[index % popularGames.length].id,
    gameCode: g.gameCode,
  }),
);
