import axios from "axios";
import { create } from "zustand";
import type { Tour } from "@/types";

const API = import.meta.env.VITE_APP_URL;

type AdminTourStore = {
  tours: Tour[];
  loading: boolean;
  error: string | null;
  fetchAllTours: () => Promise<void>;
  fetchTourById: (id: number) => Promise<Tour>;
  updateTour: (id: number, formData: FormData) => Promise<void>;
  deleteTour: (id: number) => Promise<void>;
};

export const useAdminTourStore = create<AdminTourStore>((set, get) => ({
  tours: [],
  loading: false,
  error: null,

  fetchAllTours: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get<Tour[]>(`${API}/api/edit/tours`);
      set({ tours: data, loading: false });
    } catch (error) {
      console.error("Ошибка при получении туров:", error);
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Неизвестная ошибка",
        loading: false,
      });
    }
  },

  deleteTour: async (id: number) => {
    try {
      await axios.delete(`${API}/api/edit/tours/${id}`);
      // Удаляем тур из локального состояния
      set({ tours: get().tours.filter((tour) => tour.id !== id) });
    } catch (error) {
      console.error("Ошибка при удалении тура:", error);
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Ошибка при удалении",
      });
      throw error;
    }
  },

  fetchTourById: async (id: number) => {
    try {
      const { data } = await axios.get<Tour>(`${API}/api/edit/tours/${id}`);
      return data;
    } catch (error) {
      console.error("Ошибка при получении тура:", error);
      throw error;
    }
  },

  updateTour: async (id: number, formData: FormData) => {
    try {
      await axios.put(`${API}/api/edit/tours/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Обновляем список туров
      await get().fetchAllTours();
    } catch (error) {
      console.error("Ошибка при обновлении тура:", error);
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Ошибка при обновлении",
      });
      throw error;
    }
  },
}));
