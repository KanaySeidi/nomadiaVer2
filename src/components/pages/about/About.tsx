import { useEffect } from "react";
import about from "@/assets/img/about.jpg";
import { useTranslation } from "react-i18next";
import wa from "@/assets/icon/whatsapp-3.svg";
import yt from "@/assets/icon/youtube-icon-5.svg";
import ig from "@/assets/icon/instagram-2016-5.svg";
import useStaffProfile from "@/api/staffStore/staffStore";
import { usePalaroidImg } from "@/api/imageStore/imageStore";

function About() {
  const { t } = useTranslation();

  const { staffs, fetchStaffs, err } = useStaffProfile();
  const { images, getPalaroidImg } = usePalaroidImg();
  const { i18n } = useTranslation();

  useEffect(() => {
    fetchStaffs();
    getPalaroidImg();
  }, [i18n.language]);

  if (err) {
    return <p>Ошибка: {err}</p>;
  }

  return (
    <>
      <div className="w-full h-full relative">
        <div className="px-4 sm:px-8 md:px-16 lg:px-24">
          <img
            src={about}
            alt="about us page"
            className="lg:w-full w-full lg:h-72 h-64 object-cover saturate-50 absolute top-0 left-0"
          />
          <div className="relative flex flex-col items-center justify-center h-64 lg:mt-14 mt-4">
            <q className="lg:text-4xl text-base text-white text-justify lg:leading-loose block lg:px-24 mt-20">
              {t("AP.bannerWord")}
            </q>
            <p className="lg:text-3xl text-base text-white font-black mt-4 block self-end">
              {t("AP.author")}
            </p>
          </div>
          <div className="relative mt-20">
            <h1 className="text-2xl sm:text-3xl my-2">{t("AP.mission")}</h1>
            <p className="text-base sm:text-lg md:text-xl leading-8 mt-5 text-justify">
              {t("AP.missionText")}
            </p>
          </div>
          <div className="w-full flex justify-center relative my-10">
            <div className="w-full h-full flex justify-center relative my-20">
              <div className="card lg:w-3/6 w-full h-64 rounded-md lg:bg-white bg-bel lg:shadow-[15px_15px_30px_#bebebe,-15px_-15px_30px_#ffffff] flex justify-around gap-5">
                <div className="w-32 flex flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="60"
                    height="60"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="green"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-timer-reset"
                  >
                    <path d="M10 2h4" />
                    <path d="M12 14v-4" />
                    <path d="M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6" />
                    <path d="M9 17H4v5" />
                  </svg>
                  <p className="w-full text-center mt-10">{t("AP.icon1")}</p>
                </div>
                <div className="w-32 flex flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="60"
                    height="60"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="green"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-handshake"
                  >
                    <path d="m11 17 2 2a1 1 0 1 0 3-3" />
                    <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
                    <path d="m21 3 1 11h-2" />
                    <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
                    <path d="M3 4h8" />
                  </svg>
                  <p className="w-full text-center mt-10">{t("AP.icon2")}</p>
                </div>
                <div className="w-32  flex flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="60"
                    height="60"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="green"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-biceps-flexed"
                  >
                    <path d="M12.409 13.017A5 5 0 0 1 22 15c0 3.866-4 7-9 7-4.077 0-8.153-.82-10.371-2.462-.426-.316-.631-.832-.62-1.362C2.118 12.723 2.627 2 10 2a3 3 0 0 1 3 3 2 2 0 0 1-2 2c-1.105 0-1.64-.444-2-1" />
                    <path d="M15 14a5 5 0 0 0-7.584 2" />
                    <path d="M9.964 6.825C8.019 7.977 9.5 13 8 15" />
                  </svg>
                  <p className="w-full text-center mt-10">{t("AP.icon3")}</p>
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl my-5">{t("AP.whyChoose")}</h1>
          <div className="my-10">
            <p className="text-base sm:text-lg md:text-xl leading-8 text-justify">
              {t("AP.whyChooseText")}
            </p>
          </div>
          <div className="relative mt-20 lg:my-10 w-full flex lg:flex-row flex-col items-center lg:justify-between">
            <div className="lg:w-96 w-64 lg:h-80 h-72 bg-white flex shadow-md -rotate-6 lg:mb-0 mb-20">
              <div>
                <img
                  src={images[0]?.image}
                  alt=""
                  className="p-5 rounded-sm lg:w-96 w-72 h-56 object-cover"
                />
              </div>
            </div>
            <div className="lg:w-96 w-64 lg:h-80 h-72 bg-white flex flex-col shadow-md -rotate-2 -mt-10">
              <div>
                <img
                  src={images[1]?.image}
                  alt=""
                  className=" p-5 rounded-sm lg:w-96 w-72 h-56 object-cover"
                />
              </div>
            </div>
            <div className="lg:w-96 w-64 lg:h-80 h-72 bg-white flex flex-col shadow-md rotate-2 mt-5">
              <div>
                <img
                  src={images[2]?.image}
                  alt=""
                  className=" p-5 rounded-sm w-96 h-56 object-cover"
                />
              </div>
            </div>
          </div>
          <div className="my-10">
            <h1 className="text-2xl sm:text-3xl mb-5">{t("AP.ourStory")}</h1>
            <p className="text-base sm:text-lg md:text-xl leading-8 text-justify">
              {t("AP.ourStoryText")}
            </p>
            <div className="lg:px-24 px-4 flex justify-evenly mt-10 flex-wrap">
              {staffs.map((staff) => (
                <div
                  className="lg:w-80 w-full h-auto pb-10 bg-white shadow-md relative rounded-md mb-4"
                  key={staff.id}
                >
                  <img
                    src={staff.background_image}
                    alt=""
                    className="w-full h-32 sm:h-40 object-cover absolute rounded-t-md"
                  />
                  <div className="relative flex justify-center">
                    <div className="w-40 h-40 bg-white rounded-full hover:scale-100 duration-700 relative mt-32">
                      <img
                        src={staff.profile_image}
                        alt=""
                        className="w-36 h-36 rounded-full object-cover p-2 ml-2 hover:scale-150 duration-700 hover:object-cover"
                      />
                    </div>
                  </div>
                  <div className="px-10 mt-5">
                    <p className="text-2xl font-black">{staff.name}</p>
                    <p className="text-xs mb-2">{staff.position}</p>
                    <div className="border-b-2 border-cher mb-2"></div>
                    <p className="text-justify">{staff.description}</p>
                    <div className="w-full h-10 flex justify-between items-center mt-5">
                      <img
                        src={wa}
                        alt=""
                        className="cursor-pointer w-10 h-full"
                        onClick={() => window.open(`${staff.whatsapp}`)}
                      />
                      <img
                        src={ig}
                        alt=""
                        className="cursor-pointer w-10 h-full"
                        onClick={() => window.open(`${staff.instagram}`)}
                      />
                      <img
                        src={yt}
                        alt=""
                        className="cursor-pointer w-10 h-full"
                        onClick={() => window.open(`${staff.youtube}`)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
