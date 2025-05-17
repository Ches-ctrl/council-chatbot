
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import MainNavigation from "../components/MainNavigation";
import ServiceCategories from "../components/ServiceCategories";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <HeroSection />
      <MainNavigation />
      <ServiceCategories />
      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
};

export default Index;
