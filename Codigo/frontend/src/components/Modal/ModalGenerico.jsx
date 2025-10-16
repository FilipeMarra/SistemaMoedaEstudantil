import React from 'react';
import './ModalGenerico.css';

// Recebe 3 props:
// isOpen: um booleano que diz se o modal está visível ou não
// onClose: uma função para fechar o modal
// children: o conteúdo que será renderizado dentro do modal
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null; // Se não estiver aberto, não renderiza nada
  }

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleModalContentClick}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;