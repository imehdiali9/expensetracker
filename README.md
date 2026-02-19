💰 Expense Tracker
A modern Expense Tracker web application that helps users manage their income, expenses, categories, and budgets in one place.
Built using React (Vite) and Supabase with secure authentication and database integration.

🚀 Features
🔐 User Authentication

Secure signup & login using Supabase Auth

💸 Expense & Income Tracking

Add, view, and delete transactions

🗂️ Category Management

Create and manage custom expense categories

🎯 Budget Management

Set budgets per category and track progress

📊 Dashboard

Overview of total income, expenses, and balance

🔁 Frequent Payments

Save recurring expenses for quick entry

🌙 Dark / Light Mode

🔒 Row Level Security (RLS)

Each user can only access their own data

🛠️ Tech Stack
Frontend
React (Vite)

JavaScript

Tailwind CSS

Recharts (for charts)

Backend
Supabase

Supabase Auth (Authentication)

Supabase Postgres Database

Row Level Security (RLS)

🗃️ Database Structure (Supabase)
auth.users – managed by Supabase Auth

category

category_id

user_id

category_name

transactions

trans_id

user_id

amt

t_date

type

category_id

budget

budget_id

user_id

category_id

amount

month

year

⚙️ Setup & Installation
1️⃣ Clone the repository
git clone https://github.com/your-repo/expense-tracker.git
cd expense-tracker
2️⃣ Install dependencies
npm install
3️⃣ Environment variables
Create a .env file in the root directory:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
4️⃣ Run the project
npm run dev
Open: http://localhost:5173

🔐 Security
Passwords are never stored manually

Supabase Auth handles authentication securely

Row Level Security (RLS) ensures user data isolation

📌 Project Purpose
This project was developed as a DBMS / Web Development mini project, demonstrating:

Database design

Authentication

Secure CRUD operations

Frontend–backend integration

👨‍💻 Credits
This project was developed by:

Mehdi Ali

Joash

Hafiz Hussain

📄 License
This project is for educational purposes.
