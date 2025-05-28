ChaveOnline - MVP de Gestão de Reservas por Temporada 🏠🔑

Este é um projeto MVP (Minimum Viable Product) de uma aplicação simples para gestão de reservas de aluguel por temporada. Ele permite o cadastro e consulta de apartamentos, contatos (clientes) e reservas.

## 📂 Estrutura de Pastas

O projeto está organizado em duas pastas principais:

* `/rental-api`: Contém o código do backend (API Node.js com Express.js).
* `/rental-frontend`: Contém o código do frontend (aplicação React com Vite).

## ✨ Funcionalidades Implementadas (MVP)

* **Autenticação:** Registro e Login de usuários com JWT (JSON Web Tokens).
* **Apartamentos:**
    * Listagem (usado internamente para popular formulários).
    * Dados iniciais (seed data) para demonstração.
* **Contatos (Clientes):**
    * Listagem (usado internamente para popular formulários).
    * Dados iniciais (seed data) para demonstração.
* **Reservas:**
    * Criação de novas reservas.
    * Listagem de todas as reservas com dados do apartamento e cliente.
    * Busca de reservas por intervalo de datas e cidade.
    * Validação no backend para evitar conflito de datas para o mesmo apartamento.
* **Dashboard:**
    * Total de reservas no último mês (últimos 30 dias).
    * Faturamento por canal no último mês.
    * Lista de cidades com mais reservas.
* **Frontend:**
    * Interface reativa para todas as funcionalidades acima.
    * Rotas protegidas que exigem login.
    * Estilização básica e responsiva para usabilidade.

## 🛠️ Tecnologias Utilizadas

### Backend (`rental-api`)

* **Node.js:** Ambiente de execução JavaScript no servidor.
* **Express.js:** Framework para construção de APIs web.
* **SQLite:** Banco de dados relacional leve, baseado em arquivo.
* **jsonwebtoken (JWT):** Para geração e validação de tokens de autenticação.
* **bcryptjs:** Para hashing de senhas.
* **cors:** Para habilitar Cross-Origin Resource Sharing.
* **date-fns:** Para manipulação de datas.
* **dotenv:** Para gerenciamento de variáveis de ambiente.

### Frontend (`rental-frontend`)

* **React:** Biblioteca JavaScript para construção de interfaces de usuário.
* **Vite:** Ferramenta de build e servidor de desenvolvimento rápido para projetos frontend.
* **React Router DOM:** Para roteamento de páginas no lado do cliente (SPA).
* **Axios:** Cliente HTTP para realizar chamadas à API backend.
* **CSS:** Estilização (principalmente via objetos de estilo JavaScript e `index.css`).

### Banco de Dados

* **SQLite 3**

## 🚀 Instruções para Rodar Localmente (Sem Docker)

Siga os passos abaixo para configurar e rodar a aplicação na sua máquina local.

### Pré-requisitos

* Node.js (versão 18.x ou superior recomendada)
* npm (geralmente vem com o Node.js)
* Git (para clonar o repositório, se aplicável)

### 1. Backend (`rental-api`)

1.  **Navegue até a pasta do backend:**
    ```bash
    cd rental-api
    ```

2.  **Crie o arquivo de variáveis de ambiente:**
    Crie um arquivo chamado `.env` na pasta `rental-api` com o seguinte conteúdo (substitua o valor de `JWT_SECRET` por um segredo forte e único):
    ```env
    PORT=3000
    JWT_SECRET=seu-segredo-super-secreto-e-longo-aqui
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Inicie o servidor backend:**
    ```bash
    npm start
    ```
    O backend deverá estar rodando em `http://localhost:3000`. O banco de dados SQLite (`database/rental.db`) será criado automaticamente na primeira inicialização, junto com as tabelas e dados iniciais (seed data para apartamentos e contatos).

### 2. Frontend (`rental-frontend`)

1.  **Abra um novo terminal** e navegue até a pasta do frontend:
    ```bash
    cd rental-frontend
    ```

2.  **Crie o arquivo de variáveis de ambiente:**
    Crie um arquivo chamado `.env` na pasta `rental-frontend` com o seguinte conteúdo (apontando para o seu backend local):
    ```env
    VITE_API_BASE_URL=http://localhost:3000/api
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Inicie o servidor de desenvolvimento do frontend:**
    ```bash
    npm run dev
    ```
    O frontend deverá estar acessível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

Agora você pode abrir `http://localhost:5173` no seu navegador e usar a aplicação!

## 🧠 Decisões de Arquitetura

* **API Backend Monolítica:** Para este MVP, uma API monolítica com Express.js foi escolhida pela simplicidade de desenvolvimento e configuração. As responsabilidades são separadas em rotas, controllers e serviços (como o `db.js`).
* **Banco de Dados SQLite:** Selecionado por ser leve, file-based (sem necessidade de um servidor de banco de dados separado) e fácil de integrar com Node.js, ideal para um MVP e desenvolvimento local. A inicialização do schema e dos dados de seed ocorre na primeira execução da API para facilitar o setup.
* **Autenticação Stateless com JWT:** JWTs são usados para autenticação, tornando o backend stateless e facilitando a escalabilidade (embora não seja um foco principal do MVP). Os tokens são armazenados no `localStorage` do frontend.
* **Frontend SPA com React:** React foi escolhido por sua popularidade, ecossistema robusto e modelo de componentização, que facilita a criação de UIs interativas. Vite foi usado para um desenvolvimento rápido.
* **Gerenciamento de Estado Global no Frontend:** O `Context API` do React foi usado para gerenciar o estado de autenticação de forma global e simples.
* **Comunicação API RESTful:** O backend expõe uma API seguindo princípios RESTful para a comunicação com o frontend.
* **(Futuro) Dockerização:** A aplicação foi planejada para ser facilmente containerizada com Docker (Dockerfiles e docker-compose foram discutidos), visando padronização de ambiente e facilidade de deploy, embora não implementado nesta etapa.

---
