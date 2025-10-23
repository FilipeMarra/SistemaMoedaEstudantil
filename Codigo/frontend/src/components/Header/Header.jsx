import { useEffect, useState } from 'react'
import { Link, NavLink,useLocation } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'



export default function Header() {
  
  const [tema, setTema] = useState(() => localStorage.getItem('tema') || 'dark')
  const location = useLocation();
  const isLandingPage = location.pathname === '/landingpage';

  useEffect(() => {
    const html = document.documentElement
    tema === 'light' ? html.setAttribute('data-theme', 'light') : html.removeAttribute('data-theme')
    localStorage.setItem('tema', tema)
  }, [tema])

  return (
    <header className="header">
      <div className="container header-row">
        <Link to="/" className="brand">
  
</Link>


        <nav className="nav">
          <NavLink to="/listagem-aluno" end>Início</NavLink>
        </nav>
        {isLandingPage && (<Link to="/login" className="header-login-button">Login</Link>)}
        <div className="user" style={{ gap: 12 }}>
          <button onClick={() => setTema(tema === 'dark' ? 'light' : 'dark')} className="btn">
            {tema === 'dark' ? <Sun size={19} color='white'/> : <Moon size ={19} />}
          </button>

          
        </div>
      </div>
    </header>
  )
}
