import { useEffect } from "react";
import SimpleSlider from "@/components/organisms/slider/SlmpleSlider";
import { useTranslation } from "react-i18next";
import CANav from "@/components/molecules/CANav/CANav";
import { Link, useParams } from "react-router-dom";
import { useKyrgyzstanTours } from "@/api/tourStore/tourStore";
import mainBanner from "@/assets/img/Tajikistan main page.png";
import ErrorNotif from "@/components/molecules/errornot/ErrorNotif";

function TJK() {
  const { t, i18n } = useTranslation();
  const params = useParams();

  const countryCode = "TJK";

  const { tours, fetchTours, error } = useKyrgyzstanTours();

  useEffect(() => {
    fetchTours(countryCode);
  }, [fetchTours, i18n.language, params]);

  if (error) {
    return <ErrorNotif error={t("networkErr")} />;
  }

  const slidesData = [
    { title: "tajik.sliderTitle1", description: "tajik.sliderDesc1" },
    { title: "tajik.sliderTitle2", description: "tajik.sliderDesc2" },
    { title: "tajik.sliderTitle3", description: "tajik.sliderDesc3" },
  ];

  return (
    <div className="w-full h-full">
      <img
        src={mainBanner}
        alt="Tajikistan Banner"
        className="absolute top-0 left-0 xl:w-full lg:w-full md:w-full sm:w-full xs:w-full object-cover xl:h-full lg:h-auto md:h-[70vh] sm:h-[80vh] h-[90vh]"
      />
      <div className="fixed top-1/2 right-0 transform -translate-y-1/2 z-50 mr-2">
        <CANav />
      </div>
      <div className="lg:px-24 px-4 relative text-emerald-900">
        <h1 className="xl:text-5xl lg:text-3xl text-xl font-black lg:mt-40 mt-20 backdrop-blur-lg text-emerald-900 w-fit p-2 pl-0 rounded-lg">
          {t("Country.Tajikistan")}
        </h1>
        <p className="xl:text-2xl lg:text-lg text-lg font-black w-fit backdrop-blur-lg rounded-lg mt-3 lg:p-2 p-1 pl-0  text-emerald-900">
          {t("tajik.slogan")}
        </p>
        <div className="flex gap-4 mt-8">
          <div className="xl:w-1/2 lg:w-3/4 md:w-3/4 sm:w-96 w-80 h-auto backdrop-blur-md p-2 pl-0 lg:text-base text-xs rounded-md text-white text-justify">
            <SimpleSlider slidesData={slidesData} />
          </div>
        </div>
      </div>
      <div className="w-full xl:mt-64 lg:mt-40 md:mt-52 sm:mt-64 xs:mt-80  h-auto flex flex-col lg:flex-row justify-center xl:justify-between lg:justify-around items-center relative xl:px-24 px-4 lg:py-20">
        <div className="flex flex-col justify-center items-center w-80 bg-fistash p-4 lg:h-96 h-40 rounded-lg shadow-lg mb-2">
          <p className="mt-2 text-white lg:text-base text-xs text-justify">
            {t("tajik.cardDesc1")}
          </p>
        </div>
        <div className="flex flex-col justify-center items-center w-80  bg-fistash p-4 lg:h-96 h-40 rounded-lg shadow-lg mb-2">
          <p className="mt-2 text-white lg:text-base text-justify text-xs">
            {t("tajik.cardDesc2")}
          </p>
        </div>
        <div className="flex flex-col justify-center items-center w-80 bg-fistash p-4 lg:h-96 h-40 rounded-lg shadow-lg mb-2">
          <p className="mt-2 text-white lg:text-base text-justify text-xs">
            {t("tajik.cardDesc3")}
          </p>
        </div>
      </div>
      <div className="w-full h-full  bg-fistash relative lg:px-24 px-4 pb-20 pt-10 mt-20">
        <h1 className="text-white lg:text-2xl text-lg">{t("Tours")}</h1>
        <div className="w-full h-full flex flex-wrap gap-10 lg:justify-evenly justify-center items-center bg-fistash relative px-24 py-20">
          {tours?.map((tour) => (
            <Link to={`/tour/${tour.id}`} key={tour.id}>
              <div className="w-80 h-44 transform transition-transform duration-500 relative overflow-hidden hover:scale-125 group cursor-pointer rounded-md">
                <img
                  src={tour.previewImage}
                  alt="banner"
                  className="h-full w-full object-cover rounded-md"
                />
                <div className="absolute inset-0 flex flex-col justify-between p-4 bg-black bg-opacity-50 text-white">
                  <p className="font-bold text-xl">
                    {tour?.translation?.title}
                  </p>
                  <div className="transition-opacity duration-500 opacity-0 group-hover:opacity-100">
                    <p>
                      Duration: {""}
                      <span className="font-black text-lg text-yellow-500">
                        {tour?.translation?.duration}
                      </span>
                    </p>
                    <p>
                      Price: from {""}
                      <span className="font-black text-lg text-yellow-500">
                        {tour.price} $
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

export default TJK;
