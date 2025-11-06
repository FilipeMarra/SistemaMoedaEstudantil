import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import CadastraVantagem from '../components/Modal/CadastraVantagem'; 
import '../styles/UserPage.css';

const CadastraVantagemPage = () => {
  return (
    <>
      <Header />
      <main className="user-list-container">
        <CadastraVantagem />
      </main>
      <Footer />
    </>
  );
};

export default CadastraVantagemPage;
