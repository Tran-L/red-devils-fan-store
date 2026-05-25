# Red Devils Fan Store

Red Devils Fan Store is a full-stack single-page e-commerce shopping cart application created for Assignment 2 of 31748 Programming on the Internet. The project is a fictional football fan merchandise store where users can browse products, search for items, manage a shopping cart, place orders, and view their order history. Admin users can manage products, users, and orders.

## Project Purpose

The purpose of this website is to provide a streamlined online shopping experience for football supporters. The application demonstrates modern frontend development using React, backend API development using Node.js and Express, database persistence using SQLite, and secure authentication using password hashing and JSON Web Tokens.

## Core Features

- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Role-based access control for users and admins
- Product listing and live search
- Shopping cart management
- Checkout and order creation
- User order history
- Admin product management
- Admin user and order management
- CRUD operations across users, products, carts, and orders

## Tech Stack

Frontend:

- React
- Vite
- React Router
- Axios
- Lucide React

Backend:

- Node.js
- Express
- SQLite
- bcryptjs
- jsonwebtoken
- dotenv
- cors

Tools:

- VS Code
- GitHub
- GitHub Desktop
- DB Browser for SQLite

## How to Run the Backend

```bash
cd server
npm install
npm run init-db
npm run dev