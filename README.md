# Finance Data Processing and Access Control Backend

A robust backend REST API for a finance dashboard system. It handles financial records, enforces role-based access control (RBAC), provides analytical dashboard summaries, and manages user accounts.

## Live Demo

https://finance-data-processing-and-access-xc0o.onrender.com

## Postman Documentation

https://documenter.getpostman.com/view/32416134/2sBXiqEUZ3

## Features

- **User Management & Authentication:** Register, login, and manage users. Uses JWT for secure authentication.
- **Role-Based Access Control (RBAC):** Three distinct roles:
  - **Viewer:** Can view dashboard summaries.
  - **Analyst:** Can view transactions and detailed dashboard insights.
  - **Admin:** Full CRUD access over transactions and user management.
- **Financial Records:** Track income and expenses with categories, dates, and amounts.
- **Dashboard Analytics:** Calculates total income, total expenses, net balance, category breakdowns, and monthly trends.
- **Rate Limiting:** Protects endpoints from abuse using `express-rate-limit` (Stricter limits for authentication routes).

## Tech Stack

- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose** (Database and ODM)
- **JWT** (JSON Web Tokens) for authentication
- **Bcrypt.js** (Password Hashing)

## Prerequisites

- Node.js installed (v16+)
- MongoDB connection string (Local or MongoDB Atlas)

## Setup & Installation

1. Clone this repository.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add the following variables:
   ```env
   PORT=4000
   MONGO_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. The API will be available at `http://localhost:4000/api/v1`

## API Endpoints Overview

### Authentication (`/api/v1/auth`)

| Method | Endpoint  | Description                 | Access |
| ------ | --------- | --------------------------- | ------ |
| POST   | `/signup` | Register a new user         | Public |
| POST   | `/login`  | Authenticate user & get JWT | Public |

### Dashboard (`/api/v1/dashboard`)

| Method | Endpoint      | Description                                   | Access                 |
| ------ | ------------- | --------------------------------------------- | ---------------------- |
| GET    | `/summary`    | Get aggregated totals (income, expenses, net) | Viewer, Analyst, Admin |
| GET    | `/recent`     | Fetch most recent transactions                | Analyst, Admin         |
| GET    | `/categories` | Get category-wise breakdown                   | Analyst, Admin         |
| GET    | `/trends`     | Get monthly trends                            | Analyst, Admin         |

### Transactions (`/api/v1/transactions`)

| Method | Endpoint | Description                             | Access         |
| ------ | -------- | --------------------------------------- | -------------- |
| POST   | `/`      | Create a new transaction                | Admin          |
| GET    | `/`      | Get all transactions (supports filters) | Analyst, Admin |
| GET    | `/:id`   | Get single transaction by ID            | Analyst, Admin |
| PUT    | `/:id`   | Update a transaction                    | Admin          |
| DELETE | `/:id`   | Delete a transaction                    | Admin          |

### Users (`/api/v1/users`)

| Method | Endpoint      | Description                         | Access |
| ------ | ------------- | ----------------------------------- | ------ |
| GET    | `/`           | Get all registered users            | Admin  |
| PATCH  | `/:id/role`   | Update accountType (role) of a user | Admin  |
| PATCH  | `/:id/status` | Activate/Deactivate a user          | Admin  |
| DELETE | `/:id`        | Drop a user entirely                | Admin  |

## Security Features

- **Rate Limiting:** `/api/v1/auth` is limited to 20 requests per 15 minutes. General `/api/v1/*` routes are limited to 100 requests per 15 minutes.
- **Passwords:** Hashed using `bcryptjs` before entering the database.
- **Data Integrity:** Mongoose schema validations ensure consistent formatting natively.
