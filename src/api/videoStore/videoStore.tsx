import axios from "axios";
import { create } from "zustand";

const API = import.meta.env.VITE_APP_URL;

const useUrlForVideo = create((set) => ({
  url: "",
  err: null,
  getURLForVideo: async () => {
    try {
      const res = await axios(`${API}/api/video`);
      set({ url: res.data, err: null });
    } catch (err: any) {
      console.log("Ошибка");
      set({ err: err.message });
    }
  },
}));

// Admin video store
type AdminVideoStore = {
  loading: boolean;
  error: string | null;
  addVideo: (link: string) => Promise<void>;
};

export const useAdminVideoStore = create<AdminVideoStore>((set) => ({
  loading: false,
  error: null,
  addVideo: async (link: string) => {
    set({ loading: true, error: null });
    try {
      await axios.post(`${API}/api/video`, { link });
      set({ loading: false });
    } catch (err: any) {
      set({ loading: false, error: err.response?.data?.message || err.message });
      throw err;
    }
  },
}));

export default useUrlForVideo;
