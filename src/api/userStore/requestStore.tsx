import axios from "axios";
import { create } from "zustand";

const API = import.meta.env.REACT_APP_URL;
const reqStore = create((set) => ({
  leaveReq: async (data: any) => {
    try {
      const res = await axios.post(`${API}/api/mail/connectwithus`, data);
      set({ response: res.data });
    } catch (error: any) {
      console.error("Ошибка при отправке запроса:", error);
      set({ error: error.message });
    }
  },
  tourReq: async (id: any, data: any) => {
    try {
      const res = await axios.post(`${API}/api/mail/tour/${id}`, data);
      set({ response: res.data });
    } catch (err: any) {
      console.log("Ошибка", err);
      set({ err: err.message });
    }
  },
}));

export default reqStore;
