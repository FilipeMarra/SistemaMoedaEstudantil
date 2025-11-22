import { FaGithub, FaLinkedin } from "react-icons/fa";
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">

        <div className="footer-section">
          <img src={"../public/img/logo.png"} alt="Logo" className="footer-logo" />
          <p className="footer-desc">
            Sistema Trust The Process — Gestão Inteligente.
          </p>
        </div>

        <div className="footer-section">
          <h4>Contato</h4>
          <a href="#"><FaGithub /> Github</a>
          <a href="#"><FaLinkedin /> LinkedIn</a>
        </div>

      </div>

      <p className="footer-copy">
        © {new Date().getFullYear()} Trust the Process — Projeto acadêmico.
      </p>
    </footer>
  );
}
