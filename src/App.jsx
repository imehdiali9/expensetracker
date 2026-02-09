import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { useAuth } from "./AuthContext";
import "./App.css";

const COLORS = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#8b5cf6"];

const StatCard = ({ title, value, color, icon, gradient }) => (
  <div className="stat-card group">
    <div className="stat-card-inner">
      <div className="stat-icon" style={{ background: gradient }}>
        {icon}
      </div>
      <div className="stat-content">
        <p className="stat-label">{title}</p>
        <h2 className={`stat-value ${color}`}>{value}</h2>
      </div>
    </div>
  </div>
);

export default function App() {

  const { user, logout } = useAuth();

  /* DARK MODE */

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true; // Default to dark mode
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  /* STATE */

  const [activeTab, setActiveTab] = useState("dashboard");

  const [categories, setCategories] = useState([
    "Food",
    "Transport",
    "Bills",
  ]);

  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});

  const [amount, setAmount] = useState("");
  const [transactionCategory, setTransactionCategory] = useState("Food");
  const [type, setType] = useState("expense");
  const [date, setDate] = useState("");

  const [budgetCategory, setBudgetCategory] = useState("Food");
  const [budgetInput, setBudgetInput] = useState("");

  const [newCategory, setNewCategory] = useState("");

  const [frequentPayments, setFrequentPayments] = useState([]);
  const [paymentName, setPaymentName] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentCategory, setPaymentCategory] = useState("Food");

  /* LOGIC */

  const addTransaction = () => {
    if (!amount) return;

    const newTransaction = {
      id: Date.now(),
      amount: Number(amount),
      category: transactionCategory,
      type,
      date: date || new Date().toISOString().split("T")[0],
    };

    setTransactions(prev => [...prev, newTransaction]);

    setAmount("");
    setDate("");
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addCategory = () => {
    if (!newCategory) return;
    setCategories(prev => [...prev, newCategory]);
    setNewCategory("");
  };

  const setBudget = () => {
    if (!budgetInput) return;

    setBudgets(prev => ({
      ...prev,
      [budgetCategory]: Number(budgetInput),
    }));

    setBudgetInput("");
  };

  const addFrequentPayment = () => {
    if (!paymentName || !paymentAmount) return;

    const payment = {
      id: Date.now(),
      name: paymentName,
      amount: Number(paymentAmount),
      category: paymentCategory,
      type: "expense",
    };

    setFrequentPayments(prev => [...prev, payment]);

    setPaymentName("");
    setPaymentAmount("");
  };

  const useFrequentPayment = (payment) => {
    const transaction = {
      id: Date.now(),
      amount: payment.amount,
      category: payment.category,
      type: payment.type,
      date: new Date().toISOString().split("T")[0],
    };

    setTransactions(prev => [...prev, transaction]);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  /* CALCULATIONS */

  const income = transactions
    .filter(t => t.type === "income")
    .reduce((a, t) => a + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === "expense")
    .reduce((a, t) => a + t.amount, 0);

  const remaining = income - expenses;

  const chartData = categories.map(cat => {
    const spent = transactions
      .filter(t => t.category === cat && t.type === "expense")
      .reduce((a, t) => a + t.amount, 0);

    return {
      name: cat,
      spent,
      budget: budgets[cat] || 0,
    };
  });

  const categoryIcons = {
    Food: "🍕",
    Transport: "🚗",
    Bills: "⚡",
    Entertainment: "🎬",
    Shopping: "🛍️",
    Health: "💊",
  };

  /* UI */

  return (
    <div className="app-container">
      <div className="background-gradient"></div>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">
            <span className="title-icon">💰</span>
            Smart Tracker
          </h1>
        </div>

        <nav className="sidebar-nav">
          {[
            { id: "dashboard", label: "Dashboard", icon: "📊" },
            { id: "add", label: "Add Transaction", icon: "➕" },
            { id: "budgets", label: "Budgets", icon: "🎯" },
            { id: "history", label: "History", icon: "📜" },
            { id: "frequent", label: "Frequent Payments", icon: "🔄" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-button ${activeTab === tab.id ? "active" : ""}`}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {user?.user_metadata?.display_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.user_metadata?.display_name || 'User'}</div>
              <div className="user-email">{user?.email}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="logout-button"
          >
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="theme-toggle"
          >
            <span className="theme-icon">{darkMode ? "☀️" : "🌙"}</span>
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-content">

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="dashboard-container">
            <div className="page-header">
              <h1 className="page-title">Dashboard</h1>
              <p className="page-subtitle">Overview of your financial health</p>
            </div>

            <div className="stats-grid">
              <StatCard 
                title="Total Income" 
                value={`₹${income.toLocaleString()}`} 
                color="text-success"
                icon="💵"
                gradient="linear-gradient(135deg, #10b981 0%, #14b8a6 100%)"
              />
              <StatCard 
                title="Total Expenses" 
                value={`₹${expenses.toLocaleString()}`} 
                color="text-danger"
                icon="💸"
                gradient="linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)"
              />
              <StatCard 
                title="Balance" 
                value={`₹${remaining.toLocaleString()}`} 
                color={remaining >= 0 ? "text-success" : "text-danger"}
                icon={remaining >= 0 ? "✓" : "⚠️"}
                gradient={remaining >= 0 
                  ? "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)"
                  : "linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)"
                }
              />
              <StatCard 
                title="Categories" 
                value={categories.length} 
                color="text-primary"
                icon="📁"
                gradient="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
              />
            </div>

            <div className="chart-container">
              <h2 className="section-title">
                <span className="title-accent"></span>
                Budget vs Spending Analysis
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)"/>
                  <XAxis dataKey="name" stroke="#94a3b8"/>
                  <YAxis stroke="#94a3b8"/>
                  <Tooltip 
                    contentStyle={{
                      background: darkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                      border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(20px)',
                      color: darkMode ? '#ffffff' : '#1a1a1a'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="budget" fill="#6366f1" radius={[8, 8, 0, 0]}/>
                  <Bar dataKey="spent" fill="#ef4444" radius={[8, 8, 0, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Transactions Preview */}
            {transactions.length > 0 && (
              <div className="card">
                <h2 className="section-title">
                  <span className="title-accent"></span>
                  Recent Transactions
                </h2>
                <div className="transactions-preview">
                  {transactions.slice(-5).reverse().map(t => (
                    <div key={t.id} className="transaction-item">
                      <div className="transaction-icon">
                        {categoryIcons[t.category] || "💰"}
                      </div>
                      <div className="transaction-details">
                        <span className="transaction-category">{t.category}</span>
                        <span className="transaction-date">{t.date}</span>
                      </div>
                      <span className={`transaction-amount ${t.type === "income" ? "income" : "expense"}`}>
                        {t.type === "income" ? "+" : "-"}₹{t.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ADD */}
        {activeTab === "add" && (
          <div className="add-container">
            <div className="page-header">
              <h1 className="page-title">Add Transaction</h1>
              <p className="page-subtitle">Record your income or expenses</p>
            </div>

            <div className="form-grid">
              <div className="card form-card">
                <h2 className="card-title">
                  <span className="title-icon">💰</span>
                  New Transaction
                </h2>

                <div className="form-group">
                  <label className="form-label">Amount</label>
                  <input 
                    type="number" 
                    placeholder="Enter amount"
                    className="form-input"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input 
                    type="date"
                    className="form-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={transactionCategory}
                    onChange={e => setTransactionCategory(e.target.value)}
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>
                        {categoryIcons[c] || "📁"} {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Type</label>
                  <div className="type-selector">
                    <button
                      type="button"
                      onClick={() => setType("expense")}
                      className={`type-button ${type === "expense" ? "active expense" : ""}`}
                    >
                      💸 Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => setType("income")}
                      className={`type-button ${type === "income" ? "active income" : ""}`}
                    >
                      💵 Income
                    </button>
                  </div>
                </div>

                <button
                  onClick={addTransaction}
                  className="btn btn-primary"
                >
                  <span>Add Transaction</span>
                  <span className="btn-icon">→</span>
                </button>
              </div>

              <div className="card form-card">
                <h2 className="card-title">
                  <span className="title-icon">📁</span>
                  Create Category
                </h2>

                <div className="form-group">
                  <label className="form-label">Category Name</label>
                  <input
                    placeholder="e.g., Entertainment, Health"
                    className="form-input"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                  />
                </div>

                <button
                  onClick={addCategory}
                  className="btn btn-success"
                >
                  <span>Add Category</span>
                  <span className="btn-icon">+</span>
                </button>

                {categories.length > 0 && (
                  <div className="categories-list">
                    <p className="list-label">Existing Categories</p>
                    <div className="category-badges">
                      {categories.map(c => (
                        <span key={c} className="category-badge">
                          {categoryIcons[c] || "📁"} {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* HISTORY */}
        {activeTab === "history" && (
          <div className="history-container">
            <div className="page-header">
              <h1 className="page-title">Transaction History</h1>
              <p className="page-subtitle">View all your transactions</p>
            </div>

            <div className="card">
              {transactions.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <p className="empty-text">No transactions yet</p>
                  <p className="empty-subtext">Add your first transaction to get started</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="transactions-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      {transactions.slice().reverse().map(t => (
                        <tr key={t.id}>
                          <td className="date-cell">{t.date}</td>
                          <td>
                            <div className="category-cell">
                              <span className="category-icon">
                                {categoryIcons[t.category] || "📁"}
                              </span>
                              {t.category}
                            </div>
                          </td>
                          <td>
                            <span className={`type-badge ${t.type}`}>
                              {t.type === "income" ? "💵" : "💸"} {t.type}
                            </span>
                          </td>
                          <td className={`amount-cell ${t.type}`}>
                            {t.type === "income" ? "+" : "-"}₹{t.amount}
                          </td>
                          <td>
                            <button
                              onClick={() => deleteTransaction(t.id)}
                              className="delete-button"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BUDGETS */}
        {activeTab === "budgets" && (
          <div className="budgets-container">
            <div className="page-header">
              <h1 className="page-title">Budget Management</h1>
              <p className="page-subtitle">Set spending limits for each category</p>
            </div>

            <div className="form-grid" style={{ maxWidth: "800px" }}>
              <div className="card form-card">
                <h2 className="card-title">
                  <span className="title-icon">🎯</span>
                  Set Budget
                </h2>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={budgetCategory}
                    onChange={e => setBudgetCategory(e.target.value)}
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>
                        {categoryIcons[c] || "📁"} {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Budget Amount</label>
                  <input
                    type="number"
                    placeholder="Enter budget limit"
                    className="form-input"
                    value={budgetInput}
                    onChange={e => setBudgetInput(e.target.value)}
                  />
                </div>

                <button
                  onClick={setBudget}
                  className="btn btn-primary"
                >
                  <span>Set Budget</span>
                  <span className="btn-icon">✓</span>
                </button>
              </div>

              <div className="card">
                <h2 className="card-title">
                  <span className="title-icon">📊</span>
                  Current Budgets
                </h2>

                {Object.keys(budgets).length === 0 ? (
                  <div className="empty-state-small">
                    <p>No budgets set yet</p>
                  </div>
                ) : (
                  <div className="budgets-list">
                    {Object.entries(budgets).map(([cat, amount]) => {
                      const spent = transactions
                        .filter(t => t.category === cat && t.type === "expense")
                        .reduce((a, t) => a + t.amount, 0);
                      const percentage = (spent / amount) * 100;

                      return (
                        <div key={cat} className="budget-item">
                          <div className="budget-header">
                            <span className="budget-category">
                              {categoryIcons[cat] || "📁"} {cat}
                            </span>
                            <span className="budget-amount">
                              ₹{spent} / ₹{amount}
                            </span>
                          </div>
                          <div className="budget-bar">
                            <div 
                              className={`budget-progress ${percentage > 100 ? "over" : ""}`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                          </div>
                          <span className={`budget-percentage ${percentage > 100 ? "over" : ""}`}>
                            {percentage.toFixed(0)}% used
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* FREQUENT */}
        {activeTab === "frequent" && (
          <div className="frequent-container">
            <div className="page-header">
              <h1 className="page-title">Frequent Payments</h1>
              <p className="page-subtitle">Save and quickly add recurring expenses</p>
            </div>

            <div className="form-grid" style={{ maxWidth: "800px" }}>
              <div className="card form-card">
                <h2 className="card-title">
                  <span className="title-icon">🔄</span>
                  Add Frequent Payment
                </h2>

                <div className="form-group">
                  <label className="form-label">Payment Name</label>
                  <input
                    placeholder="e.g., Netflix Subscription"
                    value={paymentName}
                    onChange={(e) => setPaymentName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={paymentCategory}
                    onChange={(e) => setPaymentCategory(e.target.value)}
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>
                        {categoryIcons[c] || "📁"} {c}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={addFrequentPayment}
                  className="btn btn-primary"
                >
                  <span>Save Payment</span>
                  <span className="btn-icon">+</span>
                </button>
              </div>

              <div className="card">
                <h2 className="card-title">
                  <span className="title-icon">💾</span>
                  Saved Payments
                </h2>

                {frequentPayments.length === 0 ? (
                  <div className="empty-state-small">
                    <p>No saved payments yet</p>
                  </div>
                ) : (
                  <div className="frequent-list">
                    {frequentPayments.map(p => (
                      <div key={p.id} className="frequent-item">
                        <div className="frequent-icon">
                          {categoryIcons[p.category] || "💰"}
                        </div>
                        <div className="frequent-details">
                          <span className="frequent-name">{p.name}</span>
                          <span className="frequent-meta">
                            {p.category} • ₹{p.amount}
                          </span>
                        </div>
                        <button
                          onClick={() => useFrequentPayment(p)}
                          className="btn-quick-add"
                        >
                          <span>Quick Add</span>
                          <span>→</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}