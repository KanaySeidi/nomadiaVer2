import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_APP_URL;

type DayInfo = {
  title: string;
  text: string;
  images: File[];
};

type Translation = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  duration: string;
  dayInfo: DayInfo[];
  languageCode: string;
};

type TourFormData = {
  translations: Translation[];
  price: number;
  previewImageFile: File | null;
  mainImageFile: File | null;
  extraPrices: number[];
  country: string;
  level: string;
};

export default function AddTour() {
  const navigate = useNavigate();
  
  const [languageCodes, setLanguageCodes] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [countryCodes, setCountryCodes] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<TourFormData>({
    translations: [],
    price: 0,
    previewImageFile: null,
    mainImageFile: null,
    extraPrices: [],
    country: "",
    level: "",
  });

  const [currentTranslation, setCurrentTranslation] = useState<Translation>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    duration: "",
    dayInfo: [],
    languageCode: "",
  });

  useEffect(() => {
    fetchReferenceData();
  }, []);

  const fetchReferenceData = async () => {
    setLoading(true);
    try {
      const [langRes, levelsRes, countriesRes] = await Promise.all([
        axios.get<string[]>(`${API}/api/languageCodes`),
        axios.get<string[]>(`${API}/api/levels`),
        axios.get<string[]>(`${API}/api/countryCodes`),
      ]);

      setLanguageCodes(langRes.data);
      setLevels(levelsRes.data);
      setCountryCodes(countriesRes.data);

      if (countriesRes.data.length > 0) {
        setFormData(prev => ({ ...prev, country: countriesRes.data[0] }));
      }
      if (levelsRes.data.length > 0) {
        setFormData(prev => ({ ...prev, level: levelsRes.data[0] }));
      }
      if (langRes.data.length > 0) {
        setCurrentTranslation(prev => ({ ...prev, languageCode: langRes.data[0] }));
      }
    } catch (err) {
      console.error("Ошибка загрузки справочных данных:", err);
      setError("Не удалось загрузить справочные данные");
    } finally {
      setLoading(false);
    }
  };

  const addDayToTranslation = () => {
    setCurrentTranslation(prev => ({
      ...prev,
      dayInfo: [
        ...prev.dayInfo,
        { title: "", text: "", images: [] }
      ]
    }));
  };

  const updateDay = (index: number, field: keyof DayInfo, value: string | File[]) => {
    setCurrentTranslation(prev => ({
      ...prev,
      dayInfo: prev.dayInfo.map((day, i) =>
        i === index ? { ...day, [field]: value } : day
      )
    }));
  };

  const removeDay = (index: number) => {
    setCurrentTranslation(prev => ({
      ...prev,
      dayInfo: prev.dayInfo.filter((_, i) => i !== index)
    }));
  };

  const addImageToDay = (dayIndex: number, file: File) => {
    setCurrentTranslation(prev => ({
      ...prev,
      dayInfo: prev.dayInfo.map((day, i) =>
        i === dayIndex ? { ...day, images: [...day.images, file] } : day
      )
    }));
  };

  const removeImageFromDay = (dayIndex: number, imageIndex: number) => {
    setCurrentTranslation(prev => ({
      ...prev,
      dayInfo: prev.dayInfo.map((day, i) =>
        i === dayIndex ? { ...day, images: day.images.filter((_, imgI) => imgI !== imageIndex) } : day
      )
    }));
  };

  const addTranslation = () => {
    if (!currentTranslation.title.trim()) {
      alert("Введите название тура");
      return;
    }
    if (!currentTranslation.languageCode) {
      alert("Выберите язык");
      return;
    }

    const exists = formData.translations.some(t => t.languageCode === currentTranslation.languageCode);
    if (exists) {
      alert("Перевод для этого языка уже добавлен");
      return;
    }

    setFormData(prev => ({
      ...prev,
      translations: [...prev.translations, currentTranslation]
    }));

    const nextLang = languageCodes.find(code => 
      !formData.translations.some(t => t.languageCode === code) && 
      code !== currentTranslation.languageCode
    );

    setCurrentTranslation({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      duration: "",
      dayInfo: [],
      languageCode: nextLang || "",
    });
  };

  const removeTranslation = (languageCode: string) => {
    setFormData(prev => ({
      ...prev,
      translations: prev.translations.filter(t => t.languageCode !== languageCode)
    }));
  };

  const handleSubmit = async () => {
    if (formData.translations.length === 0) {
      alert("Добавьте хотя бы один перевод");
      return;
    }
    if (!formData.price || formData.price <= 0) {
      alert("Укажите корректную цену");
      return;
    }
    if (!formData.country) {
      alert("Выберите страну");
      return;
    }
    if (!formData.level) {
      alert("Выберите уровень сложности");
      return;
    }

    setSubmitLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();

      // Добавляем основные поля
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("country", formData.country);
      formDataToSend.append("level", formData.level);

      // Добавляем основные изображения
      if (formData.previewImageFile) {
        formDataToSend.append("previewImage", formData.previewImageFile);
      }
      if (formData.mainImageFile) {
        formDataToSend.append("mainImage", formData.mainImageFile);
      }

      // Добавляем переводы с точечной нотацией
      formData.translations.forEach((translation, transIndex) => {
        formDataToSend.append(`translations[${transIndex}].languageCode`, translation.languageCode);
        formDataToSend.append(`translations[${transIndex}].title`, translation.title);
        formDataToSend.append(`translations[${transIndex}].description`, translation.description);
        formDataToSend.append(`translations[${transIndex}].startDate`, translation.startDate);
        formDataToSend.append(`translations[${transIndex}].endDate`, translation.endDate);
        formDataToSend.append(`translations[${transIndex}].duration`, translation.duration);

        translation.dayInfo.forEach((day, dayIndex) => {
          formDataToSend.append(`translations[${transIndex}].dayInfo[${dayIndex}].title`, day.title);
          formDataToSend.append(`translations[${transIndex}].dayInfo[${dayIndex}].text`, day.text);

          // Добавляем файлы изображений
          day.images.forEach((image, imageIndex) => {
            formDataToSend.append(
              `translations[${transIndex}].dayInfo[${dayIndex}].images[${imageIndex}]`, 
              image
            );
          });
        });
      });

      await axios.post(`${API}/api/edit/tours`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Тур успешно добавлен!");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Ошибка при добавлении тура:", err);
      setError(axios.isAxiosError(err) ? err.response?.data?.message || err.message : "Ошибка при добавлении");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Добавить новый тур</h1>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Основная информация */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Основная информация</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Цена (USD) *
                </label>
                <input
                  type="number"
                  value={formData.price || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Страна *
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {countryCodes.map(code => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Уровень сложности *
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Превью изображение
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    previewImageFile: e.target.files?.[0] || null 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {formData.previewImageFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    Выбрано: {formData.previewImageFile.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Основное изображение
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    mainImageFile: e.target.files?.[0] || null 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {formData.mainImageFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    Выбрано: {formData.mainImageFile.name}
                  </p>
                )}
              </div>
            </div>

            {formData.translations.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Добавленные переводы:</h3>
                <div className="space-y-2">
                  {formData.translations.map(t => (
                    <div key={t.languageCode} className="flex items-center justify-between bg-green-50 px-3 py-2 rounded">
                      <div>
                        <span className="font-medium text-green-800">{t.languageCode}</span>
                        <span className="text-sm text-gray-600 ml-2">- {t.title}</span>
                      </div>
                      <button
                        onClick={() => removeTranslation(t.languageCode)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitLoading || formData.translations.length === 0}
              className="w-full mt-6 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-semibold"
            >
              {submitLoading ? "Сохранение..." : "Сохранить тур"}
            </button>
          </div>

          {/* Форма перевода */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Добавить перевод</h2>
              <select
                value={currentTranslation.languageCode}
                onChange={(e) => setCurrentTranslation(prev => ({ ...prev, languageCode: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {languageCodes.filter(code => 
                  !formData.translations.some(t => t.languageCode === code)
                ).map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
                <input
                  type="text"
                  value={currentTranslation.title}
                  onChange={(e) => setCurrentTranslation(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea
                  value={currentTranslation.description}
                  onChange={(e) => setCurrentTranslation(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Начало</label>
                  <input
                    type="text"
                    value={currentTranslation.startDate}
                    onChange={(e) => setCurrentTranslation(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Май"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Конец</label>
                  <input
                    type="text"
                    value={currentTranslation.endDate}
                    onChange={(e) => setCurrentTranslation(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Октябрь"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Длительность</label>
                  <input
                    type="text"
                    value={currentTranslation.duration}
                    onChange={(e) => setCurrentTranslation(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="7 дней"
                  />
                </div>
              </div>

              {/* Дни тура */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Программа по дням</h3>
                  <button
                    onClick={addDayToTranslation}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                  >
                    + Добавить день
                  </button>
                </div>

                <div className="space-y-4">
                  {currentTranslation.dayInfo.map((day, dayIndex) => (
                    <div key={dayIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-700">День {dayIndex + 1}</h4>
                        <button
                          onClick={() => removeDay(dayIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-3">
                        <input
                          type="text"
                          value={day.title}
                          onChange={(e) => updateDay(dayIndex, "title", e.target.value)}
                          placeholder="Название дня"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />

                        <textarea
                          value={day.text}
                          onChange={(e) => updateDay(dayIndex, "text", e.target.value)}
                          placeholder="Описание дня"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />

                        {/* Изображения для дня */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-2">Изображения</label>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              if (e.target.files) {
                                Array.from(e.target.files).forEach(file => {
                                  addImageToDay(dayIndex, file);
                                });
                              }
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />

                          {day.images.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {day.images.map((img, imgIndex) => (
                                <div key={imgIndex} className="flex items-center justify-between bg-white px-3 py-2 rounded border">
                                  <span className="text-sm text-gray-600 truncate">{img.name}</span>
                                  <button
                                    onClick={() => removeImageFromDay(dayIndex, imgIndex)}
                                    className="text-red-600 hover:text-red-800 ml-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={addTranslation}
                className="w-full mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Добавить этот перевод
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
