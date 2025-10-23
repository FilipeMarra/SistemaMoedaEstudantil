import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
/* import LandingPage from '../pages/LandingPage';
import AcervoPage from '../pages/AcervoPage';
import HomePage from '../pages/HomePage';
import ListagemPage from '../pages/ListagemPage';
import CadastroAcervoPage from '../pages/CadastroAcervoPage';
import CadastroItemPage from '../pages/CadastroItemPage';
import EditarAcervoPage from '../pages/EditarAcervoPage'; */
import UserCadastroPage from '../pages/UserCadastroPage';
/* import LoginPage from '../pages/LoginPage'; */
import ListagemAlunoPage from '../pages/ListagemAlunoPage';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<LandingPage />} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/acervo/:id" element={<AcervoPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/listagemacervo" element={<ListagemPage />} />
        <Route path="/cadastro-acervo" element={<CadastroAcervoPage />} />
        <Route path="/cadastro-item" element={<CadastroItemPage />} />
        <Route path="/editar-acervo/:id" element={<EditarAcervoPage />} /> */}
        <Route path="/cadastrar-aluno" element={<UserCadastroPage />} />
        {/* <Route path="/login" element={<LoginPage />} /> */}
        <Route path="/listagem-aluno" element={<ListagemAlunoPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
