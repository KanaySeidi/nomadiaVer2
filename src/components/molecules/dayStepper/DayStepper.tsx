// components/molecules/tourdays/DaysStepper.tsx
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Tour } from "@/types";
import Stepper, { Step } from "@/components/Stepper";
import TiltedCard from "@/components/TiltedCard";

type Props = { tour: Tour };

export default function DaysStepper({ tour }: Props) {
  const { t } = useTranslation();

  const days = useMemo(
    () => tour.translation?.dayInfo ?? [],
    [tour.translation?.dayInfo]
  );

  console.log(tour);

  if (!days.length) {
    return (
      <div className="flex flex-col items-center h-40 justify-around">
        <p className="text-3xl text-center">{t("noTour")}</p>
      </div>
    );
  }

  return (
    <Stepper
      initialStep={1}
      onStepChange={() => {}}
      onFinalStepCompleted={() => {}}
      backButtonText={t("prev") || "Previous"}
      nextButtonText={t("next") || "Next"}
      className="w-screen"
    >
      {days.map((day, idx) => (
        <Step key={day.id ?? idx}>
          <div className="">
            <div>
              <p className="text-sm text-fistash font-semibold mb-2">
                {t("detailTour.day")} {idx + 1}
              </p>
              <h3 className="xl:text-xl lg:text-xl md:text-lg sm:text-base text-sm bg-fistash text-bel inline-block px-3 py-1 rounded mb-3">
                {day.title || t("noTitle")}
              </h3>
              <p className="text-gray-700 xl:text-lg lg:text-base md:text-base sm:text-sm text-xs text-justify">
                {day.text || t("noDescription")}
              </p>
            </div>

            <div className="w-full flex justify-around py-20">
              {day.images?.[0] && (
                <TiltedCard
                  imageSrc={day.images[0]}
                  captionText="Nomadia Moments"
                  containerHeight="300px"
                  containerWidth="300px"
                  imageHeight="300px"
                  imageWidth="300px"
                  rotateAmplitude={12}
                  scaleOnHover={1.2}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={true}
                  overlayContent={
                    <p className="tilted-card-demo-text m-4 p-2 backdrop-blur-lg bg-white/60 rounded-2xl">
                      Nomadia Moments
                    </p>
                  }
                />
              )}
              {day.images?.[1] && (
                <TiltedCard
                  imageSrc={day.images[1]}
                  altText=""
                  captionText=" Nomadia Moments"
                  containerHeight="300px"
                  containerWidth="300px"
                  imageHeight="300px"
                  imageWidth="300px"
                  rotateAmplitude={12}
                  scaleOnHover={1.2}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={true}
                  overlayContent={
                    <p className="tilted-card-demo-text m-4 p-2 backdrop-blur-lg bg-white/60 rounded-2xl">
                      Nomadia Moments
                    </p>
                  }
                />
              )}
              {day.images?.[2] && (
                <TiltedCard
                  imageSrc={day.images[3]}
                  captionText="Nomadia Moments"
                  containerHeight="300px"
                  containerWidth="300px"
                  imageHeight="300px"
                  imageWidth="300px"
                  rotateAmplitude={12}
                  scaleOnHover={1.2}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={true}
                  overlayContent={
                    <p className="tilted-card-demo-text m-4 p-2 backdrop-blur-lg bg-white/60 rounded-2xl">
                      Nomadia Moments
                    </p>
                  }
                />
              )}
            </div>
          </div>
        </Step>
      ))}
    </Stepper>
  );
}
