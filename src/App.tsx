import { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import {
  Header,
  Footer,
  SideBar,
  VideoModal,
  ScrollToTop,
  Loader,
} from "@/common";

import "react-loading-skeleton/dist/skeleton.css";
import "swiper/css";

const Catalog = lazy(() => import("./pages/Catalog"));
const Home = lazy(() => import("./pages/Home"));
const Detail = lazy(() => import("./pages/Detail"));
const AnimeDetails = lazy(() => import("./pages/AnimeDetails"));
const Anime = lazy(() => import("./pages/Anime"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ActorDetails = lazy(() => import("./pages/ActorDetails"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const AdminDashboard = lazy(() => import("./pages/Admin/Dashboard"));

const App = () => {
  useEffect(() => {
    document.title = "StreamIn";
  }, []);

  return (
    <>
      <VideoModal />
      <SideBar />
      <Header />
      <main className=" lg:pb-14 md:pb-4 sm:pb-2 xs:pb-1 pb-0">
        <ScrollToTop>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/anime" element={<Anime />} />
              <Route path="/anime/:id" element={<AnimeDetails />} />
              <Route path="/:category/:id" element={<Detail />} />
              <Route path="/actor/:id" element={<ActorDetails />} />
              <Route path="/:category" element={<Catalog />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ScrollToTop>
      </main>

      <Footer />
    </>
  );
};

export default App;
