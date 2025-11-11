import * as React from "react";
import { useTranslation } from "react-i18next";
import Autoplay from "embla-carousel-autoplay";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export type Slide = {
  title: string;
  description?: string;
  image?: string;
};

export type InfoCarouselProps = {
  slidesData: Slide[] | null | undefined;
  autoplay?: boolean;
  delay?: number;
  pauseOnHover?: boolean;
  showArrows?: boolean;
  className?: string;
};

export default function SimpleSlider({
  slidesData,
  autoplay = true,
  delay = 8000,
  pauseOnHover = true,
  showArrows = false,
  className,
}: InfoCarouselProps) {
  const { t } = useTranslation();

  if (!slidesData || !Array.isArray(slidesData) || slidesData.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Нет доступных слайдов для отображения.
      </p>
    );
  }

  const plugin = React.useRef(
    Autoplay({
      delay,
      stopOnInteraction: true,
    })
  );

  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(slidesData.length);

  React.useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const onMouseEnter =
    pauseOnHover && autoplay ? plugin.current.stop : undefined;
  const onMouseLeave =
    pauseOnHover && autoplay ? plugin.current.reset : undefined;

  return (
    <div className={cn("w-full", className)}>
      <Carousel
        setApi={setApi}
        plugins={autoplay ? [plugin.current] : []}
        className="w-full"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        opts={{ align: "start", loop: true }}
      >
        <CarouselContent>
          {slidesData.map((slide, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent>
                  {slide.image ? (
                    <div
                      className=""
                      style={{ backgroundImage: `url(${slide.image})` }}
                    />
                  ) : (
                    <div className="" />
                  )}
                  <div className="">
                    <div className="">
                      <p className="text-2xl text-fistash">{t(slide.title)}</p>
                      {slide.description ? (
                        <p className="">{t(slide.description)}</p>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        {showArrows && (
          <>
            <CarouselPrevious className="-left-2 md:-left-4" />
            <CarouselNext className="-right-2 md:-right-4" />
          </>
        )}
      </Carousel>
    </div>
  );
}
