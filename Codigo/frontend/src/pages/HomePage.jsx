// src/pages/HomePage.jsx
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import HeroSection from '../components/Hero/HeroSection';
import PublicAcervosSection from '../components/Acervos/PublicAcervosSection';
import PrivateAcervosSection from '../components/Acervos/PrivateAcervosSection'; 
import AboutSection from '../components/About/AboutSection';

const HomePage = () => {
  return (
    <>
      <Header />
      <HeroSection
  title="Bem vindo ao Santo Restauro"
  
/>

      <PublicAcervosSection />
      <PrivateAcervosSection />
       <AboutSection />
      <Footer />
    </>
  );
};

export default HomePage;
