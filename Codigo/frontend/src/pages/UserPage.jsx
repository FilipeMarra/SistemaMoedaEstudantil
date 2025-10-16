import React, { useState } from 'react';
// Removido o Link, pois não vamos mais navegar
// import { Link } from 'react-router-dom';

import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Modal from '../components/Modal/ModalGenerico';
import UserCard from '../components/Usuarios/UserCard';
import CadastroUser from '../components/Modal/CadastroUser'; 
import '../styles/UserPage.css';

const initialUsers = [
  { id: 1, name: 'João Santos', email: 'joaozinho@gmail.com' },
  { id: 2, name: 'Pedro Gomes', email: 'pedrinho@gmail.com' },
  { id: 3, name: 'Lucas Rocha', email: 'luquinhas@gmail.com' },
];

const UserListPage = () => {
  const [users, setUsers] = useState(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (userId) => {
    alert(`Redirecionando para editar o usuário com ID: ${userId}`);
  };

  const handleDelete = (userId) => {
    if (window.confirm(`Tem certeza que deseja apagar o usuário com ID: ${userId}?`)) {
      setUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
      alert(`Usuário ${userId} apagado!`);
    }
  };

  const handleAddUser = (newUser) => {
    setUsers(currentUsers => [newUser, ...currentUsers]);
  };

  return (
    <>
      <Header />
      <main className="user-list-container">
        <div className="user-list-header">
          <h1>Lista de Usuários</h1>
          <button onClick={() => setIsModalOpen(true)} className="register-button">
            Cadastrar usuário
          </button>
        </div>

        <div className="user-list">
          {users.map(user => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </main>
      <Footer />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CadastroUser
          onAddUser={handleAddUser} 
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default UserListPage;