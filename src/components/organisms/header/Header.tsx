import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/icon/logo.svg";
import LanguageSwitcher from "@/components/molecules/languageSwitcher/LanguageSwitcher";
import { AlignRight } from "lucide-react";
import { navLinks } from "@/components/atoms/navLinks";

const Header = () => {
  const [isScroll, setIsScroll] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 80) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div
        className={`w-full h-16 sticky top-0 z-50 font-black text-green-900 flex items-center duration-500 font-[Comfortaa]  ${
          isScroll
            ? "backdrop-blur-lg bg-white/80  transition-app duration-500 ease-in"
            : "bg-white/50 backdrop-blur-lg text-fistash transition-app duration-500 ease-in"
        }`}
      >
        <div className="w-full mx-24 relative flex justify-between items-center">
          <div>
            <Link to="/">
              <img src={logo} alt="Logo" width={150} />
            </Link>
          </div>
          <div className="xl:w-1/2 lg:w-1/2 w-3/4  hidden md:flex justify-between items-center">
            {navLinks.map((navItem, key) => (
              <Link to={navItem.href} key={key}>
                <div className="relative w-full">
                  <p className="xl:text-base text-xs">{t(navItem.title)}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="hidden md:flex items-center gap-2">
              {location.pathname === "/" && (
                <Link to="/admin/sign">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="34"
                    height="34"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgb(27, 94, 32)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="cursor-pointer"
                  >
                    <path d="M12 8V4H8" />
                    <rect width="16" height="12" x="4" y="8" rx="2" />
                    <path d="M2 14h2" />
                    <path d="M20 14h2" />
                    <path d="M15 13v2" />
                    <path d="M9 13v2" />
                  </svg>
                </Link>
              )}
              <div className="flex justify-around items-center w-24 cursor-pointer">
                <LanguageSwitcher />
              </div>
            </div>
            <button
              className="md:hidden p-2"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <AlignRight />
            </button>
          </div>
        </div>
      </div>
      {/* <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } lg:hidden fixed top-12 h-60 left-0 w-full bg-bel text-green-900 z-50`}
      >
        <ul className="flex flex-col p-4 space-y-4">
          {navLinks.map((navItems, key) => (
            <li key={key}>
              {!navItems.isGroup ? (
                <Link
                  to={navItems.href}
                  className="block text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(navItems.title)}
                </Link>
              ) : (
                <ul className="flex flex-col gap-2 pl-4">
                  {navItems.variant?.map((item, key) => (
                    <Link
                      key={key}
                      to={item.href}
                      className="block text-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t(item.title)}
                    </Link>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li>
            <LanguageSwitcher />
          </li>
        </ul>
      </div> */}
    </>
  );
};

export default Header;
