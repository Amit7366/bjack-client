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

export type EventGame = {
  game_name: string;
  game_code: string;
  game_type: string;
  game_image: string;
};

export const eventGames: EventGame[] = [
  {
    game_name: "Gates of Olympus 1000",
    game_code: "4ae52ed2e1a8c353878ba65ed7791ac4",
    game_type: "Event",
    game_image: "https://i.ibb.co.com/QF3Fgq1K/gates-of-olympus-1000.png",
  },
  {
    game_name: "Jackpot Fishing 2",
    game_code: "b8e1e1eb06f840517980f96164bc3ccd",
    game_type: "Event",
    game_image: "https://i.ibb.co.com/pjqFDdGG/jackpot-fishing-2.png",
  },
  {
    game_name: "Ocean King Jackpot",
    game_code: "564c48d53fcddd2bcf0bf3602d86c958",
    game_type: "Event",
    game_image: "https://i.ibb.co.com/kVF7Q0sM/ocean-king-jackpot.png",
  },
  {
    game_name: "Big Bass Bonanza 1000",
    game_code: "00d1836f3a1200cb6754a61be4c39160",
    game_type: "Event",
    game_image: "https://i.ibb.co.com/LXWZmshF/big-bass-bonaza.png",
  },
  {
    game_name: "Fury of Anubis",
    game_code: "164e9f766ca5e9c99187adbcd395362e",
    game_type: "Event",
    game_image: "https://i.ibb.co.com/bMmJpzMy/fury-of-anubis.png",
  },
  {
    game_name: "Fishing God",
    game_code: "edb98312aaed3c315714a046199bbe97",
    game_type: "Event",
    game_image: "https://i.ibb.co.com/8ndw72b4/fishing-god.png",
  },
  {
    game_name: "Fiery Sevens",
    game_code: "bdae4f230380566a9f21510676ec95a9",
    game_type: "Event",
    game_image: "https://i.ibb.co.com/4nJZvMXW/fiery-sevens.png",
  },
  {
    game_name: "Mega Fishing",
    game_code: "caacafe3f64a6279e10a378ede09ff38",
    game_type: "Event",
    game_image: "https://i.ibb.co.com/7NzZstkd/mega-fishing.png",
  },
];

/** Banner carousel slides for the home Event section (clickable via gameCode). */
export const eventCarouselSlides: CarouselSlide[] = eventGames.map((game) => ({
  image: game.game_image,
  gameCode: game.game_code,
  title: game.game_name,
}));

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
