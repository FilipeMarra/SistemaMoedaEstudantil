import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ListagemAlunos.css';

// API URL
const API_URL = 'http://localhost:8000/api';

const ListagemAlunos = ({ alunosProp }) => {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('nome'); 
  const [sortDir, setSortDir] = useState('asc');
  
  // Buscar alunos reais da API
  useEffect(() => {
    const fetchAlunos = async () => {
      setLoading(true);
      try {
        // Se você já tem os alunos passados como prop, use-os (para testes)
        if (alunosProp && alunosProp.length > 0) {
          setAlunos(alunosProp);
          setError(null);
          return;
        }

        // Caso contrário, tente buscar da API
        // Como o axios não está disponível, vamos usar fetch nativo
        const response = await fetch(`${API_URL}/alunos/`);
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar alunos: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Apenas use os dados da API, sem fallback para dados de demonstração
        setAlunos(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar alunos:', err);
        setError('Não foi possível carregar os alunos cadastrados.');
        // Não use dados de backup - mostre lista vazia quando houver erro
        setAlunos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlunos();
  }, [alunosProp]); 

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
    let list = alunos.filter((a) => {
      if (!q) return true;
      return (
        String(a.id).includes(q) ||
        (a.perfil_detalhes?.user?.username ?? '').toLowerCase().includes(q)
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
  }, [alunos, query, sortBy, sortDir]);

  const clear = () => {
    setQuery('');
    setSortBy('nome');
    setSortDir('asc');
  };

  const isAuthenticated = true

  const handleDelete = async (id) => {
  if (!window.confirm('Tem certeza que deseja excluir este aluno?')) return;

  try {
    const token = localStorage.getItem('access');

    const response = await fetch(`${API_URL}/alunos/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });

    if (response.ok) {
      // Remove o aluno do estado local
      setAlunos((prev) => prev.filter((a) => a.id !== id));
    } else {
      const text = await response.text();
      alert(`Erro ao excluir: ${text}`);
    }
  } catch (err) {
    console.error('Erro ao excluir aluno:', err);
    alert('Não foi possível excluir o aluno. Verifique sua conexão.');
  }
};


  return (
    <section className="listagem-alunos">
      <div className="la-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="la-titulo">
            Listagem de Alunos
            {loading && (
              <small className="ms-3">
                <i className="bi bi-arrow-repeat spinner"></i> Carregando...
              </small>
            )}
          </h2>
          {isAuthenticated && (
            <Link 
              to="/cadastrar-aluno" 
              className="btn btn-success" 
              style={{ 
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 'bold',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <i className="bi bi-plus-circle-fill"></i>
              Cadastrar Novo aluno
            </Link>
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
              aria-label="Pesquisar alunos"
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
              <p className="mt-3">Carregando alunos...</p>
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

                  <th onClick={() => handleSort('descricao')} style={{ cursor: 'pointer', padding: '15px' }}>
                    <div className="d-flex align-items-center">
                      <span>Curso</span>
                      {sortBy === 'descricao' && (
                        <i className={`bi ms-1 ${sortDir === 'asc' ? 'bi-sort-alpha-down' : 'bi-sort-alpha-up'}`}></i>
                      )}
                    </div>
                  </th>

                  <th style={{ padding: '15px' }}>Instituição</th>
                  <th className="col-acao text-center" style={{ padding: '15px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-5">
                      {query.trim() !== '' ? (
                        <>
                          <i className="bi bi-search d-block mb-3" style={{ fontSize: '2rem' }}></i>
                          <p className="mb-0">Nenhum aluno corresponde à sua busca.</p>
                          <small className="text-muted">Tente ajustar os termos da pesquisa.</small>
                        </>
                      ) : alunos.length === 0 ? (
                        <>
                          <i className="bi bi-database-fill-exclamation d-block mb-3" style={{ fontSize: '2rem' }}></i>
                          <p className="mb-0">Não há alunos cadastrados no sistema.</p>
                          <Link to="/cadastrar-aluno" className="btn btn-primary btn-sm mt-3">
                            <i className="bi bi-plus-circle me-1"></i>
                            Cadastrar o primeiro aluno
                          </Link>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-inbox-fill d-block mb-3" style={{ fontSize: '2rem' }}></i>
                          <p className="mb-0">Nenhum aluno encontrado.</p>
                          <small className="text-muted">Tente ajustar os filtros ou cadastre um novo aluno.</small>
                        </>
                      )}
                    </td>
                  </tr>
                ) : (
                  filtered.map((aluno) => {
                    console.log('aluno recebido:', aluno); // <-- aqui o log
                    return (
                      <tr key={aluno?.id} className="align-middle">
                        <td className="col-id">{aluno?.id}</td>
                        <td className="col-nome fw-bold">{aluno.perfil_detalhes?.user_detalhes?.username || 'Sem nome'}</td>
                        <td className="col-desc">{aluno?.curso_detalhes?.nome || 'Sem curso'}</td>
                        <td className="col-desc">{aluno?.instituicao_detalhes?.nome || 'Sem instituição'}</td>
                        <td className="col-acao text-center">
                          <div className="btn-group">
                            <Link to={`/aluno/${aluno.id}`} className="btn btn-info btn-sm">
                              <i className="bi bi-eye-fill me-1"></i>
                            </Link>

                            {isAuthenticated && (
                              <>
                                <Link to={`/editar-aluno/${aluno.id}`} className="btn btn-warning btn-sm">
                                  <i className="bi bi-pencil-fill me-1"></i>
                                </Link>

                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDelete(aluno.id)}
                                >
                                  <i className="bi bi-trash-fill me-1"></i>
                                </button>
                              </>
                            )}
                          </div>
                        </td>

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
                    ? `Mostrando ${filtered.length} ${filtered.length === 1 ? 'aluno cadastrado' : 'alunos cadastrados'}`
                    : alunos.length === 0 && !error
                      ? 'Não há alunos cadastrados no sistema'
                      : 'Nenhum resultado encontrado'
                )}
              </small>
            </div>
            <div>
              {isAuthenticated && (
                <Link to="/cadastrar-aluno" className="btn btn-sm btn-success">
                  <i className="bi bi-plus-circle me-1"></i>
                  Cadastrar novo aluno
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ListagemAlunos;
