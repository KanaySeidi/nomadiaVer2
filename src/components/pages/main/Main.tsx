import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "@/components/molecules/modal/Modal";
import mainBanner from "@/assets/img/nomad.png";
import reqStore from "@/api/userStore/requestStore";
import useUrlForVideo from "@/api/videoStore/videoStore";
import LightRays from "@/components/LightRays";
import ImgSlider from "@/components/organisms/imgSlider/ImgSlider";

type RequestPayload = {
  fullName: string;
  country: string;
  phone: string;
  email: string;
  question: string;
};

function toYouTubeEmbed(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1);
      return `https://www.youtube.com/embed/${id}`;
    }

    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;

      if (u.pathname.startsWith("/embed/")) return u.toString();
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export default function Main() {
  const tourSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToTour = () => {
    tourSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [request, setRequest] = useState<RequestPayload>({
    fullName: "",
    country: "",
    phone: "",
    email: "",
    question: "",
  });

  const leaveReq = reqStore(
    (state: any) => state.leaveReq as (p: RequestPayload) => unknown
  );

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await Promise.resolve(leaveReq(request)); // на случай, если leaveReq async
      setRequest({
        fullName: "",
        country: "",
        phone: "",
        email: "",
        question: "",
      });
      handleCloseModal();
    } catch (error) {
      console.error("Ошибка при отправке заявки:", error);
    }
  };

  const { url, getURLForVideo } = useUrlForVideo() as {
    url?: string;
    getURLForVideo: () => void | Promise<void>;
  };

  useEffect(() => {
    getURLForVideo();
  }, [getURLForVideo]);

  const embedUrl = toYouTubeEmbed(url);

  return (
    <>
      <div className="absolute inset-0 -z-10">
        <img
          src={mainBanner}
          alt="banner"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <LightRays
          raysOrigin="top-center"
          raysColor="#f4e757"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
      </div>
      <div className="relative z-20 h-screen flex flex-col justify-end lg:justify-center items-start w-11/12 mx-auto text-white">
        <div className="-mt-24 -ml-3 drop-shadow-lg">
          <p className="text-5xl uppercase">{t("banner.slogan1")}</p>
          <p className="text-5xl uppercase">{t("banner.slogan2")}</p>
          <p className="text-5xl uppercase">{t("banner.slogan3")}</p>
        </div>
      </div>

      <div ref={tourSectionRef} className="w-full h-full lg:h-[1580px] mt-0">
        <div className="h-32 sm:h-80 md:h-32 relative mt-72 lg:mb-20 w-full">
          <ImgSlider />
        </div>

        {embedUrl && (
          <div className="mt-[500px] xl:h-[700px] lg:h-[660px] md:h-[400px] lg:mx-24 md:mx-14 mx-4 border-none mb-10">
            <iframe
              src={embedUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full border-none"
            />
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Оставить заявку"
        >
          <form>
            <div className="w-full h-auto flex flex-col justify-evenly gap-4 p-4">
              <input
                type="text"
                value={request.fullName}
                onChange={(e) =>
                  setRequest({ ...request, fullName: e.target.value })
                }
                className="border-fistash border-2 rounded-md pl-1 focus:outline-none h-10"
                placeholder="full name"
              />
              <input
                type="text"
                value={request.country}
                onChange={(e) =>
                  setRequest({ ...request, country: e.target.value })
                }
                className="border-fistash border-2 rounded-md pl-1 focus:outline-none h-10"
                placeholder="where are you from"
              />

              <input
                type="tel"
                value={request.phone}
                onChange={(e) =>
                  setRequest({ ...request, phone: e.target.value })
                }
                className="border-fistash border-2 rounded-md pl-1 focus:outline-none h-10"
                placeholder="phone"
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
              <input
                type="text"
                value={request.question}
                onChange={(e) =>
                  setRequest({ ...request, question: e.target.value })
                }
                className="border-fistash border-2 rounded-md pl-1 focus:outline-none h-10"
                placeholder="question"
              />
              <button
                type="submit"
                className="w-full bg-fistash text-white rounded-md py-2"
              >
                Send
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
}
