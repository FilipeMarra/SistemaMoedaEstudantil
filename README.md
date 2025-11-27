
# Trust D Process – Sistema de Moeda Estudantil

O **Trust D Process** é um sistema de moeda estudantil desenvolvido para instituições de ensino que desejam incentivar alunos por meio de recompensas, gamificação e economia interna.  
Professores/administradores podem distribuir moedas, criar vantagens e acompanhar o uso; alunos podem receber, visualizar saldo e resgatar recompensas.

---

## 🚀 Tecnologias Utilizadas

### Backend
- **Python 3**
- **Django**
- **Django REST Framework**
- **PostgreSQL**

### Frontend
- **React**
- **Vite**
- **JavaScript / TypeScript**

---

# 🛠️ Como iniciar o projeto

## 📦 Backend (Django)

```bash
cd Codigo/backend
````

Criar ambiente virtual:

```bash
python -m venv .venv
```

Ativar ambiente virtual (Windows PowerShell):

```bash
.\venv\Scripts\Activate.ps1
```

Instalar dependências:

```bash
python -m pip install -r requirements.txt
```

Aplicar migrações:

```bash
python manage.py migrate
```

Iniciar servidor:

```bash
python manage.py runserver
```

---

## 💻 Frontend (React + Vite)

```bash
cd Codigo/frontend
```

Instalar dependências:

```bash
npm install
```

Iniciar servidor de desenvolvimento:

```bash
npm run dev
```

---

## 📚 Descrição Geral do Sistema

O **Trust D Process** funciona como uma economia interna para escolas.
Com ele é possível:

* Distribuir moedas aos alunos
* Registrar transações
* Criar recompensas/benefícios (vantagens)
* Permitir que alunos gastem suas moedas
* Consultar histórico e relatórios

Ele foi pensado para gamificar processos escolares e incentivar comportamentos positivos.

---

## 📂 Estrutura do Projeto

```
SistemaMoedaEstudantil/
│
├── Codigo/
│   ├── backend/      # Django + DRF
│   └── frontend/     # React + Vite
│
└── README.md
```
