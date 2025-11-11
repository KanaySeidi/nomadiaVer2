import { useEffect, useMemo } from "react";
import { useSliderImg1 } from "@/api/imageStore/imageStore";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";

import foto from "@/assets/img/Alaymountains.jpg";
import fata from "@/assets/img/Ashabatbutton.png";
import f from "@/assets/img/Dushanbebutton.png";

const mockData = [
  { id: 1, image: foto },
  { id: 2, image: fata },
  { id: 3, image: f },
];

export default function AutoScrollImgSlider() {
  const { images, err, getSliderImg1 } = useSliderImg1();

  useEffect(() => {
    getSliderImg1().catch(() => {});
  }, [getSliderImg1]);

  if (err) return <p className="text-red-500">{err}</p>;

  // 1) база данных (из стора или мок)
  const base = useMemo(() => (images?.length ? images : mockData), [images]);

  // 2) защита от 1–2 элементов и дублирование до переполнения
  const renderSlides = useMemo(() => {
    if (base.length === 1) return [base[0], base[0], base[0], base[0]];
    if (base.length === 2) return [...base, ...base, ...base, ...base]; // 8 шт

    const MIN_RENDER = 14; // целимся в 14+, чтобы и на 2xl было движение
    const repeats = Math.ceil(MIN_RENDER / base.length);
    return Array.from({ length: repeats }).flatMap((_, i) =>
      base.map((it) => ({ ...it, _k: `${it.id}-${i}` }))
    );
  }, [base]);

  return (
    <section className="w-full py-6">
      <Carousel
        className="w-full"
        opts={{
          loop: true,
          align: "start",
          dragFree: true, // плавная лента без снапов
          containScroll: false, // важно, чтобы не «упираться» на больших экранах
        }}
        plugins={[
          AutoScroll({
            speed: 1.6,
            startDelay: 0,
            stopOnInteraction: false,
            stopOnMouseEnter: false,
            playOnInit: true,
          }),
        ]}
      >
        <CarouselContent className="-ml-2">
          {renderSlides.map((item: any, idx: number) => (
            <CarouselItem
              key={item._k ?? `${item.id}-${idx}`}
              // больше карточек в кадре на широких экранах
              className="pl-2 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/7 xl:basis-1/8 2xl:basis-1/10"
            >
              <div className="p-1">
                <Card className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                  <CardContent className="p-0 aspect-[4/3] flex items-center justify-center">
                    <img
                      src={item.image}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
