import { useState } from "react";
import logo from "@/assets/icon/footerLogo.svg";
import { Link } from "react-router-dom";
import { CACountry } from "@/components/atoms/CA";
import { useTranslation } from "react-i18next";
import Modal from "@/components/molecules/modal/Modal";
import wa from "@/assets/icon/whatsapp-3.svg";

function Footer() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full bg-emerald-900 h-auto pt-10 flex flex-col items-center justify-center z-40">
      <div className="w-full flex flex-col md:flex-row md:justify-between px-6 md:px-24 mb-10">
        <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="" width={130} className="mb-2" />
            <p className="text-white text-xl">Nomadia Tours</p>
          </Link>
        </div>

        <div className="flex flex-col font-black text-fistash items-center md:items-start mb-6 md:mb-0">
          <Link to="/kyrgyzstan" className="hover:text-bel mb-2">
            {t("Kyrgyzstan")}
          </Link>
          {CACountry.map((country) => (
            <Link
              to={country.link}
              key={country.id}
              className="hover:text-bel mb-2"
            >
              {t(country.text)}
            </Link>
          ))}
        </div>

        <div className="text-center md:text-right text-fistash flex flex-col items-center md:items-end">
          <div className="flex items-center gap-2 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-phone xl:block lg:block md:hidden sm:block"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <p>+996 (500) 888 782</p>
          </div>

          <div
            className="flex items-center gap-2 cursor-pointer mb-2"
            onClick={() =>
              window.open(
                "https://www.instagram.com/nomadia_tours/",
                "_blank",
                "noopener noreferrer"
              )
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-instagram xl:block lg:block md:hidden sm:block"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <p>Instagram</p>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-mail xl:block lg:block md:hidden sm:block "
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <p
              className="cursor-pointer xl:text-base lg:text-base md:text-sm sm:text-baes"
              onClick={() => window.open("mailto:info@nomadia-tours.com")}
            >
              info@nomadia-tours.com
            </p>
          </div>

          <div
            className="border border-fistash rounded-md xl:p-2 lg:p-2 md:p-1 sm:p-2 hover:border-bel hover:text-bel cursor-pointer mt-2"
            onClick={handleOpenModal}
          >
            <p>{t("contactUs")}</p>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col items-center">
        <div className="w-full px-6 md:px-24">
          <div className="h-2 border-2 border-fistash bg-fistash rounded-md"></div>
        </div>
        <div className="my-5 text-center text-white text-sm">{t("rights")}</div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Свяжитесь с нами"
      >
        <div className="flex justify-center items-center">
          <img
            src={wa}
            className="w-14 cursor-pointer hover:scale-110"
            alt=""
            onClick={() =>
              window.open(
                "https://wa.me/+996500888782",
                "_blank",
                "noopener noreferrer"
              )
            }
          />
        </div>
      </Modal>
    </div>
  );
}

export default Footer;
