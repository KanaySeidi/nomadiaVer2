import axios from "axios";
import i18next from "i18next";
import { create } from "zustand";

const API = import.meta.env.VITE_APP_URL;

export type TStaff = {
  background_image: string;
  description: string;
  descriptionEng: string;
  id: number;
  instagram: string;
  name: string;
  nameEng: string;
  position: string;
  positionEng: string;
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

type AdminStaffStore = {
  staffs: TStaff[];
  loading: boolean;
  error: string | null;
  fetchAllStaff: () => Promise<void>;
  createStaff: (formData: FormData) => Promise<void>;
  updateStaff: (id: number, formData: FormData) => Promise<void>;
  deleteStaff: (id: number) => Promise<void>;
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

export const useAdminStaffStore = create<AdminStaffStore>((set, get) => ({
  staffs: [],
  loading: false,
  error: null,

  fetchAllStaff: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get<TStaff[]>(`${API}/api/stuff`);
      set({ staffs: data, loading: false });
    } catch (error) {
      console.error("Ошибка при получении персонала:", error);
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Неизвестная ошибка",
        loading: false,
      });
    }
  },

  createStaff: async (formData: FormData) => {
    try {
      await axios.post(`${API}/api/stuff`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await get().fetchAllStaff();
    } catch (error) {
      console.error("Ошибка при создании сотрудника:", error);
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Ошибка при создании",
      });
      throw error;
    }
  },

  updateStaff: async (id: number, formData: FormData) => {
    try {
      await axios.put(`${API}/api/stuff/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await get().fetchAllStaff();
    } catch (error) {
      console.error("Ошибка при обновлении сотрудника:", error);
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Ошибка при обновлении",
      });
      throw error;
    }
  },

  deleteStaff: async (id: number) => {
    try {
      await axios.delete(`${API}/api/stuff/${id}`);
      set({ staffs: get().staffs.filter((staff) => staff.id !== id) });
    } catch (error) {
      console.error("Ошибка при удалении сотрудника:", error);
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Ошибка при удалении",
      });
      throw error;
    }
  },
}));

export default useStaffProfile;
