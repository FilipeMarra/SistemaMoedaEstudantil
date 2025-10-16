import React from 'react';
import './UserCard.css'; // Importação de CSS padrão

const UserCard = ({ user, onEdit, onDelete }) => {
  return (
    // Usando classes CSS normais (strings)
    <div className="user-card">
      <div className="user-info">
        <span className="user-name">{user.name}</span>
        <span className="user-email">{user.email}</span>
      </div>
      <div className="user-actions">
        <button onClick={() => onEdit(user.id)} className="edit-button">
          Editar
        </button>
        <button onClick={() => onDelete(user.id)} className="delete-button">
          Apagar
        </button>
      </div>
    </div>
  );
};

export default UserCard;