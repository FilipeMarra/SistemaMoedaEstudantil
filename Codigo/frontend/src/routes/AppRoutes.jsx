import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserCadastroPage from '../pages/UserCadastroPage';
import LoginPage from '../pages/LoginPage'; 
import RecuperarSenhaPage from '../pages/RecuperarSenhaPage'; 
import ResetarSenhaPage from '../pages/ResetarSenhaPage'; 
import ListagemAlunoPage from '../pages/ListagemAlunoPage';
import DashboardAlunoPage from '../pages/DashBoardAlunoPage';
import TransferirPage from '../pages/TransferirPage';
import ExtratoPage from '../pages/ExtratoPage';
import CadastroProfessorPage from '../pages/CadastroProfessorPage';
import CadastraEmpresaPage from '../pages/CadastraEmpresaPage';
import CadastraVantagemPage from '../pages/CadastraVantagemPage';
import MinhasVantagensPage from '../pages/MinhasVantagensPage';


import RequireAuth from './RequireAuth';
import VantagemPage from '../pages/VantagemListagemPage';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<RequireAuth><DashboardAlunoPage /></RequireAuth>} />
        <Route path="/cadastrar-aluno" element={<UserCadastroPage />} />
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} /> 
        <Route path="/resetar-senha/:token" element={<ResetarSenhaPage />} />
        <Route path="/listagem-aluno" element={<RequireAuth><ListagemAlunoPage /></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAuth><DashboardAlunoPage/></RequireAuth>}/>
        <Route path="/transferir" element={<RequireAuth><TransferirPage/></RequireAuth>}/>
        <Route path="/extrato" element={<RequireAuth><ExtratoPage/></RequireAuth>}/>
        <Route path="/vantagens" element={<RequireAuth><VantagemPage/></RequireAuth>}/>
        <Route path="/cadastra-vantagem" element={<RequireAuth><CadastraVantagemPage/></RequireAuth>} />
        <Route path="/cadastro-professor" element={<RequireAuth><CadastroProfessorPage/></RequireAuth>} />
        <Route path="/cadastra-empresa" element={<RequireAuth><CadastraEmpresaPage/></RequireAuth>} />
        <Route path="/minhas-vantagens" element={<RequireAuth><MinhasVantagensPage/></RequireAuth>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
