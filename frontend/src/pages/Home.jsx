import Header from "../components/layout/Navbar";
import { HeroWithExtras } from "../components/home/Hero";
import AdventureBanner from "../components/home/AdventureBanner";
import AccessoriesGrid from "../components/home/AccessoriesGrid";
import TouringGrid from "../components/home/TouringGrid";
import LongHaul from "../components/home/LongHaul";
import PerformanceGrid from "../components/home/PerformanceGrid";
import BrandTicker from "../components/home/BrandTicker";
import Footer from "../components/layout/footer";

export default function Home() {
  return (
    <>
      <Header />
      <HeroWithExtras />
      <AdventureBanner />
      <AccessoriesGrid />
      <TouringGrid />
      <LongHaul />
      <PerformanceGrid />
      <BrandTicker />
      <Footer />
    </>
  );
}