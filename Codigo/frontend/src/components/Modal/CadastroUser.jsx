import React, { useState } from 'react';
import './CadastroUser.css';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:8000/api/users/'; 

const CadastroUser = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userData = {
      username: name,
      email,
      password
    };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessagesArrays = Object.values(errorData);
        const firstErrorMessage = errorMessagesArrays[0][0]; 
        setError(firstErrorMessage);
        setLoading(false);
        return;
      }

      const User = await response.json();
      Swal.fire({
        icon: 'success',
        title: 'Cadastrado com Sucesso!',
        text: `O usuário "${User.username}" foi criado.`,
      }).then(() => {
        onClose(); 
      });

    } catch (err) {

      setError("Algo de errado ao cadastrar usuário. Verifique sua conexão ou tente novamente mais tarde.");
      console.error("Falha no cadastro", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h2>Cadastrar Novo Usuário</h2>
      
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label htmlFor="name">Nome completo</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="password">Senha</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirmar Senha</label>
        <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      </div>

      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? 'Salvando...' : 'Criar Conta'}
      </button>
    </form>
  );
};

export default CadastroUser;