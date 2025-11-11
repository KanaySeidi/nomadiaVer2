import type { Tour } from "@/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type Props = {
  tour?: Tour | null;
};

const TourDays = ({ tour }: Props) => {
  const { t } = useTranslation();
  const [currentDay, setCurrentDay] = useState(0);

  if (!tour || !tour.translation || !Array.isArray(tour.translation.dayInfo)) {
    return (
      <div className="flex flex-col items-center h-40 justify-around mt-20">
        <p className="text-3xl text-center">{t("noTour")}</p>
        <Link to="/">
          <button className="w-auto h-auto p-2 bg-fistash text-white rounded-md">
            {t("Home")}
          </button>
        </Link>
      </div>
    );
  }

  const days = tour.translation.dayInfo;

  const handleDayClick = (index: number) => {
    setCurrentDay(index);
  };

  return (
    <div className="flex flex-col items-center justify-center lg:p-10 bg-gray-100 lg:min-h-screen mt-40 mb-16">
      <div className="flex flex-col md:flex-row lg:gap-6 w-full">
        <div className="flex flex-col justify-between items-center lg:w-96 lg:ml-10 w-96">
          <div>
            <p className="xl:text-xl lg:text-xl md:text-lg sm:text-base text-sm bg-fistash text-bel text-center flex justify-center mb-3 lg:w-96 w-80">
              {days[currentDay].title || t("noTitle")}
            </p>
            <p className="text-gray-700 mb-4 lg:w-96 w-80  xl:text-lg lg:text-lg md:text-base sm:text-sm text-xs text-justify">
              {days[currentDay].text || t("noDescription")}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 flex-1">
          <div className="flex flex-col space-y-4">
            <div className="flex lg:space-x-4 space-x-1 px-4">
              <div className="flex flex-col space-y-4">
                {days[currentDay].images && days[currentDay].images[0] && (
                  <img
                    src={days[currentDay].images[0]}
                    alt="Tour 1"
                    className="w-56 h-28 object-cover rounded-md lg:hover:scale-125 hover:scale-110 transition"
                  />
                )}
                {days[currentDay].images && days[currentDay].images[1] && (
                  <img
                    src={days[currentDay].images[1]}
                    alt="Tour 2"
                    className="w-56 h-28 object-cover rounded-md hover:scale-125 transition"
                  />
                )}
              </div>
              <div>
                {days[currentDay].images && days[currentDay].images[2] && (
                  <img
                    src={days[currentDay].images[2]}
                    alt="Tour 3"
                    className="w-36 h-60 object-cover rounded-md hover:scale-125 transition"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center mt-4 flex-wrap gap-1">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDayClick(index)}
            className={`px-4 py-2 font-semibold rounded-md ${
              currentDay === index
                ? "bg-fistash text-bel"
                : "bg-gray-300 hover:bg-gray-400 hover:text-bel"
            } transition `}
          >
            {`${t("detailTour.day")} ${index + 1}`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TourDays;
