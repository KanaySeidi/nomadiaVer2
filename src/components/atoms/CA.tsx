import kazBtn from "@/assets/img/Astanabutton.png";
import uzbBtn from "@/assets/img/Tashkentbutton.png";
import tjsBtn from "@/assets/img/Dushanbebutton.png";
import trkmBtn from "@/assets/img/Ashabatbutton.png";
import type { CA } from "@/types";

export const CACountry: CA[] = [
  {
    title: "Country.Kazakhstan",
    href: "/central/kazakhstan",
    img: kazBtn,
    id: 1,
  },
  {
    title: "Country.Uzbekistan",
    href: "/central/uzbekistan",
    img: uzbBtn,
    id: 2,
  },
  {
    title: "Country.Tajikistan",
    href: "/central/tadjikistan",
    img: tjsBtn,
    id: 3,
  },
  {
    title: "Country.Turkmenistan",
    href: "/central/turkmenistan",
    img: trkmBtn,
    id: 4,
  },
];
