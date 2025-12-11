
# Trust D Process – Sistema de Moeda Estudantil

O **Trust D Process** é um sistema de moeda estudantil desenvolvido para instituições de ensino que desejam incentivar alunos por meio de recompensas, gamificação e economia interna.  
Professores/administradores podem distribuir moedas, criar vantagens e acompanhar o uso; alunos podem receber, visualizar saldo e resgatar recompensas.

https://trustprocess-tawny.vercel.app/

---

## 🚀 Tecnologias Utilizadas

### Backend
- **Python**
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

## 🔐 Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para configurar tanto o **backend (Django)** quanto o **frontend (React + Vite)**.  
Crie um arquivo `.env` em cada parte do projeto conforme os exemplos abaixo:

---

### ✅ Backend (`Codigo/backend/.env`)

```env
# Chave secreta do Django
SECRET_KEY=coloque_sua_chave_aqui

# Ativar/Desativar modo debug
DEBUG=True

# Configuração do banco de dados (PostgreSQL)
DATABASE_URL=postgres://usuario:senha@localhost:5432/nome_do_banco

# Hosts permitidos
ALLOWED_HOSTS=localhost,127.0.0.1
```

> **Dica:** Use `django-environ` ou similar para carregar essas variáveis no `settings.py`.

---

### ✅ Frontend (`Codigo/frontend/.env`)

```env
# URL da API do backend
VITE_API_URL=http://localhost:8000

# Variáveis adicionais do Vite
BROWSER_ARGS=
BROWSER=
DOTENV_KEY=
NODE_DISABLE_COLORS=
VITE_DEBUG_FILTER=
```

> **Importante:** Todas as variáveis do Vite devem começar com `VITE_` para serem acessíveis no código.

---

### ⚠️ Observações
- Nunca versione arquivos `.env` (adicione ao `.gitignore`).
- Crie um arquivo `.env.example` com os nomes das variáveis para facilitar a configuração por outros desenvolvedores.


