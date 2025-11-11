export type Lang = {
  title: string;
  key: string;
};

export type NavLinks = {
  title: string;
  href: string;
  id: number;
};

export type CA = {
  text: string;
  link: string;
  image: string;
  id?: number;
};

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  closeOnBackdrop?: boolean;
};

export type DayPlanItem = {
  day?: number;
  title?: string;
  description?: string;
  [k: string]: unknown;
};

export type ExtraPrice = {
  name?: string;
  amount?: number;
  currency?: string;
  [k: string]: unknown;
};

export type ErrorNotifProps = {
  error: string;
};

// Один день тура
export type TourDay = {
  id: number;
  title: string;
  text: string;
  images: string[];
};

// Перевод/локализация тура
export type TourTranslation = {
  id: number;
  languageCode: string;
  title: string;
  description: string;
  duration: string;
  startDate: string;
  endDate: string;
  dayInfo: TourDay[];
};

// Основной тип тура
export type Tour = {
  id: number;
  country?: string;
  level: string;
  mainImage: string;
  previewImage: string;
  price: number;
  translation?: TourTranslation;
  extraPrices?: unknown[];
};
