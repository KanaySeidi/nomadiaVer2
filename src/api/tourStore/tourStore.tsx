import axios from "axios";
import i18next from "i18next";
import { create } from "zustand";
import type { Tour } from "@/types";

const API = import.meta.env.VITE_APP_URL;

type KyrgyzstanToursStore = {
  tours: Tour[];
  error: string | null;
  fetchTours: (countryCode: string | string[]) => Promise<void>;
};

export const useKyrgyzstanTours = create<KyrgyzstanToursStore>((set) => ({
  tours: [],
  error: null,
  fetchTours: async (countryCode) => {
    try {
      const language = i18next.language;
      const { data } = await axios.get<Tour[]>(`${API}/api/tours`, {
        params: {
          languageCode: language,
          countries: Array.isArray(countryCode)
            ? countryCode.join(",")
            : countryCode,
        },
      });
      set({ tours: data, error: null });
    } catch (error: unknown) {
      console.error("Ошибка при отправке запроса:", error);
      set({
        error: axios.isAxiosError(error) ? error.message : "Unknown error",
      });
    }
  },
}));

type TourByIdStore = {
  tour: Tour | null;
  err: string | null;
  getTourById: (id: number | string) => Promise<void>;
};

export const useTourById = create<TourByIdStore>((set) => ({
  tour: null,
  err: null,
  getTourById: async (id) => {
    try {
      const language = i18next.language;
      const { data } = await axios.get<Tour>(`${API}/api/tours/${id}`, {
        params: { languageCode: language },
      });
      set({ tour: data, err: null });
    } catch (error: unknown) {
      console.log("Ошибка короче", error);
      set({ err: axios.isAxiosError(error) ? error.message : "Unknown error" });
    }
  },
}));
