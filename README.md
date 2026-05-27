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

### Customer Features

- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected user routes
- Product browsing
- Product detail page
- Live product search
- Category filtering
- Add products to cart
- Update cart item quantities
- Remove cart items
- Clear cart
- Checkout
- Order creation
- Order history
- Order detail page

### Admin Features

- Admin-only dashboard
- Role-based access control
- Add new products
- Edit product details
- Delete/deactivate products
- View all orders
- Update order status
- View all users
- Update user role/status
- Deactivate user accounts

## Tech Stack

Frontend:

- React
- Vite
- React Router
- Axios
- Lucide React

The frontend is built using React and React Router. Page navigation happens through client-side routing without reloading a new HTML page from the server.

Backend:

- Node.js
- Express
- SQLite
- bcryptjs
- jsonwebtoken
- dotenv
- cors

The backend is built using Node.js and Express. Data is stored in SQLite.

Tools:

- VS Code
- GitHub
- GitHub Desktop
- DB Browser for SQLite

## CRUD Operations

The application includes CRUD operations across multiple conceptual entities:

| Entity | Create | Read | Update | Delete |
|---|---|---|---|---|
| Users | Register user | Admin/user profile views | Admin update role/status | Admin deactivate user |
| Products | Admin add product | Product list/detail | Admin edit product | Admin delete/deactivate product |
| Cart Items | Add to cart | View cart | Update quantity | Remove/clear cart |
| Orders | Checkout creates order | User/admin order views | Admin update status | Managed through status changes |

## Authentication and Security

The application includes:

- Password hashing using bcrypt
- JWT token authentication
- Protected routes
- Admin-only route protection
- No real secrets committed to GitHub
- `.env.example` included for setup
- `.env` excluded by `.gitignore`

## Main API Functionality

The backend provides REST API endpoints for:

- Authentication: register, login, and current-user session checking
- Products: product listing, product detail, admin create/update/delete
- Cart: view cart, add item, update quantity, remove item, clear cart
- Orders: checkout, user order history, order details, admin order status updates
- Users: admin user listing, role/status update, and account deactivation

Protected routes use JWT authentication. Admin-only routes also require the logged-in user to have the `admin` role.

## Folder Structure

The project is separated into a `client` folder and a `server` folder.

The `client` folder contains the React frontend. Inside `client/src`, the `pages` folder contains the main screens such as Home, Products, Cart, Checkout, Orders, Login, Register, Account, and Admin Dashboard. The `components` folder contains reusable interface components such as the navigation bar and protected route wrapper. The `context` folder contains the authentication context that stores the logged-in user and JWT token. The `api` folder contains the Axios setup used to connect the frontend to the backend API.

The `server` folder contains the Express backend. The `controllers` folder contains the main business logic for authentication, products, cart, orders, and users. The `routes` folder defines the API endpoints and connects them to the controllers. The `middleware` folder contains JWT authentication and admin role-checking logic. The `database` folder contains the SQLite database file, schema, seed data, and database initialisation script. The `db.js` file connects the backend to SQLite, while `server.js` starts the Express server and registers all API routes.

The root folder contains project-level files such as `README.md`, `workload.md`, and `.gitignore`. The README explains how to run and test the project, while `workload.md` states that the assignment was completed individually.

```text 
red-devils-fan-store/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── AccountPage.jsx
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── OrderDetailPage.jsx
│   │   │   ├── OrderHistoryPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── ProductListPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── database/
│   │   ├── initDatabase.js
│   │   ├── schema.sql
│   │   ├── seed.sql
│   │   └── store.db
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── .env.example
│   ├── db.js
│   ├── package.json
│   └── server.js
│
├── README.md
├── workload.md
└── .gitignore
```

## How to Run the Project

You need to run the backend and frontend in two separate terminals.


## How to Run the Backend

```bash
cd server
npm install
npm run init-db
npm run dev 
```

The backend will run at:

```text
http://localhost:5000
```

To check that the backend is running, open:

```text
http://localhost:5000/api/health
```

Expected response:

```json
{
  "message": "Red Devils Fan Store API is running"
}
```

## How to Run the Frontend
```bash
cd client
npm install
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```


## Test Accounts
The application includes seeded test accounts for marking and demonstration purposes. These accounts are created automatically when running:

```bash
cd server
npm run init-db
```

## Admin account
Email: admin@redstore.com
Password: Admin123!
Role: admin

Admin users can:
- Add, edit, and delete products
- View all orders
- Update order statuses
- View and manage user accounts


## Demo User Account
Email: user@redstore.com
Password: User123!
Role: user

A Normal users can:
- Browse products
- Use live search and category filtering
- Add products to cart
- Update cart quantities
- Checkout
- View their own order history

Unregistered user can only view and browse the website.


## Environment Variables

The project includes an example environment file:

```text
server/.env.example
```

Example values:

```env
PORT=5000
JWT_SECRET=red_devils_fan_store_super_secret_key
DATABASE_PATH=./database/store.db
CLIENT_URL=http://localhost:5173
```

For local development, create:

```text
server/.env
```

The real `.env` file is ignored by Git and should not be committed to GitHub.