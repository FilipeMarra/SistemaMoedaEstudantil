import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/landingpage';
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="container header-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/" className="header-logo" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="../public/img/logo-header.png" // <-- coloque aqui o caminho da sua logo
              alt="Logo"
              style={{ height: 50 }} // ajuste o tamanho conforme quiser
            />
          </Link>
          {/* Botão de voltar */}
          {location.pathname !== '/' &&
            !location.pathname.startsWith('/dashboard') && (
              <button
                className="back-button"
                onClick={() => {
                  const path = location.pathname || '';
                  // Se estiver em páginas de acervo, volta pra listagem
                  if (
                    /^\/acervo(\/\d+)?/.test(path) ||
                    path.startsWith('/editar-acervo') ||
                    path.startsWith('/cadastro-acervo') ||
                    path.startsWith('/listagemacervo')
                  ) {
                    navigate('/listagemacervo');
                    return;
                  }
                  // Senão, tenta voltar no histórico
                  if (window.history.length > 1) navigate(-1);
                  else navigate('/');
                }}
                aria-label="Voltar"
              >
                <ArrowLeft size={18} color="white"/>
              </button>
            )}

         
        </div>

        <nav className="nav">
          <NavLink to="/" end>
            Trust D Process
          </NavLink>
        </nav>

        {isLandingPage && (
          <Link to="/login" className="header-login-button">
            Login
          </Link>
        )}

        <div className="user" style={{ gap: 12 }}></div>
      </div>
    </header>
  );
}
