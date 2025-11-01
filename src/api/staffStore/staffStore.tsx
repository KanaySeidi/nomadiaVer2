import axios from "axios";
import i18next from "i18next";
import { create } from "zustand";

const API = import.meta.env.VITE_APP_URL;

export type TStaff = {
  background_image: string;
  description: string;
  id: number;
  instagram: string;
  name: string;
  position: string;
  profile_image: string;
  whatsapp: string;
  youtube: string;
};

// 2️⃣ Тип состояния стора
type StaffStore = {
  staffs: TStaff[];
  err: string | null;
  fetchStaffs: () => Promise<void>;
};

const useStaffProfile = create<StaffStore>((set) => ({
  staffs: [],
  err: null,
  fetchStaffs: async () => {
    try {
      const language = i18next.language;
      const res = await axios(`${API}/api/stuff?language=${language}`);
      set({ staffs: res.data, err: null });
    } catch (err: any) {
      console.log("Короче ошибена", err);
      set({ err: err.message });
    }
  },
}));

export default useStaffProfile;
