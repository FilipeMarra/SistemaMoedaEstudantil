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
        <h1>Cadastro de Usuário</h1>
        <CadastroUser />
      </main>
      <Footer />
    </>
  );
};

export default UserCadastroPage;
