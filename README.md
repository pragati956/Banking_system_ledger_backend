# 🏦 Banking System Ledger Backend

A backend project built using **Node.js, Express, MongoDB** to simulate a basic banking system with authentication, accounts, transactions, and ledger management.

---

## 🚀 Features

* 🔐 User Registration & Login (JWT Authentication)
* 👤 Protected Routes using Middleware
* 🏦 Account Creation
* 💸 Transaction System (Transfer Money)
* 📒 Ledger Entries (Debit/Credit tracking)
* 📧 Email Notifications (Nodemailer)
* 🔁 Idempotency for safe transactions

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB (Atlas)
* Mongoose
* JWT (Authentication)
* Nodemailer

---

## 📁 Project Structure

```
src/
│
├── controllers/        # API logic
├── models/             # Database schemas
├── routes/             # API routes
├── middleware/         # Auth middleware
├── services/           # Email service
├── config/             # DB connection
└── app.js              # Main app setup

server.js               # Entry point
```

---

## ⚙️ Installation

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file and add:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

## ▶️ Run the Project

```bash
npm run dev
```

Server will run on:

```
http://localhost:3000
```

---

## 📌 API Endpoints

### 🔐 Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### 🏦 Accounts

* `POST /api/accounts`

### 💸 Transactions

* `POST /api/transactions`
* `POST /api/transactions/system/initial-funds`

---

## 🔐 Authentication

Use JWT token in headers:

```
Authorization: Bearer YOUR_TOKEN
```

---

## 📧 Email Setup

* Use **Gmail App Password**
* Enable 2-Step Verification
* Add credentials in `.env`

---

## 🧠 Future Improvements

* Add balance API
* Transaction history
* Admin dashboard
* Rate limiting & security improvements

---

## 👩‍💻 Author

Pragati Singh

---

## ⭐ Notes

This project is built for learning backend development and understanding real-world system design like banking transactions and ledgers.
