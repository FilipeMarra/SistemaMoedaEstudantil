import React, { useState } from 'react';
import './CadastroUser.css';
import Swal from 'sweetalert2';

// endpoints ajustados
const API_EMPRESA_CREATE = 'http://localhost:8000/api/empresa/cadastrar/'; // endpoint único recomendado

const CadastraEmpresa = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [descricao, setDescricao] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');

  
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
      // montar payload aninhado para /alunos/cadastrar/
      const payload = {
        user: {
            username: name,
            email,
            password
        },
        perfil: {
            cpf
        },
        nome_fantasia: nomeFantasia,
        cnpj: cpf,
        descricao: descricao
        };

      const res = await fetch(API_EMPRESA_CREATE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "omit", 
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // tenta extrair mensagem amigável do backend
        let errMsg = 'Falha ao cadastrar. Verifique os dados.';
        try {
          const errData = await res.json();
          // extrair primeira mensagem de erro (se for padrão DRF)
          const firstValue = Object.values(errData)[0];
          if (Array.isArray(firstValue)) errMsg = firstValue[0];
          else if (typeof firstValue === 'string') errMsg = firstValue;
          else errMsg = JSON.stringify(errData);
        } catch (e) {
          // noop
        }
        setError(errMsg);
        setLoading(false);
        return;
      }

      const created = await res.json();

      Swal.fire({
        icon: 'success',
        title: 'Cadastrado com sucesso!',
        text: `A empresa "${created.user?.username || name}" foi criada.`,
      });

      // resetar formulário
      setName('');
      setEmail('');
      setCpf('');
      setPassword('');
      setConfirmPassword('');
      setNomeFantasia('');
      setDescricao('');

    } catch (err) {
      console.error(err);
      setError('Falha ao cadastrar usuário. Verifique a conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h2>Cadastrar Nova Empresa</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <label>Usuário</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Nome fantasia</label>
        <input value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>CNPJ/CPF</label>
        <input value={cpf} onChange={(e) => setCpf(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Descrição</label>
        <input value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Senha</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Confirmar senha</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      </div>

      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? 'Salvando...' : 'Criar Conta'}
      </button>
    </form>
  );
};

export default CadastraEmpresa;
