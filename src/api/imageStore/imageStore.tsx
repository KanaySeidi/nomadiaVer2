import axios from "axios";
import { create } from "zustand";

const API = import.meta.env.VITE_APP_URL;

export type TImage = {
  id: number;
  image: string;
};

type ImageStore = {
  images: TImage[];
  err: string | null;
  getPalaroidImg: () => Promise<void>;
};

type SliderImgStore = {
  images: TImage[];
  err: string | null;
  getSliderImg1: () => Promise<void>;
};

const usePalaroidImg = create<ImageStore>((set) => ({
  images: [],
  err: null,
  getPalaroidImg: async () => {
    try {
      const res = await axios(`${API}/api/polaroid`);
      set({ images: res.data, err: null });
    } catch (err: any) {
      console.log("Ошибка");
      set({ err: err.message });
    }
  },
}));

const useSliderImg1 = create<SliderImgStore>((set, get) => ({
  images: [],
  err: null,
  getSliderImg1: async () => {
    if (get().images.length > 0) return;
    try {
      const res = await axios<TImage[]>(`${API}/api/gallery/first`);
      set({ images: res.data, err: null });
    } catch (err: unknown) {
      console.log("Ошибка");
      set({
        err: axios.isAxiosError(err) ? err.message : "Unknown error",
      });
    }
  },
}));

const useSliderImg2 = create((set, get: any) => ({
  images: [],
  err: null,
  getSliderImg2: async () => {
    if (get().images.length > 0) return;
    try {
      const res = await axios(`${API}/api/gallery/second`);
      set({ images: res.data, err: null });
    } catch (err: any) {
      console.log("Ошибка");
      set({ err: err.message });
    }
  },
}));

export { usePalaroidImg, useSliderImg1, useSliderImg2 };
