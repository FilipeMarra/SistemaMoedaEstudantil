import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import CadastraEmpresa from '../components/Modal/CadastraEmpresa'; 
import '../styles/UserPage.css';

const CadastraEmpresaPage = () => {
  return (
    <>
      <Header />
      <main className="user-list-container">
        <CadastraEmpresa />
      </main>
      <Footer />
    </>
  );
};

export default CadastraEmpresaPage;
