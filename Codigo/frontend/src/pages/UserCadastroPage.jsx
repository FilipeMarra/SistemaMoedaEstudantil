import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import CadastroUser from '../components/Modal/CadastroUser'; 
import '../styles/UserPage.css';

const UserCadastroPage = () => {
  return (
    <>
      <Header />
      <main className="user-list-container">
        <CadastroUser />
      </main>
      <Footer />
    </>
  );
};

export default UserCadastroPage;
