import React, { useState, useEffect } from 'react';
import './CadastroUser.css';
import Swal from 'sweetalert2';

// endpoints ajustados
const API_PROFESSOR_CREATE = 'http://localhost:8000/api/professor/cadastrar/'; // endpoint único recomendado
const API_INSTITUICOES = 'http://localhost:8000/api/instituicoes/';
const CadastroProfessor = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [instituicao, setInstituicao] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [instituicoes, setInstituicoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // carrega instituições ao montar
  useEffect(() => {
    const fetchInstituicoes = async () => {
      try {
        const res = await fetch(API_INSTITUICOES);
        if (!res.ok) throw new Error('Falha ao carregar instituições');
        const data = await res.json();
        setInstituicoes(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInstituicoes();
  }, []);

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
        instituicao: parseInt(instituicao, 10)
      };

      const res = await fetch(API_PROFESSOR_CREATE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "omit", // 👈 ESSENCIAL!
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
        text: `O aluno "${created.user?.username || name}" foi criado.`,
      });

      // resetar formulário
      setName('');
      setEmail('');
      setCpf('');
      setInstituicao('');
      setPassword('');
      setConfirmPassword('');

    } catch (err) {
      console.error(err);
      setError('Falha ao cadastrar usuário. Verifique a conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h2>Cadastrar Novo Professor</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <label>Nome completo</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>CPF</label>
        <input value={cpf} onChange={(e) => setCpf(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Instituição de Ensino</label>
        <select value={instituicao} onChange={(e) => setInstituicao(e.target.value)} required>
          <option value="">Selecione</option>
          {instituicoes.map(inst => (
            <option key={inst.id} value={inst.id}>{inst.nome}</option>
          ))}
        </select>
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

export default CadastroProfessor;
