import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserCadastroPage from '../pages/UserCadastroPage';
import LoginPage from '../pages/LoginPage'; 
import ListagemAlunoPage from '../pages/ListagemAlunoPage';
import DashboardAlunoPage from '../pages/DashBoardAlunoPage';
import TransferirPage from '../pages/TransferirPage';
import ExtratoPage from '../pages/ExtratoPage';
import RequireAuth from './RequireAuth';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<RequireAuth><DashboardAlunoPage /></RequireAuth>} />
        <Route path="/cadastrar-aluno" element={<UserCadastroPage />} />
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/listagem-aluno" element={<RequireAuth><ListagemAlunoPage /></RequireAuth>} />
        <Route path="/dashboard-aluno" element={<RequireAuth><DashboardAlunoPage/></RequireAuth>}/>
        <Route path="/transferir" element={<RequireAuth><TransferirPage/></RequireAuth>}/>
        <Route path="/extrato" element={<RequireAuth><ExtratoPage/></RequireAuth>}/>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
