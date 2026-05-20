# FoodHub — Sistema Web de Pedidos de Comida

## 1. Descrição do Projecto

O FoodHub é um sistema web para venda e encomenda de comida online. A plataforma permite que clientes consultem restaurantes, visualizem pratos disponíveis, adicionem itens ao carrinho, finalizem pedidos e acompanhem o estado da encomenda.

O sistema também permite que restaurantes façam a gestão dos seus pratos e pedidos, enquanto o administrador controla categorias, utilizadores, restaurantes e aprova o funcionamento dos restaurantes cadastrados.

## 2. Objectivo Geral

Desenvolver uma aplicação web moderna, funcional e responsiva para facilitar a comunicação entre clientes e restaurantes no processo de encomenda de comida online.

## 3. Funcionalidades Principais

### Cliente

- Criar conta e fazer login;
- Visualizar restaurantes aprovados;
- Pesquisar restaurantes;
- Visualizar pratos disponíveis;
- Filtrar pratos por categoria e preço;
- Adicionar pratos ao carrinho;
- Finalizar pedidos;
- Acompanhar pedidos abertos e finalizados.

### Restaurante

- Criar conta do tipo restaurante;
- Cadastrar dados do restaurante;
- Aguardar aprovação do administrador;
- Cadastrar pratos;
- Editar pratos;
- Activar ou pausar pratos;
- Remover pratos;
- Visualizar pedidos recebidos;
- Actualizar estado dos pedidos;
- Separar pedidos abertos e finalizados.

### Administrador

- Visualizar estatísticas gerais;
- Listar utilizadores;
- Activar ou suspender restaurantes;
- Criar categorias de pratos;
- Visualizar pedidos do sistema.

## 4. Tecnologias Utilizadas

### Frontend

- React
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React
- PWA com vite-plugin-pwa

### Backend

- Node.js
- Express.js
- Prisma ORM
- SQLite
- JWT
- Bcrypt
- CORS
- Dotenv

## 5. Estrutura do Projecto

```txt
foodhub/
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── public/
    │   └── icons/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── package.json