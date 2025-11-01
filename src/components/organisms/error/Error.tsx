import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function Error() {
  const { t } = useTranslation();

  return (
    <section className="flex items-center justify-center min-h-screen bg-white font-serif">
      <div className="text-center mb-24">
        <div
          className="bg-center bg-no-repeat bg-cover w-full h-[500px] flex items-center justify-center"
          style={{
            backgroundImage:
              "url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')",
          }}
        ></div>

        <div className="mt-[-60px]">
          <h3 className="text-2xl font-bold">{t("lost")}</h3>

          <p className="text-lg mb-4">{t("notAvailabel")}</p>

          <Link
            to="/"
            className="inline-block px-6 py-2 text-white bg-green-600 rounded hover:bg-green-700 transition duration-300"
          >
            {t("goHome")}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Error;
