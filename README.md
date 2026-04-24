# 💸 Expense Tracker

> A modern, full-featured expense tracking application built with React and powered by Supabase — helping you take control of your finances with clarity and ease.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-brightgreen?style=for-the-badge&logo=vercel)](https://expensetracker-beta-one.vercel.app/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.io/)

---

## ✨ Features

- 📊 **Visual Analytics** — Interactive charts powered by Recharts to visualize spending trends
- 🔐 **Authentication** — Secure user login and registration via Supabase Auth
- 💾 **Cloud Sync** — All data stored and synced in real-time with Supabase
- 📄 **PDF Export** — Export your expense reports as PDF using jsPDF & AutoTable
- 🧭 **Multi-page Navigation** — Smooth routing with React Router DOM
- 📱 **Responsive Design** — Mobile-friendly UI built with Tailwind CSS
- ⚡ **Blazing Fast** — Powered by Vite for instant dev and optimized builds

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------------|--------------------------------------|
| Frontend | React 19, React Router DOM 7 |
| Styling | Tailwind CSS 3 |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Supabase (Auth + Database) |
| PDF Export | jsPDF, jsPDF-AutoTable |
| Build Tool | Vite 5 |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/imehdiali9/expensetracker.git

# Navigate into the project
cd expensetracker

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Running the App

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
expensetracker/
├── src/               # Source files
├── index.html         # Entry HTML
├── vite.config.js     # Vite configuration
├── tailwind.config.js # Tailwind configuration
├── postcss.config.js  # PostCSS configuration
├── vercel.json        # Vercel deployment config
└── package.json       # Project dependencies
```

---

## 🌐 Live Demo

The app is deployed and live at:
**[https://expensetracker-beta-one.vercel.app/](https://expensetracker-beta-one.vercel.app/)**

---

## 👨‍💻 Contributors

A huge thanks to everyone who built this project together! 🙌

| Name | Role |
|------|------|
| **Mehdi** | Developer |
| **Hafiz** | Developer |
| **Joash** | Developer |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ by Mehdi, Hafiz & Joash
</div>
