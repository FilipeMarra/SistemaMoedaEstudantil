import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ListagemAlunos.css';

// Lê da env com fallback para localhost (melhor pra deploy)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Função auxiliar para “achatar” os dados do aluno em campos de exibição
function normalizarAluno(aluno) {
  return {
    ...aluno,
    nomeExibicao:
      aluno?.perfil_detalhes?.user_detalhes?.username || 'Sem nome',
    cursoNome:
      aluno?.curso_detalhes?.nome || 'Sem curso',
    instituicaoNome:
      aluno?.instituicao_detalhes?.nome || 'Sem instituição',
  };
}

// Componente de linha da tabela (separa responsabilidade)
const AlunoRow = ({ aluno, isAuthenticated, onDelete }) => {
  return (
    <tr className="align-middle">
      <td className="col-id">{aluno.id}</td>
      <td className="col-nome fw-bold">{aluno.nomeExibicao}</td>
      <td className="col-desc">{aluno.cursoNome}</td>
      <td className="col-desc">{aluno.instituicaoNome}</td>
      <td className="col-acao text-center">
        <div className="btn-group">
          <Link to={`/aluno/${aluno.id}`} className="btn btn-info btn-sm">
            <i className="bi bi-eye-fill me-1"></i>
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to={`/editar-aluno/${aluno.id}`}
                className="btn btn-warning btn-sm"
              >
                <i className="bi bi-pencil-fill me-1"></i>
              </Link>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => onDelete(aluno.id)}
              >
                <i className="bi bi-trash-fill me-1"></i>
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

const ListagemAlunos = ({ alunosProp = [], isAuthenticated = true }) => {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('nome'); // 'id' | 'nome' | 'curso' | 'instituicao'
  const [sortDir, setSortDir] = useState('asc');

  // Busca alunos da API ou usa prop
  useEffect(() => {
    const fetchAlunos = async () => {
      setLoading(true);

      try {
        // Se veio por props (ex: testes), usa direto
        if (alunosProp && alunosProp.length > 0) {
          setAlunos(alunosProp.map(normalizarAluno));
          setError(null);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/alunos/`);

        if (!response.ok) {
          throw new Error(`Erro ao buscar alunos: ${response.status}`);
        }

        const data = await response.json();
        setAlunos(data.map(normalizarAluno));
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar alunos:', err);
        setError('Não foi possível carregar os alunos cadastrados.');
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

  const clear = () => {
    setQuery('');
    setSortBy('nome');
    setSortDir('asc');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este aluno?')) return;

    try {
      const token = localStorage.getItem('access');

      const response = await fetch(`${API_BASE_URL}/alunos/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (response.ok) {
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

  // Função auxiliar para pegar o campo usado na ordenação
  const getCampoOrdenacao = (aluno, campo) => {
    switch (campo) {
      case 'id':
        return aluno.id;
      case 'nome':
        return aluno.nomeExibicao?.toString().toLowerCase() || '';
      case 'curso':
        return aluno.cursoNome?.toString().toLowerCase() || '';
      case 'instituicao':
        return aluno.instituicaoNome?.toString().toLowerCase() || '';
      default:
        return '';
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let lista = alunos.filter((a) => {
      if (!q) return true;

      const termos = [
        String(a.id),
        a.nomeExibicao?.toLowerCase() || '',
        a.cursoNome?.toLowerCase() || '',
        a.instituicaoNome?.toLowerCase() || '',
      ];

      return termos.some((t) => t.includes(q));
    });

    lista.sort((a, b) => {
      const A = getCampoOrdenacao(a, sortBy);
      const B = getCampoOrdenacao(b, sortBy);

      if (A < B) return sortDir === 'asc' ? -1 : 1;
      if (A > B) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return lista;
  }, [alunos, query, sortBy, sortDir]);

  return (
    <section className="listagem-alunos">
      <div className="la-container">
        {/* Cabeçalho + botão de cadastro */}
        <div className="la-header">
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
              className="btn btn-success la-botao-cadastrar"
            >
              <i className="bi bi-plus-circle-fill"></i>
              Cadastrar novo aluno
            </Link>
          )}
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div
            className="alert alert-warning mb-3 d-flex align-items-center"
            role="alert"
          >
            <i
              className="bi bi-exclamation-triangle-fill me-2"
              style={{ fontSize: '1.5rem' }}
            ></i>
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
        <div className="la-filtros la-filtros-card">
          <label className="la-filtro-group">
            <span className="label">
              <i className="bi bi-search me-2"></i>
              Pesquisar
            </span>
            <input
              type="search"
              placeholder="Digite nome, curso, instituição ou ID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="la-input"
              aria-label="Pesquisar alunos"
            />
          </label>

          <button
            type="button"
            className="btn btn-outline-secondary la-botao-limpar"
            onClick={clear}
          >
            <i className="bi bi-x-circle"></i>
            Limpar
          </button>
        </div>

        {/* Tabela */}
        <div className="la-table-wrap">
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
                  <th
                    className="col-id"
                    onClick={() => handleSort('id')}
                    style={{ cursor: 'pointer', padding: '15px' }}
                  >
                    <div className="d-flex align-items-center">
                      <span>ID</span>
                      {sortBy === 'id' && (
                        <i
                          className={`bi ms-1 ${
                            sortDir === 'asc'
                              ? 'bi-sort-numeric-down'
                              : 'bi-sort-numeric-up'
                          }`}
                        ></i>
                      )}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('nome')}
                    style={{ cursor: 'pointer', padding: '15px' }}
                  >
                    <div className="d-flex align-items-center">
                      <span>Nome</span>
                      {sortBy === 'nome' && (
                        <i
                          className={`bi ms-1 ${
                            sortDir === 'asc'
                              ? 'bi-sort-alpha-down'
                              : 'bi-sort-alpha-up'
                          }`}
                        ></i>
                      )}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('curso')}
                    style={{ cursor: 'pointer', padding: '15px' }}
                  >
                    <div className="d-flex align-items-center">
                      <span>Curso</span>
                      {sortBy === 'curso' && (
                        <i
                          className={`bi ms-1 ${
                            sortDir === 'asc'
                              ? 'bi-sort-alpha-down'
                              : 'bi-sort-alpha-up'
                          }`}
                        ></i>
                      )}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('instituicao')}
                    style={{ cursor: 'pointer', padding: '15px' }}
                  >
                    <div className="d-flex align-items-center">
                      <span>Instituição</span>
                      {sortBy === 'instituicao' && (
                        <i
                          className={`bi ms-1 ${
                            sortDir === 'asc'
                              ? 'bi-sort-alpha-down'
                              : 'bi-sort-alpha-up'
                          }`}
                        ></i>
                      )}
                    </div>
                  </th>

                  <th className="col-acao text-center" style={{ padding: '15px' }}>
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    {/* 5 colunas de cabeçalho → colSpan=5 (bug corrigido) */}
                    <td colSpan="5" className="text-center py-5">
                      {query.trim() !== '' ? (
                        <>
                          <i
                            className="bi bi-search d-block mb-3"
                            style={{ fontSize: '2rem' }}
                          ></i>
                          <p className="mb-0">
                            Nenhum aluno corresponde à sua busca.
                          </p>
                          <small className="text-muted">
                            Tente ajustar os termos da pesquisa.
                          </small>
                        </>
                      ) : alunos.length === 0 && !error ? (
                        <>
                          <i
                            className="bi bi-database-fill-exclamation d-block mb-3"
                            style={{ fontSize: '2rem' }}
                          ></i>
                          <p className="mb-0">
                            Não há alunos cadastrados no sistema.
                          </p>
                          {isAuthenticated && (
                            <Link
                              to="/cadastrar-aluno"
                              className="btn btn-primary btn-sm mt-3"
                            >
                              <i className="bi bi-plus-circle me-1"></i>
                              Cadastrar o primeiro aluno
                            </Link>
                          )}
                        </>
                      ) : (
                        <>
                          <i
                            className="bi bi-inbox-fill d-block mb-3"
                            style={{ fontSize: '2rem' }}
                          ></i>
                          <p className="mb-0">Nenhum aluno encontrado.</p>
                          <small className="text-muted">
                            Tente ajustar os filtros ou cadastre um novo aluno.
                          </small>
                        </>
                      )}
                    </td>
                  </tr>
                ) : (
                  filtered.map((aluno) => (
                    <AlunoRow
                      key={aluno.id}
                      aluno={aluno}
                      isAuthenticated={isAuthenticated}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* Contador de resultados + atalho rápido de cadastro */}
          <div className="la-table-footer">
            <div>
              <small>
                {!loading &&
                  (filtered.length > 0
                    ? `Mostrando ${filtered.length} ${
                        filtered.length === 1
                          ? 'aluno cadastrado'
                          : 'alunos cadastrados'
                      }`
                    : alunos.length === 0 && !error
                    ? 'Não há alunos cadastrados no sistema'
                    : 'Nenhum resultado encontrado')}
              </small>
            </div>

            {isAuthenticated && (
              <Link to="/cadastrar-aluno" className="btn btn-sm btn-success">
                <i className="bi bi-plus-circle me-1"></i>
                Cadastrar novo aluno
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ListagemAlunos;
