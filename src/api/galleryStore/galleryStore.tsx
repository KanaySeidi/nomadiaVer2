import axios from "axios";
import { create } from "zustand";

const API = import.meta.env.VITE_APP_URL;

export type TGalleryImage = {
  id: number;
  image: string;
};

// Admin gallery store for managing slider images
type AdminGalleryStore = {
  images: TGalleryImage[];
  loading: boolean;
  error: string | null;
  fetchGallery: () => Promise<void>;
  addImage: (imageFile: File) => Promise<void>;
  deleteImage: (id: number) => Promise<void>;
};

export const useAdminGalleryStore = create<AdminGalleryStore>((set, get) => ({
  images: [],
  loading: false,
  error: null,
  
  fetchGallery: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API}/api/gallery`);
      set({ images: response.data, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err.response?.data?.message || err.message });
      throw err;
    }
  },

  addImage: async (imageFile: File) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      
      const response = await axios.post(`${API}/api/gallery`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      // Refresh gallery after adding
      await get().fetchGallery();
      set({ loading: false });
    } catch (err: any) {
      set({ loading: false, error: err.response?.data?.message || err.message });
      throw err;
    }
  },

  deleteImage: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API}/api/gallery/${id}`);
      
      // Remove from local state
      set((state) => ({
        images: state.images.filter((img) => img.id !== id),
        loading: false,
      }));
    } catch (err: any) {
      set({ loading: false, error: err.response?.data?.message || err.message });
      throw err;
    }
  },
}));
