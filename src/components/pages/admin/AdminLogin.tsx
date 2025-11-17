import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/api/authStore/authStore";
import logo from "@/assets/icon/nomadia.svg.svg";

type LoginForm = {
  email: string;
  password: string;
};

type FormErrors = {
  email?: string;
  password?: string;
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated, error: authError, clearError } = useAuthStore();

  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Если пользователь уже авторизован, редиректим на дашборд
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Валидация формы
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Валидация email
    if (!formData.email.trim()) {
      newErrors.email = "Введите email или логин";
    } else if (formData.email.length < 3) {
      newErrors.email = "Минимум 3 символа";
    }

    // Валидация password
    if (!formData.password) {
      newErrors.password = "Введите пароль";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Очищаем ошибку при изменении поля
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    clearError(); // Очищаем предыдущие ошибки

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      // Если успешно, редирект произойдет автоматически через useEffect
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      setErrors({
        password: error.message || "Ошибка при входе. Попробуйте позже.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Синхронизируем ошибки из store с локальными ошибками
  useEffect(() => {
    if (authError) {
      setErrors((prev) => ({
        ...prev,
        password: authError,
      }));
    }
  }, [authError]);

  return (
    <div className="min-h-screen flex">
      {/* Левая часть - зеленый фон с логотипом */}
      <div className="hidden lg:flex lg:w-1/2 bg-emerald-900 items-center justify-center p-12">
        <div className="text-center">
          <img 
            src={logo} 
            alt="Nomadia Logo" 
            className="w-64 h-64 mx-auto mb-8 drop-shadow-2xl"
          />
          <h2 className="text-4xl font-bold text-white mb-4">
            Nomadia Tours
          </h2>
          <p className="text-xl text-green-100">
            Админ панель управления
          </p>
        </div>
      </div>

      {/* Правая часть - форма входа */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        {/* Кнопка Go Back в правом верхнем углу */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go Back
        </button>

        <div className="w-full max-w-md">
          {/* Мобильный логотип (показывается только на маленьких экранах) */}
          <div className="lg:hidden text-center mb-8">
            <img 
              src={logo} 
              alt="Nomadia Logo" 
              className="w-24 h-24 mx-auto mb-4"
            />
          </div>

          {/* Заголовок */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Вход в админ панель
            </h1>
            <p className="text-gray-500">
              Введите свои учетные данные для входа
            </p>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Поле Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email или логин
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-green-500"
              }`}
              placeholder="Введите email или логин"
              autoComplete="email"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          {/* Поле Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Пароль
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all pr-12 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-green-500"
                }`}
                placeholder="Введите пароль"
                autoComplete="current-password"
                disabled={isLoading}
              />
              {/* Кнопка показать/скрыть пароль */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.password}
              </p>
            )}
          </div>

          {/* Кнопка входа */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-900 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Вход...
              </>
            ) : (
              "Войти"
            )}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}
