import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './CadastroUser.css';

const API_VANTAGEM_CREATE = 'http://localhost:8000/api/vantagem/cadastrar/';

const CadastraVantagem = () => {
  const [empresaId, setEmpresaId] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [custoMoedas, setCustoMoedas] = useState('');
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('empresa', empresaId);
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('custo_moedas', custoMoedas);
    if (foto) formData.append('foto', foto);

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
        <label>ID da Empresa</label>
        <input value={empresaId} onChange={(e) => setEmpresaId(e.target.value)} required />
      </div>

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
        <label>Foto (opcional)</label>
        <input type="file" accept="image/*" onChange={(e) => setFoto(e.target.files[0])} />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Cadastrar Vantagem'}
      </button>
    </form>
  );
};

export default CadastraVantagem;
