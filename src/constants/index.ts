import { FiSun } from "react-icons/fi";
import { BsMoonStarsFill } from "react-icons/bs";
import { GoDeviceDesktop } from "react-icons/go";
import { AiOutlineHome } from "react-icons/ai";
import { TbMovie } from "react-icons/tb";
import { MdOutlineLiveTv } from "react-icons/md";

import { ITheme, INavLink } from "../types";

export const navLinks: INavLink[] = [
  {
    title: "home",
    path: "/",
    icon: AiOutlineHome,
  },
  {
    title: "movies",
    path: "/movie",
    icon: TbMovie,
  },
  {
    title: "tv series",
    path: "/tv",
    icon: MdOutlineLiveTv,
  },
];

export const themeOptions: ITheme[] = [
  {
    title: "Dark",
    icon: BsMoonStarsFill,
  },
  {
    title: "Light",
    icon: FiSun,
  },
  {
    title: "System",
    icon: GoDeviceDesktop,
  },
];

export const footerLinks = [
  "home",
  "live",
  "you must watch",
  "contact us",
  "FAQ",
  "Recent release",
  "term of services",
  "premium",
  "Top IMDB",
  "About us",
  "Privacy policy",
];

export const sections = [
  {
    title: "Popular Movies",
    category: "movie",
    type: "popular",
  },
  {
    title: "Popular TV Shows",
    category: "tv",
    type: "popular",
  },
  {
    title: "Popular Anime",
    category: "anime",
    type: "trending",
  },
  {
    title: "Netflix",
    category: "streaming",
    type: "netflix",
    providerId: 8,
  },
  {
    title: "Amazon Prime Video",
    category: "streaming",
    type: "prime",
    providerId: 119,
  },
  {
    title: "Apple TV Plus",
    category: "streaming",
    type: "appletv",
    providerId: 350,
  },
  {
    title: "Crunchyroll",
    category: "anime",
    type: "crunchyroll",
  },
];
