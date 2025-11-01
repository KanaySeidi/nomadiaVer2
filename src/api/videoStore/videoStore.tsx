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

export default useUrlForVideo;
