import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    let targetElm = document.querySelector(".main-content .col");
    targetElm.scrollIntoView();
  }, [pathname]);

  return null;
}
