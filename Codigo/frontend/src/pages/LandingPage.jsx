import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import HeroSection from '../components/Hero/HeroSection';
import AboutSection from '../components/About/AboutSection';
import PublicAcervosSection from '../components/Acervos/PublicAcervosSection';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <>
      <Header />
      <HeroSection title="Bem vindo ao Santo Restauro" />
      
      <PublicAcervosSection />

      <div className="login-prompt">
        <p>Quer acessar seus acervos privados?</p>
        <Link to="/login" className="login-button">Fazer Login</Link>
      </div>

      <AboutSection />
      <Footer />
    </>
  );
};

export default LandingPage;
