import React, { useState , useEffect} from 'react';
import Swal from 'sweetalert2';
import './CadastroUser.css';
import { getUserFromToken } from "../auth";

const API_VANTAGEM_CREATE = 'http://localhost:8000/api/vantagem/cadastrar/';

const CadastraVantagem = () => {
  const [empresaId, setEmpresaId] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [custoMoedas, setCustoMoedas] = useState('');
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = getUserFromToken();
    if (user?.id) {
      setEmpresaId(user.id);
    }
  }, []); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('empresa', empresaId);
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('custo_moedas', custoMoedas);
    if (foto) formData.append('foto_url', foto);

    try {
      const res = await fetch(API_VANTAGEM_CREATE, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(JSON.stringify(errData));
      }

      await res.json();
      Swal.fire({
        icon: 'success',
        title: 'Vantagem cadastrada!',
        text: `A vantagem "${nome}" foi adicionada.`,
        timer: 2000, 
        showConfirmButton: false,
        willClose: () => {
          window.location.href = '/dashboard'
        }
      });

      setEmpresaId('');
      setNome('');
      setDescricao('');
      setCustoMoedas('');
      setFoto(null);
    } catch (err) {
      setError('Erro ao cadastrar vantagem.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h2>Cadastrar Vantagem</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <label>Nome da Vantagem</label>
        <input value={nome} onChange={(e) => setNome(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Descrição</label>
        <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Custo em Moedas</label>
        <input type="number" value={custoMoedas} onChange={(e) => setCustoMoedas(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>URL da Imagem</label>
        <input 
          type="text" 
          value={foto} 
          onChange={(e) => setFoto(e.target.value)}  
          placeholder="https://..."
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Cadastrar Vantagem'}
      </button>
    </form>
  );
};

export default CadastraVantagem;
