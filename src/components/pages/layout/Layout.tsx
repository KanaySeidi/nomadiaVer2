import Footer from "@/components/organisms/footer/Footer";
import Header from "@/components/organisms/header/Header";
import Loader from "@/components/organisms/loader/Loader";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div className="min-h-dvh flex flex-col">
        <Header />
        <main className="flex-1">
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
