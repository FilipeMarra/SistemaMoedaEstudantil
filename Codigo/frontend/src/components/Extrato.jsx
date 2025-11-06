import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Extrato.css';
import { getUserFromToken } from "./auth";

// API URL
const API_URL = 'http://localhost:8000/api';

const ExtratoListagem = ({ transacoesProp }) => {
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('nome'); 
  const [sortDir, setSortDir] = useState('asc');
  const [saldo, setSaldo] = useState(null);

  const user = getUserFromToken();
  
  useEffect(() => {
  const fetchSaldo = async () => {
    try {
      const response = await fetch(`${API_URL}/saldo/?id=${user.id}`);
      if (!response.ok) throw new Error('Erro ao buscar saldo');
      const data = await response.json();
      setSaldo(data.saldo);
    } catch (err) {
      console.error(err);
      setSaldo(null);
    }
  };

  fetchSaldo();
}, []);

  // Buscar transações reais da API
  useEffect(() => {
    const fetchTransacoes = async () => {
      setLoading(true);
      try {
        // Se você já tem os transações passados como prop, use-os (para testes)
        if (transacoesProp && transacoesProp.length > 0) {
          setTransacoes(transacoesProp);
          setError(null);
          return;
        }

        // Caso contrário, tente buscar da API
        // Como o axios não está disponível, vamos usar fetch nativo
        const response = await fetch(`${API_URL}/transacoes/`);
      
        //console.log('Resposta da API de transações:', response); // <-- log da resposta
        if (!response.ok) {
          throw new Error(`Erro ao buscar transações: ${response.status}`);
        }
        
        const data = await response.json();

        const transacoesFiltradas = data.filter(
        (t) => t.aluno === user.id || t.aluno_detalhes?.perfil_detalhes?.user_detalhes?.id === user?.id
        );
        // Apenas use os dados da API, sem fallback para dados de demonstração
        setTransacoes(transacoesFiltradas);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar transacoes:', err);
        setError('Não foi possível carregar os transacoes cadastrados.');
        // Não use dados de backup - mostre lista vazia quando houver erro
        setTransacoes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransacoes();
  }, [transacoesProp]); 

  const handleSort = (campo) => {
    if (sortBy === campo) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(campo);
      setSortDir('asc');
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = transacoes.filter((a) => {
      if (!q) return true;
      return (
        String(a.id).includes(q) ||
        (a.perfil_detalhes.user.username ?? '').toLowerCase().includes(q)
      );
    });

    list.sort((a, b) => {
      if (sortBy === 'id') {
        return sortDir === 'asc' ? a.id - b.id : b.id - a.id;
      }
      const A = (a[sortBy] ?? '').toString().toLowerCase();
      const B = (b[sortBy] ?? '').toString().toLowerCase();
      if (A < B) return sortDir === 'asc' ? -1 : 1;
      if (A > B) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [transacoes, query, sortBy, sortDir]);

  const clear = () => {
    setQuery('');
    setSortBy('nome');
    setSortDir('asc');
  };

  return (
    <section className="listagem-alunos">
      <div className="la-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="la-titulo">
            Listagem de Transações
            {loading && (
              <small className="ms-3">
                <i className="bi bi-arrow-repeat spinner"></i> Carregando...
              </small>
            )}
            
          </h2>

          {saldo !== null && (
            <div className="saldo-box bg-dark text-light p-3 rounded shadow-sm">
              <strong>Saldo atual: </strong> 
              <span className="text-success">R$ {Number(saldo).toFixed(2)}</span>
            </div>
          )}
        </div>


        {/* Mensagem de erro */}
        {error && (
          <div className="alert alert-warning mb-3 d-flex align-items-center" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2" style={{ fontSize: '1.5rem' }}></i>
            <div>
              <strong>Não foi possível conectar ao servidor</strong>
              <p className="mb-0 mt-1">{error}</p>
              <small className="mt-2 d-block">
                Verifique se o backend está em execução e tente novamente. 
                <button 
                  className="btn btn-sm btn-outline-dark ms-2" 
                  onClick={() => window.location.reload()}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Tentar novamente
                </button>
              </small>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="la-filtros" style={{ 
          padding: '15px', 
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
        }}>
          <label className="la-filtro-group">
            <span className="label">
              <i className="bi bi-search me-2"></i>
              Pesquisar
            </span>
            <input
              type="search"
              placeholder="Digite para buscar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="la-input"
              aria-label="Pesquisar transação"
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #444'
              }}
            />
          </label>

          <button 
            type="button" 
            className="btn btn-outline-secondary" 
            onClick={clear}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <i className="bi bi-x-circle"></i>
            Limpar
          </button>
        </div>

        {/* Tabela */}
        <div className="la-table-wrap" style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
        }}>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p className="mt-3">Carregando histórico...</p>
            </div>
          ) : (
            <table className="table table-dark table-hover">
              <thead>
                <tr className="bg-black bg-opacity-50">             
                  <th className="col-id" onClick={() => handleSort('id')} style={{ cursor: 'pointer', padding: '15px' }}>
                    <div className="d-flex align-items-center">
                      <span>ID</span>
                      {sortBy === 'id' && (
                        <i className={`bi ms-1 ${sortDir === 'asc' ? 'bi-sort-numeric-down' : 'bi-sort-numeric-up'}`}></i>
                      )}
                    </div>
                  </th>

                  <th onClick={() => handleSort('nome')} style={{ cursor: 'pointer', padding: '15px' }}>
                    <div className="d-flex align-items-center">
                      <span>Nome</span>
                      {sortBy === 'nome' && (
                        <i className={`bi ms-1 ${sortDir === 'asc' ? 'bi-sort-alpha-down' : 'bi-sort-alpha-up'}`}></i>
                      )}
                    </div>
                  </th>

                  <th onClick={() => handleSort('nome')} style={{ cursor: 'pointer', padding: '15px' }}>
                    <div className="d-flex align-items-center">
                      <span>Tipo</span>
                      {sortBy === 'nome' && (
                        <i className={`bi ms-1 ${sortDir === 'asc' ? 'bi-sort-alpha-down' : 'bi-sort-alpha-up'}`}></i>
                      )}
                    </div>
                  </th>


                  <th onClick={() => handleSort('descricao')} style={{ cursor: 'pointer', padding: '15px' }}>
                    <div className="d-flex align-items-center">
                      <span>Valor</span>
                      {sortBy === 'descricao' && (
                        <i className={`bi ms-1 ${sortDir === 'asc' ? 'bi-sort-alpha-down' : 'bi-sort-alpha-up'}`}></i>
                      )}
                    </div>
                  </th>

                  <th style={{ padding: '15px' }}>Data</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-5">
                      {query.trim() !== '' ? (
                        <>
                          <i className="bi bi-search d-block mb-3" style={{ fontSize: '2rem' }}></i>
                          <p className="mb-0">Nenhum histórico corresponde à sua busca.</p>
                          <small className="text-muted">Tente ajustar os termos da pesquisa.</small>
                        </>
                      ) : transacoes.length === 0 ? (
                        <>
                          <i className="bi bi-database-fill-exclamation d-block mb-3" style={{ fontSize: '2rem' }}></i>
                          <p className="mb-0">Não há histórico do extrato no sistema.</p>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-inbox-fill d-block mb-3" style={{ fontSize: '2rem' }}></i>
                          <p className="mb-0">Nenhum histórico encontrado.</p>
                          <small className="text-muted">Tente ajustar os filtros.</small>
                        </>
                      )}
                    </td>
                  </tr>
                ) : (
                  filtered.map((transacao) => {
                    console.log('transacao recebido:', transacao); // <-- aqui o log
                    return (
                      <tr key={transacao.id} className="align-middle">
                        <td className="col-id">{transacao.id}</td>
                        <td className="col-nome fw-bold">
                          {transacao.tipo === 'RECEBIDO'
                            ? transacao.professor_detalhes?.perfil_detalhes?.user_detalhes?.username || 'Professor não informado'
                            : transacao.tipo === 'ENVIO'
                            ? transacao.aluno_detalhes?.perfil_detalhes?.user_detalhes?.username || 'Aluno não informado'
                            : transacao.vantagem_detalhes?.nome || 'Item não informado'}
                        </td>                       
                        <td className="col-desc">{transacao.tipo || 'Sem tipo'}</td>
                        <td className="col-desc">{transacao.valor || 'Sem valor'}</td>
                        <td className="col-desc">{transacao.data || 'Sem data'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
          
          {/* Contador de resultados */}
          <div className="p-3 border-top border-secondary bg-black bg-opacity-25 d-flex justify-content-between align-items-center">
            <div>
              <small>
                {!loading && (
                  filtered.length > 0 
                    ? `Mostrando ${filtered.length} ${filtered.length === 1 ? 'extrato salvo' : 'extrato salvo'}`
                    : transacoes.length === 0 && !error
                      ? 'Não há extrato salvo no sistema'
                      : 'Nenhum resultado encontrado'
                )}
              </small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExtratoListagem;
