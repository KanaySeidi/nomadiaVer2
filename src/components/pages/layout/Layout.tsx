import Footer from "@/components/organisms/footer/Footer";
import Header from "@/components/organisms/header/Header";
import Loader from "@/components/organisms/loader/Loader";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
};

export default Layout;
