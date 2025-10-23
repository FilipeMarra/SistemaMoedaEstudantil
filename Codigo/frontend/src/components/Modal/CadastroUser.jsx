import React, { useState, useEffect } from 'react';
import './CadastroUser.css';
import Swal from 'sweetalert2';

// endpoints ajustados
const API_ALUNO_CREATE = 'http://localhost:8000/api/alunos/cadastrar/'; // endpoint único recomendado
const API_INSTITUICOES = 'http://localhost:8000/api/instituicoes/';
const API_CURSOS_POR_INSTITUICAO = (instituicaoId) => `http://localhost:8000/api/cursos/${instituicaoId}/`;

const CadastroUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [endereco, setEndereco] = useState('');
  const [instituicao, setInstituicao] = useState('');
  const [curso, setCurso] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [instituicoes, setInstituicoes] = useState([]);
  const [cursos, setCursos] = useState([]);
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

  // quando instituicao mudar, carrega cursos para ela
  useEffect(() => {
    if (!instituicao) {
      setCursos([]);
      setCurso('');
      return;
    }
    const fetchCursos = async () => {
      try {
        const res = await fetch(API_CURSOS_POR_INSTITUICAO(instituicao));
        if (!res.ok) throw new Error('Falha ao carregar cursos');
        const data = await res.json();
        setCursos(data);
      } catch (err) {
        console.error(err);
        setCursos([]);
      }
    };
    fetchCursos();
  }, [instituicao]);

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
          cpf,
          rg,
          endereco
        },
        instituicao: parseInt(instituicao, 10),
        curso: parseInt(curso, 10)
      };

      const res = await fetch(API_ALUNO_CREATE, {
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
      setRg('');
      setEndereco('');
      setInstituicao('');
      setCurso('');
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
      <h2>Cadastrar Novo Aluno</h2>

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
        <label>RG</label>
        <input value={rg} onChange={(e) => setRg(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Endereço</label>
        <input value={endereco} onChange={(e) => setEndereco(e.target.value)} required />
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
        <label>Curso</label>
        <select value={curso} onChange={(e) => setCurso(e.target.value)} required disabled={!instituicao}>
          <option value="">Selecione</option>
          {cursos.map(c => (
            <option key={c.id} value={c.id}>{c.nome}</option>
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

export default CadastroUser;
