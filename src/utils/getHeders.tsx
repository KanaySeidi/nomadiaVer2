import i18next from "i18next";

export const getHeders = () => {
  const headers = new Headers();
  headers.set("Accept-Language", i18next.language);
  return headers;
};
