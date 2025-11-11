import { useTranslation } from "react-i18next";
import FlowingMenu from "@/components/FlowingMenu";
import type { CA } from "@/types";
import { CACountry } from "@/components/atoms/CA";

function CA() {
  const { t } = useTranslation();

  const items: CA[] = CACountry.map((c) => ({
    link: c.link,
    text: t(c.text),
    image: c.image,
  }));

  return (
    <div className="w-screen h-screen bg-fistash">
      <div className="w-full h-full pb-40">
        <div className="relative h-[600px] overflow-hidden">
          <FlowingMenu items={items} />
        </div>
      </div>
    </div>
  );
}

export default CA;
