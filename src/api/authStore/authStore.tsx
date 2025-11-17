import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const API = import.meta.env.VITE_APP_URL;

export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
};

type AuthStore = {
  token: string | null;
  user: {
    id: number;
    username: string;
    role: string;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
  clearError: () => void;
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Функция логина
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.post<AuthResponse>(
            `${API}/api/auth/sign-in`,
            credentials
          );

          const { token, user } = response.data;

          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Устанавливаем токен в заголовки axios для последующих запросов
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message ||
            err.response?.data?.error ||
            "Ошибка при входе. Проверьте данные.";

          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });

          throw new Error(errorMessage);
        }
      },

      // Функция выхода
      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null,
        });

        // Удаляем токен из заголовков
        delete axios.defaults.headers.common["Authorization"];

        // Очищаем localStorage
        localStorage.removeItem("auth-storage");
      },

      // Проверка авторизации
      checkAuth: () => {
        const state = get();
        return state.isAuthenticated && !!state.token;
      },

      // Очистка ошибки
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage", // ключ в localStorage
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Восстанавливаем токен в axios при загрузке приложения
const token = useAuthStore.getState().token;
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default useAuthStore;
