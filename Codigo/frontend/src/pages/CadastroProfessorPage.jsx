import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import CadastroProfessor from '../components/Modal/CadastroProfessor'; 
import '../styles/UserPage.css';

const CadastroProfessorPage = () => {
  return (
    <>
      <Header />
      <main className="user-list-container">
        <CadastroProfessor />
      </main>
      <Footer />
    </>
  );
};

export default CadastroProfessorPage;
