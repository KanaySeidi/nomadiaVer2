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
  title: string;
  href: string;
  img: string;
  id: number;
};

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  closeOnBackdrop?: boolean;
};
