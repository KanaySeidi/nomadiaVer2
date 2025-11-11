import kazBtn from "@/assets/img/Astanabutton.png";
import uzbBtn from "@/assets/img/Tashkentbutton.png";
import tjsBtn from "@/assets/img/Dushanbebutton.png";
import trkmBtn from "@/assets/img/Ashabatbutton.png";
import type { CA } from "@/types";

export const CACountry: CA[] = [
  {
    text: "Country.Kazakhstan",
    link: "/central/kazakhstan",
    image: kazBtn,
    id: 1,
  },
  {
    text: "Country.Uzbekistan",
    link: "/central/uzbekistan",
    image: uzbBtn,
    id: 2,
  },
  {
    text: "Country.Tajikistan",
    link: "/central/tadjikistan",
    image: tjsBtn,
    id: 3,
  },
  {
    text: "Country.Turkmenistan",
    link: "/central/turkmenistan",
    image: trkmBtn,
    id: 4,
  },
];
