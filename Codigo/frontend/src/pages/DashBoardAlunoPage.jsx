import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Swal from 'sweetalert2';
import { BookOpen, LayoutList, Users } from 'lucide-react';
import '../styles/DashBoardAluno.css';
import { getUserFromToken } from "../components/auth";


const DashboardPage = () => {
	const navigate = useNavigate();
	const [userInfo, setUserInfo] = useState(null);
	const user = getUserFromToken();
	
	useEffect(() => {
	  async function loadUser() {
		if (!user?.id) return;
	
		const res = await fetch(`http://localhost:8000/api/usuarios/${user.id}/`);
		if (res.ok) {
		  const perfil = await res.json();
		  setUserInfo(perfil);
		} else {
		  console.error("Falha ao carregar dados completos do usuário.");
		}
	  }
	
	  loadUser();
	}, [user]);


	const cardsAluno = [
		{
			title: 'Vantagens',
			desc: 'Adiquirir vantagens com suas moedas',
			icon: <BookOpen size={36} />,
			to: '/vantagens',
		},
		{
			title: 'Extrato',
			desc: 'Conferir o histórico de transações',
			icon: <BookOpen size={36} />,
			to: '/extrato',
		},
	];

	const cardsAdm = [
		{
			title: 'Vantagens',
			desc: 'Adiquirir vantagens com suas moedas',
			icon: <BookOpen size={36} />,
			to: '/vantagens',
		},
		{
			title: 'Transferir',
			desc: 'Transferir moedas para outros usuários',
			icon: <Users size={36} />,
			to: '/transferir',
		},
		{
			title: 'Extrato',
			desc: 'Conferir o histórico de transações',
			icon: <BookOpen size={36} />,
			to: '/extrato',
		},
		{
			title: 'Alunos',
			desc: 'Lista de alunos cadastrados',
			icon: <BookOpen size={36} />,
			to: '/listagem-aluno',
		},
		{
			title: 'Professores',
			desc: 'Lista de professores cadastrados',
			icon: <Users size={36} />,
			to: '/cadastro-professor',
		},
		{
			title: 'Empresas Parceiras',
			desc: 'Empras parceiras cadastradas',
			icon: <Users size={36} />,
			to: '/cadastra-empresa',
		},
		{
			title: 'Cadastro de Vantagens',
			desc: 'Cadastra vantagens cadastradas',
			icon: <Users size={36} />,
			to: '/cadastra-vantagem',
		},
	];

	const cardsProfessor = [
		{
			title: 'Transferir',
			desc: 'Transferir moedas para outros usuários',
			icon: <Users size={36} />,
			to: '/transferir',
		},
		{
			title: 'Extrato',
			desc: 'Conferir o histórico de transações',
			icon: <BookOpen size={36} />,
			to: '/extrato',
		},
		{
			title: 'Alunos',
			desc: 'Lista de alunos cadastrados',
			icon: <BookOpen size={36} />,
			to: '/listagem-aluno',
		},
	];

	const cardsEmpresa = [
		{
			title: 'Vantagens',
			desc: 'Adiquirir vantagens com suas moedas',
			icon: <BookOpen size={36} />,
			to: '/vantagens',
		},
		{
			title: 'Cadastro de Vantagens',
			desc: 'Cadastra vantagens cadastradas',
			icon: <Users size={36} />,
			to: '/cadastra-vantagem',
		},
	];

	return (
		<>
			<Header />
			<main className="dashboard-container">
				<header className="dashboard-header">
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
						<div>
							<h1>Bem-vindo ao Painel</h1>
							<p>Escolha uma área para começar a gerenciar o sistema</p>
						</div>
						<button
							className="logout-button"
							onClick={async () => {
								const result = await Swal.fire({
									title: 'Deseja sair?',
									text: 'Você será desconectado do sistema.',
									icon: 'warning',
									showCancelButton: true,
									confirmButtonText: 'Sair',
									cancelButtonText: 'Cancelar',
									reverseButtons: true,
								});
								if (result.isConfirmed) {
									localStorage.removeItem('access');
									localStorage.removeItem('refresh');
									navigate('/login');
									await Swal.fire('Saindo', 'Você foi desconectado.', 'success');
								}
							}}
						>
							Sair
						</button>
					</div>
				</header>
				{userInfo?.detalhes?.tipo == "EMPRESA" &&			
				<section className="dashboard-grid">
					{cardsEmpresa.map((c) => (
						<article
							key={c.title}
							className="dashboard-card"
							onClick={() => navigate(c.to)}
							role="button"
							tabIndex={0}
							onKeyPress={(e) => {
								if (e.key === 'Enter') navigate(c.to);
							}}
						>
							<div className="card-icon">{c.icon}</div>
							<h3>{c.title}</h3>
							<p className="card-desc">{c.desc}</p>
							<span className="card-cta">Acessar →</span>
						</article>
					))}
				</section>
				}

				{userInfo?.detalhes?.tipo == "ALUNO" &&			
				<section className="dashboard-grid">
					{cardsAluno.map((c) => (
						<article
							key={c.title}
							className="dashboard-card"
							onClick={() => navigate(c.to)}
							role="button"
							tabIndex={0}
							onKeyPress={(e) => {
								if (e.key === 'Enter') navigate(c.to);
							}}
						>
							<div className="card-icon">{c.icon}</div>
							<h3>{c.title}</h3>
							<p className="card-desc">{c.desc}</p>
							<span className="card-cta">Acessar →</span>
						</article>
					))}
				</section>
				}
				
				{userInfo?.detalhes?.tipo == "PROFESSOR" &&			
				<section className="dashboard-grid">
					{cardsProfessor.map((c) => (
						<article
							key={c.title}
							className="dashboard-card"
							onClick={() => navigate(c.to)}
							role="button"
							tabIndex={0}
							onKeyPress={(e) => {
								if (e.key === 'Enter') navigate(c.to);
							}}
						>
							<div className="card-icon">{c.icon}</div>
							<h3>{c.title}</h3>
							<p className="card-desc">{c.desc}</p>
							<span className="card-cta">Acessar →</span>
						</article>
					))}
				</section>
				}

				{userInfo?.detalhes?.tipo == null &&			
				<section className="dashboard-grid">
					{cardsAdm.map((c) => (
						<article
							key={c.title}
							className="dashboard-card"
							onClick={() => navigate(c.to)}
							role="button"
							tabIndex={0}
							onKeyPress={(e) => {
								if (e.key === 'Enter') navigate(c.to);
							}}
						>
							<div className="card-icon">{c.icon}</div>
							<h3>{c.title}</h3>
							<p className="card-desc">{c.desc}</p>
							<span className="card-cta">Acessar →</span>
						</article>
					))}
				</section>
				}
			</main>
			<Footer />
		</>
	);
};

export default DashboardPage;
