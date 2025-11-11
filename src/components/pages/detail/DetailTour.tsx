// DetailTour.tsx
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "@/components/molecules/modal/Modal";
import { useTourById } from "@/api/tourStore/tourStore";
import { useTranslation } from "react-i18next";
import reqStore from "@/api/userStore/requestStore";
import type { Tour } from "@/types";
import DaysStepper from "@/components/molecules/dayStepper/DayStepper";
import ErrorNotif from "@/components/molecules/errornot/ErrorNotif";
import Loader from "@/components/organisms/loader/Loader";

type TourTranslation = {
  title: string;
  duration: string;
  startDate: string;
  endDate: string;
};

type RequestPayload = {
  fullName: string;
  country: string;
  phone: string;
  email: string;
};

export default function DetailTour() {
  const { id } = useParams<{ id: string }>();
  const tourSectionRef = useRef<HTMLDivElement | null>(null);
  const { t, i18n } = useTranslation();
  const { tour, getTourById, error } = useTourById() as {
    tour: Tour | null;
    getTourById: (id: string | undefined) => void | Promise<void>;
    error?: string;
  };

  const { tourReq } = reqStore() as {
    tourReq: (
      tourId: Tour["id"],
      payload: RequestPayload
    ) => void | Promise<void>;
  };

  const [request, setRequest] = useState<RequestPayload>({
    fullName: "",
    country: "",
    phone: "",
    email: "",
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (id) getTourById(id);
  }, [id, getTourById, i18n.language]);

  if (error) {
    return <ErrorNotif error={t("networkErr")} />;
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      if (tour) {
        await Promise.resolve(tourReq(tour.id, request));
        setRequest({ fullName: "", country: "", phone: "", email: "" });
        handleCloseModal();
      }
    } catch (err) {
      console.error("Ошибка при отправке заявки:", err);
    }
  };

  return (
    <>
      <div className="w-full h-full mb-10">
        {tour ? (
          <>
            <img
              src={tour.mainImage}
              alt="tour_image"
              className="absolute top-0 left-0 xl:w-full lg:w-full brightness-50 md:w-full sm:w-full object-cover xl:h-full lg:h-auto md:h-[80vh] sm:h-[75vh] h-[80vh]"
            />
            <div className="lg:px-24 px-4 relative w-full flex flex-col justify-center items-center">
              <h1 className="lg:text-5xl text-lg font-black lg:mt-28 mt-10 w-fit p-2 text-white rounded-lg text-center backdrop-blur-sm">
                {tour.translation?.title}
              </h1>

              <div className="flex w-96 h-40 justify-between text-white p-2">
                <div className="flex flex-col justify-between">
                  <div className="flex flex-col">
                    <p className="text-fistash">{t("detailTour.duration")}</p>
                    <p>{tour.translation?.duration}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-fistash">{t("detailTour.price")}</p>
                    <p>
                      {t("detailTour.startsFrom")} {tour.price} $
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-fistash text-start">
                      {t("detailTour.season")}
                    </p>
                    <div className="text-start">
                      <p>{tour.translation?.startDate}</p>
                      <p>{tour.translation?.endDate}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-fistash font-black">
                      {t("detailTour.level")}
                    </p>
                    <p className="text-start">{tour.level}</p>
                  </div>
                </div>
              </div>

              <div className="lg:mt-40 mt-20">
                <button
                  className="w-auto p-2 border border-white rounded-md text-white"
                  onClick={handleOpenModal}
                >
                  {t("banner.applyNow")}
                </button>
              </div>

              <div className="min-h-screen mt-32" ref={tourSectionRef}>
                <div className="flex-1">
                  <DaysStepper tour={tour} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <Loader />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={t("banner.applyNow")}
      >
        <form onSubmit={handleSubmit}>
          <div className="w-full h-auto flex flex-col justify-evenly gap-4 p-4">
            <input
              type="text"
              className="border-fistash border-2 rounded-md pl-1 focus:outline-none h-10"
              placeholder="full name"
              value={request.fullName}
              onChange={(e) =>
                setRequest({ ...request, fullName: e.target.value })
              }
            />
            <input
              type="text"
              className="border-fistash border-2 rounded-md pl-1 focus:outline-none h-10"
              placeholder="where are you from"
              value={request.country}
              onChange={(e) =>
                setRequest({ ...request, country: e.target.value })
              }
            />
            <input
              type="tel"
              className="border-fistash border-2 rounded-md pl-1 focus:outline-none h-10"
              placeholder="phone"
              value={request.phone}
              onChange={(e) =>
                setRequest({ ...request, phone: e.target.value })
              }
            />
            <input
              type="email"
              value={request.email}
              onChange={(e) =>
                setRequest({ ...request, email: e.target.value })
              }
              className="border-fistash border-2 rounded-md pl-1 focus:outline-none h-10"
              placeholder="email"
            />
            <button
              type="submit"
              className="w-full bg-fistash text-white rounded-md"
            >
              Send
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
