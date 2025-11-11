import { useEffect } from "react";
import SimpleSlider from "@/components/organisms/slider/SlmpleSlider";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useKyrgyzstanTours } from "@/api/tourStore/tourStore";
import mainBanner from "@/assets/img/Alaymountains.jpg";
import ErrorNotif from "@/components/molecules/errornot/ErrorNotif";

function KG() {
  const { t, i18n } = useTranslation();
  const params = useParams();

  const countryCode = "KG";

  const slidesData = [
    { title: "kyrgyz.sliderTitle1", description: "kyrgyz.sliderDesc1" },
    { title: "kyrgyz.sliderTitle2", description: "kyrgyz.sliderDesc2" },
    { title: "kyrgyz.sliderTitle3", description: "kyrgyz.sliderDesc3" },
    { title: "kyrgyz.sliderTitle4", description: "kyrgyz.sliderDesc4" },
    { title: "kyrgyz.sliderTitle5", description: "kyrgyz.sliderDesc5" },
  ];

  const { tours, fetchTours, error } = useKyrgyzstanTours();

  useEffect(() => {
    fetchTours(countryCode);
  }, [fetchTours, i18n.language, params]);

  if (error) {
    return <ErrorNotif error={t("networkErr")} />;
  }

  return (
    <div className="w-full h-full">
      <img
        src={mainBanner}
        alt="Kyrgyzstan Banner"
        className="absolute top-0 left-0 xl:w-full lg:w-full md:w-full sm:w-full object-cover xl:h-full lg:h-auto md:h-[80vh] sm:h-[75vh]  h-[80vh]"
      />
      <div className="lg:px-24 px-4 relative">
        <h1 className="xl:text-5xl lg:text-3xl text-xl font-black lg:mt-40 mt-20 backdrop-blur-lg text-emerald-900 w-fit p-2 pl-0 rounded-lg">
          {t("Kyrgyzstan")}
        </h1>
        <p className="xl:text-2xl lg:text-lg text-lg font-black w-fit backdrop-blur-lg rounded-lg mt-3 lg:p-2 p-1 pl-0  text-emerald-900">
          {t("kyrgyz.slogan")}
        </p>
        <div className="flex gap-4 mt-8">
          <div className="xl:w-1/2 lg:w-3/4 sm:w-96 w-80 h-auto backdrop-blur-md p-2 pl-0 lg:text-base text-xs rounded-md text-white text-justify">
            <SimpleSlider slidesData={slidesData} />
          </div>
        </div>
      </div>
      <div className="w-full h-full  bg-fistash relative lg:px-24 px-4 pb-20 pt-10 mt-20">
        <h1 className="text-white lg:text-2xl text-lg">{t("Tours")}</h1>
        <div className="flex flex-wrap gap-10 lg:justify-evenly justify-center items-center mt-4">
          {tours?.map((tour) => (
            <Link to={`/tour/${tour.id}`} key={tour.id}>
              <div className="w-80 h-44 transform transition-transform duration-500 relative overflow-hidden hover:scale-125 group cursor-pointer rounded-md">
                <img
                  src={tour.previewImage}
                  alt="banner"
                  className="h-full w-full object-cover rounded-md"
                />
                <div className="absolute inset-0 flex flex-col justify-between p-4 bg-black/50 text-white">
                  <p className="font-bold text-xl">{tour.translation?.title}</p>
                  <div className="transition-opacity duration-500 opacity-0 group-hover:opacity-100">
                    <p>
                      {t("detailTour.duration")}
                      <span className="font-black text-lg text-yellow-500">
                        {tour.translation?.duration}
                      </span>
                    </p>
                    <p>
                      {t("detailTour.price")}
                      <span className="font-black text-lg text-yellow-500">
                        {t("detailTour.startsFrom")} {tour.price} $
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default KG;
