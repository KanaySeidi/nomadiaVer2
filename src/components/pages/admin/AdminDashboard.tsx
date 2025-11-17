import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/api/authStore/authStore";
import { useAdminTourStore } from "@/api/tourStore/adminTourStore";
import { usePalaroidImg } from "@/api/imageStore/imageStore";
import { useAdminStaffStore, type TStaff } from "@/api/staffStore/staffStore";
import { useAdminVideoStore } from "@/api/videoStore/videoStore";
import { useAdminGalleryStore } from "@/api/galleryStore/galleryStore";

type Tab = "tours" | "gallery" | "staff" | "video" | "slider";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { tours, loading, error, fetchAllTours, deleteTour } = useAdminTourStore();
  const { images: polaroidImages, err: polaroidError, getPalaroidImg, updatePolaroidImage } = usePalaroidImg();
  const { staffs, loading: staffLoading, error: staffError, fetchAllStaff, createStaff, updateStaff, deleteStaff } = useAdminStaffStore();
  const { loading: videoLoading, error: videoError, addVideo } = useAdminVideoStore();
  const { images: sliderImages, loading: sliderLoading, error: sliderError, fetchGallery, addImage: addSliderImage, deleteImage: deleteSliderImage } = useAdminGalleryStore();
  const [activeTab, setActiveTab] = useState<Tab>("tours");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoLink, setVideoLink] = useState("");
  const [showSliderModal, setShowSliderModal] = useState(false);
  const [sliderImageFile, setSliderImageFile] = useState<File | null>(null);
  const [editingImageId, setEditingImageId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Состояния для модального окна Staff
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<TStaff | null>(null);
  const [staffFormData, setStaffFormData] = useState({
    name: "",
    position: "",
    description: "",
    nameEng: "",
    positionEng: "",
    descriptionEng: "",
    instagram: "",
    whatsapp: "",
    youtube: "",
    profileImage: null as File | null,
    backgroundImage: null as File | null,
  });

  // Загружаем туры при монтировании компонента
  useEffect(() => {
    if (activeTab === "tours") {
      fetchAllTours();
    } else if (activeTab === "gallery") {
      getPalaroidImg();
    } else if (activeTab === "staff") {
      fetchAllStaff();
    } else if (activeTab === "slider") {
      fetchGallery();
    }
  }, [activeTab, fetchAllTours, getPalaroidImg, fetchAllStaff]);

  const handleDeleteTour = async (tourId: number, tourTitle: string) => {
    if (!window.confirm(`Вы уверены, что хотите удалить тур "${tourTitle}"?`)) {
      return;
    }

    setDeletingId(tourId);
    try {
      await deleteTour(tourId);
      alert("Тур успешно удален!");
    } catch (err) {
      alert("Ошибка при удалении тура");
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateImage = async (id: number) => {
    if (!selectedFile) {
      alert("Выберите файл для загрузки");
      return;
    }

    setEditingImageId(id);
    try {
      await updatePolaroidImage(id, selectedFile);
      alert("Изображение успешно обновлено!");
      setSelectedFile(null);
      setEditingImageId(null);
    } catch (err) {
      alert("Ошибка при обновлении изображения");
    } finally {
      setEditingImageId(null);
    }
  };

  const openStaffModal = (staff?: TStaff) => {
    if (staff) {
      setEditingStaff(staff);
      setStaffFormData({
        name: staff.name,
        position: staff.position,
        description: staff.description,
        nameEng: staff.nameEng,
        positionEng: staff.positionEng,
        descriptionEng: staff.descriptionEng,
        instagram: staff.instagram || "",
        whatsapp: staff.whatsapp || "",
        youtube: staff.youtube || "",
        profileImage: null,
        backgroundImage: null,
      });
    } else {
      setEditingStaff(null);
      setStaffFormData({
        name: "",
        position: "",
        description: "",
        nameEng: "",
        positionEng: "",
        descriptionEng: "",
        instagram: "",
        whatsapp: "",
        youtube: "",
        profileImage: null,
        backgroundImage: null,
      });
    }
    setShowStaffModal(true);
  };

  const closeStaffModal = () => {
    setShowStaffModal(false);
    setEditingStaff(null);
    setStaffFormData({
      name: "",
      position: "",
      description: "",
      nameEng: "",
      positionEng: "",
      descriptionEng: "",
      instagram: "",
      whatsapp: "",
      youtube: "",
      profileImage: null,
      backgroundImage: null,
    });
  };

  const handleStaffSubmit = async () => {
    if (!staffFormData.name.trim()) {
      alert("Введите имя сотрудника");
      return;
    }
    if (!staffFormData.position.trim()) {
      alert("Введите должность");
      return;
    }

    const formData = new FormData();
    formData.append("name", staffFormData.name);
    formData.append("position", staffFormData.position);
    formData.append("description", staffFormData.description);
    formData.append("nameEng", staffFormData.nameEng);
    formData.append("positionEng", staffFormData.positionEng);
    formData.append("descriptionEng", staffFormData.descriptionEng);
    formData.append("instagram", staffFormData.instagram);
    formData.append("whatsapp", staffFormData.whatsapp);
    formData.append("youtube", staffFormData.youtube);

    if (staffFormData.profileImage) {
      formData.append("profile_image", staffFormData.profileImage);
    }
    if (staffFormData.backgroundImage) {
      formData.append("background_image", staffFormData.backgroundImage);
    }

    try {
      if (editingStaff) {
        await updateStaff(editingStaff.id, formData);
        alert("Сотрудник успешно обновлен!");
      } else {
        await createStaff(formData);
        alert("Сотрудник успешно добавлен!");
      }
      closeStaffModal();
    } catch (err) {
      alert("Ошибка при сохранении сотрудника");
    }
  };

  const handleDeleteStaff = async (staffId: number, staffName: string) => {
    if (!window.confirm(`Вы уверены, что хотите удалить сотрудника "${staffName}"?`)) {
      return;
    }

    setDeletingId(staffId);
    try {
      await deleteStaff(staffId);
      alert("Сотрудник успешно удален!");
    } catch (err) {
      alert("Ошибка при удалении сотрудника");
    } finally {
      setDeletingId(null);
    }
  };

  const handleVideoSubmit = async () => {
    if (!videoLink.trim()) {
      alert("Введите ссылку на YouTube видео");
      return;
    }

    try {
      await addVideo(videoLink);
      alert("Видео успешно добавлено!");
      setShowVideoModal(false);
      setVideoLink("");
    } catch (error) {
      console.error("Ошибка при добавлении видео:", error);
      alert("Ошибка при добавлении видео");
    }
  };

  const handleSliderImageSubmit = async () => {
    if (!sliderImageFile) {
      alert("Выберите изображение для загрузки");
      return;
    }

    try {
      await addSliderImage(sliderImageFile);
      alert("Изображение успешно добавлено!");
      setShowSliderModal(false);
      setSliderImageFile(null);
    } catch (error) {
      console.error("Ошибка при добавлении изображения:", error);
      alert("Ошибка при добавлении изображения");
    }
  };

  const handleDeleteSliderImage = async (imageId: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить это изображение?")) {
      return;
    }

    setDeletingId(imageId);
    try {
      await deleteSliderImage(imageId);
      alert("Изображение успешно удалено!");
    } catch (error) {
      console.error("Ошибка при удалении изображения:", error);
      alert("Ошибка при удалении изображения");
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const tabs = [
    { id: "tours" as Tab, label: "Туры", icon: "🗺️" },
    { id: "gallery" as Tab, label: "Галерея", icon: "🖼️" },
    { id: "staff" as Tab, label: "Стафф", icon: "👥" },
    { id: "video" as Tab, label: "Видео", icon: "🎥" },
    { id: "slider" as Tab, label: "Слайдер", icon: "📸" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex justify-between items-center py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Nomadia Admin
                </h1>
                <p className="text-xs text-gray-500">Панель управления</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 hidden sm:block">
                👤 <span className="font-semibold">{user?.username || "Admin"}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Выйти
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex gap-2 py-3 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Content based on active tab */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === "tours" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Управление турами</h2>
                <button 
                  onClick={() => navigate("/admin/tours/add")}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Добавить тур
                </button>
              </div>

              {/* Загрузка */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              )}

              {/* Ошибка */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  <p className="font-semibold">Ошибка при загрузке туров:</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Список туров */}
              {!loading && !error && tours.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>Туры не найдены</p>
                </div>
              )}

              {!loading && !error && tours.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Страна</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Цена</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tours.map((tour) => {
                        const tourTitle = (tour as any).translations?.[0]?.title || tour.translation?.title || "Без названия";
                        const isDeleting = deletingId === tour.id;
                        
                        return (
                          <tr key={tour.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 text-sm text-gray-900">
                              {tourTitle}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{tour.country || "-"}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${tour.price}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex gap-2">
                                <button className="text-blue-600 hover:text-blue-800 transition-colors" title="Просмотр">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={() => navigate(`/admin/tours/edit/${tour.id}`)}
                                  className="text-green-600 hover:text-green-800 transition-colors" 
                                  title="Редактировать"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={() => handleDeleteTour(tour.id, tourTitle)}
                                  disabled={isDeleting}
                                  className={`transition-colors ${
                                    isDeleting 
                                      ? "text-gray-400 cursor-not-allowed" 
                                      : "text-red-600 hover:text-red-800"
                                  }`}
                                  title="Удалить"
                                >
                                  {isDeleting ? (
                                    <div className="w-5 h-5 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
                                  ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "gallery" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Polaroid Галерея</h2>
              <p className="text-gray-600 mb-4">Здесь 3 основных изображения для главной страницы. Вы можете заменить любое из них.</p>

              {polaroidError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  <p className="font-semibold">Ошибка при загрузке изображений:</p>
                  <p className="text-sm">{polaroidError}</p>
                </div>
              )}

              {polaroidImages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>Изображения не найдены</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {polaroidImages.map((img) => (
                    <div key={img.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
                      <div className="aspect-square bg-gray-100">
                        <img 
                          src={img.image} 
                          alt={`Polaroid ${img.id}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-800">Изображение #{img.id}</h3>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Polaroid</span>
                        </div>
                        
                        <div className="space-y-3">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                setSelectedFile(e.target.files[0]);
                              }
                            }}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                          
                          {selectedFile && (
                            <p className="text-xs text-green-600">
                              Выбрано: {selectedFile.name}
                            </p>
                          )}

                          <button
                            onClick={() => handleUpdateImage(img.id)}
                            disabled={editingImageId === img.id || !selectedFile}
                            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                          >
                            {editingImageId === img.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Обновление...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Обновить изображение
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "staff" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Управление сотрудниками</h2>
                <button 
                  onClick={() => openStaffModal()}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Добавить сотрудника
                </button>
              </div>

              {staffError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  <p className="font-semibold">Ошибка:</p>
                  <p className="text-sm">{staffError}</p>
                </div>
              )}

              {staffLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              ) : staffs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p>Сотрудники не найдены</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {staffs.map((staff) => (
                    <div key={staff.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="h-32 bg-gradient-to-r from-green-400 to-blue-500 relative">
                        {staff.background_image && (
                          <img 
                            src={staff.background_image} 
                            alt="Background" 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="relative px-6 pb-6">
                        <div className="absolute -top-12 left-6">
                          <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                            {staff.profile_image ? (
                              <img 
                                src={staff.profile_image} 
                                alt={staff.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600 text-2xl font-bold">
                                {staff.name.charAt(0)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="pt-14">
                          <h3 className="text-xl font-bold text-gray-800">{staff.name}</h3>
                          <p className="text-sm text-green-600 font-medium mb-2">{staff.position}</p>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{staff.description}</p>
                          
                          <div className="flex gap-3 mb-4">
                            {staff.instagram && (
                              <a href={staff.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-600">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                              </a>
                            )}
                            {staff.whatsapp && (
                              <a href={staff.whatsapp} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-600">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                </svg>
                              </a>
                            )}
                            {staff.youtube && (
                              <a href={staff.youtube} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-600">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                              </a>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => openStaffModal(staff)}
                              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                            >
                              Редактировать
                            </button>
                            <button
                              onClick={() => handleDeleteStaff(staff.id, staff.name)}
                              disabled={deletingId === staff.id}
                              className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-sm rounded-lg transition-colors"
                            >
                              {deletingId === staff.id ? "Удаление..." : "Удалить"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Модальное окно для добавления/редактирования */}
              {showStaffModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-gray-800">
                        {editingStaff ? "Редактировать сотрудника" : "Добавить сотрудника"}
                      </h3>
                      <button onClick={closeStaffModal} className="text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Имя *</label>
                        <input
                          type="text"
                          value={staffFormData.name}
                          onChange={(e) => setStaffFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Должность *</label>
                        <input
                          type="text"
                          value={staffFormData.position}
                          onChange={(e) => setStaffFormData(prev => ({ ...prev, position: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                        <textarea
                          value={staffFormData.description}
                          onChange={(e) => setStaffFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      <div className="border-t pt-4 mt-4">
                        <h4 className="text-md font-semibold text-gray-700 mb-3">English Translation</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name (English) *</label>
                            <input
                              type="text"
                              value={staffFormData.nameEng}
                              onChange={(e) => setStaffFormData(prev => ({ ...prev, nameEng: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Position (English) *</label>
                            <input
                              type="text"
                              value={staffFormData.positionEng}
                              onChange={(e) => setStaffFormData(prev => ({ ...prev, positionEng: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                            <textarea
                              value={staffFormData.descriptionEng}
                              onChange={(e) => setStaffFormData(prev => ({ ...prev, descriptionEng: e.target.value }))}
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                        <input
                          type="text"
                          value={staffFormData.instagram}
                          onChange={(e) => setStaffFormData(prev => ({ ...prev, instagram: e.target.value }))}
                          placeholder="https://instagram.com/..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                        <input
                          type="text"
                          value={staffFormData.whatsapp}
                          onChange={(e) => setStaffFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                          placeholder="https://wa.me/..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
                        <input
                          type="text"
                          value={staffFormData.youtube}
                          onChange={(e) => setStaffFormData(prev => ({ ...prev, youtube: e.target.value }))}
                          placeholder="https://youtube.com/..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Фото профиля</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setStaffFormData(prev => ({ ...prev, profileImage: e.target.files?.[0] || null }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        {staffFormData.profileImage && (
                          <p className="text-sm text-green-600 mt-1">Выбрано: {staffFormData.profileImage.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Фоновое изображение</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setStaffFormData(prev => ({ ...prev, backgroundImage: e.target.files?.[0] || null }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        {staffFormData.backgroundImage && (
                          <p className="text-sm text-green-600 mt-1">Выбрано: {staffFormData.backgroundImage.name}</p>
                        )}
                      </div>
                    </div>

                    <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex gap-3">
                      <button
                        onClick={closeStaffModal}
                        className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      >
                        Отмена
                      </button>
                      <button
                        onClick={handleStaffSubmit}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        {editingStaff ? "Сохранить изменения" : "Добавить"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "video" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Управление видео</h2>
                <button 
                  onClick={() => setShowVideoModal(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Добавить видео
                </button>
              </div>

              {videoError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  <p className="font-semibold">Ошибка:</p>
                  <p className="text-sm">{videoError}</p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold mb-1">Управление YouTube видео</p>
                    <p className="text-sm">Добавьте ссылку на YouTube видео для отображения на главной странице.</p>
                    <p className="text-sm mt-1">Формат: https://www.youtube.com/watch?v=...</p>
                  </div>
                </div>
              </div>

              {/* Модальное окно для добавления видео */}
              {showVideoModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg max-w-md w-full">
                    <div className="bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-lg">
                      <h3 className="text-xl font-bold text-gray-800">Добавить YouTube видео</h3>
                      <button 
                        onClick={() => { setShowVideoModal(false); setVideoLink(""); }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="p-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ссылка на YouTube *</label>
                        <input
                          type="url"
                          value={videoLink}
                          onChange={(e) => setVideoLink(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Вставьте полную ссылку на YouTube видео
                      </p>
                    </div>

                    <div className="bg-gray-50 border-t px-6 py-4 flex gap-3 rounded-b-lg">
                      <button
                        onClick={() => { setShowVideoModal(false); setVideoLink(""); }}
                        className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      >
                        Отмена
                      </button>
                      <button
                        onClick={handleVideoSubmit}
                        disabled={videoLoading}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                      >
                        {videoLoading ? "Добавление..." : "Добавить"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "slider" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Управление слайдером</h2>
                <button 
                  onClick={() => setShowSliderModal(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Добавить изображение
                </button>
              </div>

              {sliderError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  <p className="font-semibold">Ошибка:</p>
                  <p className="text-sm">{sliderError}</p>
                </div>
              )}

              {sliderLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              ) : sliderImages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>Изображения не найдены</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sliderImages.map((image) => (
                    <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="aspect-video bg-gray-100">
                        <img 
                          src={image.image} 
                          alt={`Slider ${image.id}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <button
                          onClick={() => handleDeleteSliderImage(image.id)}
                          disabled={deletingId === image.id}
                          className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-sm rounded-lg transition-colors"
                        >
                          {deletingId === image.id ? "Удаление..." : "Удалить"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Модальное окно для добавления изображения */}
              {showSliderModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg max-w-md w-full">
                    <div className="bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-lg">
                      <h3 className="text-xl font-bold text-gray-800">Добавить изображение в слайдер</h3>
                      <button 
                        onClick={() => { setShowSliderModal(false); setSliderImageFile(null); }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="p-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Изображение *</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setSliderImageFile(e.target.files?.[0] || null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        {sliderImageFile && (
                          <p className="text-sm text-green-600 mt-2">Выбрано: {sliderImageFile.name}</p>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Рекомендуемый размер: 1920x1080px
                      </p>
                    </div>

                    <div className="bg-gray-50 border-t px-6 py-4 flex gap-3 rounded-b-lg">
                      <button
                        onClick={() => { setShowSliderModal(false); setSliderImageFile(null); }}
                        className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      >
                        Отмена
                      </button>
                      <button
                        onClick={handleSliderImageSubmit}
                        disabled={sliderLoading}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                      >
                        {sliderLoading ? "Загрузка..." : "Добавить"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
