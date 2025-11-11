import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import React from "react";

type ScrollToTopOnPageChangeProps = {
  children: React.ReactNode;
  behavior?: ScrollBehavior;
};

const ScrollToTopOnPageChange: React.FC<ScrollToTopOnPageChangeProps> = ({
  children,
  behavior = "smooth",
}) => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior });
  }, [pathname, behavior]);

  return <>{children}</>;
};

export default ScrollToTopOnPageChange;
