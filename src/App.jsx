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
import { supabase } from "./supabase";
import "./App.css";

// Minimal SVG Icons
const WalletIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <path d="M2 10h20"/>
    <circle cx="16" cy="14" r="2"/>
  </svg>
);

const IncomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 19V5M5 12l7-7 7 7"/>
  </svg>
);

const ExpenseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M19 12l-7 7-7-7"/>
  </svg>
);

const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);

const TargetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const HistoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3v18h18"/>
    <path d="M7 12l3-3 4 4 5-5"/>
  </svg>
);

const RepeatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 2l4 4-4 4"/>
    <path d="M3 11v-1a4 4 0 0 1 4-4h14"/>
    <path d="M7 22l-4-4 4-4"/>
    <path d="M21 13v1a4 4 0 0 1-4 4H3"/>
  </svg>
);

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const FoodIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
    <line x1="6" y1="1" x2="6" y2="4"/>
    <line x1="10" y1="1" x2="10" y2="4"/>
    <line x1="14" y1="1" x2="14" y2="4"/>
  </svg>
);

const TransportIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13"/>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const BillsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
);

const ShoppingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const EntertainmentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

const HealthIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const COLORS = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#8b5cf6"];

const StatCard = ({ title, value, color, icon, gradient, onClick, clickable }) => (
  <div
    className={`stat-card group ${clickable ? 'stat-card-clickable' : ''}`}
    onClick={onClick}
    style={{ cursor: clickable ? 'pointer' : 'default' }}
  >
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

// ─── Logout Confirmation Modal ────────────────────────
const LogoutModal = ({ onConfirm, onCancel }) => (
  <div className="modal-backdrop" onClick={onCancel}>
    <div className="modal-card" onClick={e => e.stopPropagation()}>
      <div className="modal-icon"><LogoutIcon /></div>
      <div className="modal-title">Sign out?</div>
      <div className="modal-subtitle">You'll need to sign back in to access your financial data.</div>
      <div className="modal-actions">
        <button className="modal-btn-cancel" onClick={onCancel}>Cancel</button>
        <button className="modal-btn-confirm" onClick={onConfirm}>Sign out</button>
      </div>
    </div>
  </div>
);

export default function App() {

  const { user, logout } = useAuth();

  /* SIDEBAR COLLAPSE */
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  /* LOGOUT MODAL */
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  /* DARK MODE */
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true;
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

  /* LOAD DATA FROM SUPABASE */
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const { data: transactionsData, error: transError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (transError) throw transError;
      if (transactionsData) setTransactions(transactionsData);

      const { data: categoriesData, error: catError } = await supabase
        .from('categories')
        .select('name')
        .eq('user_id', user.id);

      if (catError) throw catError;
      if (categoriesData && categoriesData.length > 0) {
        setCategories(categoriesData.map(c => c.name));
      }

      const { data: budgetsData, error: budgetError } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id);

      if (budgetError) throw budgetError;
      if (budgetsData) {
        const budgetsObj = {};
        budgetsData.forEach(b => {
          budgetsObj[b.category] = b.amount;
        });
        setBudgets(budgetsObj);
      }

      const { data: paymentsData, error: payError } = await supabase
        .from('frequent_payments')
        .select('*')
        .eq('user_id', user.id);

      if (payError) throw payError;
      if (paymentsData) setFrequentPayments(paymentsData);

    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

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
  const addTransaction = async () => {
    if (!amount) return;
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          amount: Number(amount),
          category: transactionCategory,
          type: type,
          date: date || new Date().toISOString().split('T')[0]
        }])
        .select();
      if (error) throw error;
      if (data && data[0]) setTransactions(prev => [data[0], ...prev]);
      setAmount("");
      setDate("");
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction');
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction');
    }
  };

  const addCategory = async () => {
    if (!newCategory) return;
    try {
      const { error } = await supabase
        .from('categories')
        .insert([{ user_id: user.id, name: newCategory }]);
      if (error) throw error;
      setCategories(prev => [...prev, newCategory]);
      setNewCategory("");
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category');
    }
  };

  const deleteCategory = async (categoryToDelete) => {
    const hasTransactions = transactions.some(t => t.category === categoryToDelete);
    if (hasTransactions) {
      alert('Cannot delete category with existing transactions');
      return;
    }
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('user_id', user.id)
        .eq('name', categoryToDelete);
      if (error) throw error;
      setCategories(prev => prev.filter(c => c !== categoryToDelete));
      await supabase.from('budgets').delete().eq('user_id', user.id).eq('category', categoryToDelete);
      setBudgets(prev => {
        const newBudgets = { ...prev };
        delete newBudgets[categoryToDelete];
        return newBudgets;
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const setBudget = async () => {
    if (!budgetInput) return;
    try {
      const { data: existing } = await supabase
        .from('budgets')
        .select('id')
        .eq('user_id', user.id)
        .eq('category', budgetCategory)
        .single();
      if (existing) {
        const { error } = await supabase.from('budgets').update({ amount: Number(budgetInput) }).eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('budgets').insert([{ user_id: user.id, category: budgetCategory, amount: Number(budgetInput) }]);
        if (error) throw error;
      }
      setBudgets(prev => ({ ...prev, [budgetCategory]: Number(budgetInput) }));
      setBudgetInput("");
    } catch (error) {
      console.error('Error setting budget:', error);
      alert('Failed to set budget');
    }
  };

  const addFrequentPayment = async () => {
    if (!paymentName || !paymentAmount) return;
    try {
      const { data, error } = await supabase
        .from('frequent_payments')
        .insert([{ user_id: user.id, name: paymentName, amount: Number(paymentAmount), category: paymentCategory, type: 'expense' }])
        .select();
      if (error) throw error;
      if (data && data[0]) setFrequentPayments(prev => [...prev, data[0]]);
      setPaymentName("");
      setPaymentAmount("");
    } catch (error) {
      console.error('Error adding frequent payment:', error);
      alert('Failed to add frequent payment');
    }
  };

  const useFrequentPayment = async (payment) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{ user_id: user.id, amount: payment.amount, category: payment.category, type: payment.type, date: new Date().toISOString().split('T')[0] }])
        .select();
      if (error) throw error;
      if (data && data[0]) setTransactions(prev => [data[0], ...prev]);
    } catch (error) {
      console.error('Error using frequent payment:', error);
      alert('Failed to add transaction');
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
    setShowLogoutModal(false);
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
    return { name: cat, spent, budget: budgets[cat] || 0 };
  });

  const categoryIcons = {
    Food: <FoodIcon />,
    Transport: <TransportIcon />,
    Bills: <BillsIcon />,
    Entertainment: <EntertainmentIcon />,
    Shopping: <ShoppingIcon />,
    Health: <HealthIcon />,
  };

  /* UI */
  return (
    <div className="app-container">

      {/* Logout Modal */}
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

      {/* Credits */}
      <div className="credits">
        Project of Mehdi, Hafiz and Joash
      </div>

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!sidebarCollapsed && (
            <h1 className="sidebar-title">
              <span className="title-icon"><WalletIcon /></span>
              Smart Tracker
            </h1>
          )}
          <button
            className="menu-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <MenuIcon />
          </button>
        </div>

        <nav className="sidebar-nav">
          {[
            { id: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
            { id: "add", label: "Add Transaction", icon: <PlusIcon /> },
            { id: "budgets", label: "Budgets", icon: <TargetIcon /> },
            { id: "history", label: "History", icon: <HistoryIcon /> },
            { id: "frequent", label: "Frequent Payments", icon: <RepeatIcon /> }
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

          <button onClick={handleLogout} className="logout-button">
            <span className="nav-icon"><LogoutIcon /></span>
            <span>Logout</span>
          </button>

          <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle">
            <span className="theme-icon">{darkMode ? <SunIcon /> : <MoonIcon />}</span>
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
              <StatCard title="Total Income" value={`₹${income.toLocaleString()}`} color="text-success" icon={<IncomeIcon />} gradient="linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)" onClick={() => setActiveTab('history')} clickable={true} />
              <StatCard title="Total Expenses" value={`₹${expenses.toLocaleString()}`} color="text-danger" icon={<ExpenseIcon />} gradient="linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)" onClick={() => setActiveTab('history')} clickable={true} />
              <StatCard
                title="Balance"
                value={remaining < 0 ? `-₹${Math.abs(remaining).toLocaleString()}` : `₹${remaining.toLocaleString()}`}
                color={remaining >= 0 ? "text-success" : "text-danger-red"}
                icon={remaining >= 0 ? <IncomeIcon /> : <ExpenseIcon />}
                gradient={remaining >= 0 ? "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)" : "linear-gradient(135deg, #ff0000 0%, #cc0000 100%)"}
              />
            </div>

            {Object.keys(budgets).length > 0 && (
              <div className="card">
                <h2 className="section-title"><span className="title-accent"></span>Budget Progress</h2>
                <div className="budgets-progress-list">
                  {Object.entries(budgets).map(([cat, amount]) => {
                    const spent = transactions.filter(t => t.category === cat && t.type === "expense").reduce((a, t) => a + t.amount, 0);
                    const percentage = (spent / amount) * 100;
                    return (
                      <div key={cat} className="budget-progress-item">
                        <div className="budget-progress-header">
                          <div className="budget-progress-title">
                            <span className="budget-category-name">{cat}</span>
                            <span className="budget-progress-subtitle">{percentage > 100 ? 'Over budget' : percentage > 80 ? 'Almost there' : 'On track'}</span>
                          </div>
                          <div className="budget-progress-amount">
                            <span className="budget-spent">₹{spent.toLocaleString()}</span>
                            <span className="budget-total">/ ₹{amount.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="budget-progress-bar-container">
                          <div className={`budget-progress-bar-fill ${percentage > 100 ? "over" : percentage > 80 ? "warning" : ""}`} style={{ width: `${Math.min(percentage, 100)}%` }}>
                            <span className="budget-progress-percentage">{percentage.toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {transactions.length > 0 && (
              <div className="card">
                <h2 className="section-title"><span className="title-accent"></span>Recent Transactions</h2>
                <div className="transactions-preview">
                  {transactions.slice(0, 5).map(t => (
                    <div key={t.id} className="transaction-item">
                      <div className="transaction-icon">{categoryIcons[t.category] || <WalletIcon />}</div>
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
                <h2 className="card-title"><span className="title-icon"><WalletIcon /></span>New Transaction</h2>
                <div className="form-group">
                  <label className="form-label">Amount</label>
                  <input type="number" placeholder="Enter amount" className="form-input" value={amount} onChange={e => setAmount(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={transactionCategory} onChange={e => setTransactionCategory(e.target.value)}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <div className="type-selector">
                    <button type="button" onClick={() => setType("expense")} className={`type-button ${type === "expense" ? "active expense" : ""}`}><ExpenseIcon /> Expense</button>
                    <button type="button" onClick={() => setType("income")} className={`type-button ${type === "income" ? "active income" : ""}`}><IncomeIcon /> Income</button>
                  </div>
                </div>
                <button onClick={addTransaction} className="btn btn-primary"><span>Add Transaction</span><span className="btn-icon">→</span></button>
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
                  <div className="empty-icon"><HistoryIcon /></div>
                  <p className="empty-text">No transactions yet</p>
                  <p className="empty-subtext">Add your first transaction to get started</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="transactions-table">
                    <thead>
                      <tr><th>Date</th><th>Category</th><th>Type</th><th>Amount</th><th></th></tr>
                    </thead>
                    <tbody>
                      {transactions.map(t => (
                        <tr key={t.id}>
                          <td className="date-cell">{t.date}</td>
                          <td><div className="category-cell"><span className="category-icon">{categoryIcons[t.category] || <WalletIcon />}</span>{t.category}</div></td>
                          <td><span className={`type-badge ${t.type}`}>{t.type === "income" ? <IncomeIcon /> : <ExpenseIcon />} {t.type}</span></td>
                          <td className={`amount-cell ${t.type}`}>{t.type === "income" ? "+" : "-"}₹{t.amount}</td>
                          <td><button onClick={() => deleteTransaction(t.id)} className="delete-button">×</button></td>
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
              <p className="page-subtitle">Set spending limits and manage categories</p>
            </div>
            <div className="budget-layout">
              <div className="card form-card">
                <h2 className="card-title"><span className="title-icon"><PlusIcon /></span>Manage Categories</h2>
                <div className="form-group">
                  <label className="form-label">New Category Name</label>
                  <input placeholder="e.g., Entertainment, Health" className="form-input" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
                </div>
                <button onClick={addCategory} className="btn btn-success"><span>Add Category</span><span className="btn-icon">+</span></button>
                {categories.length > 0 && (
                  <div className="categories-list">
                    <p className="list-label">Existing Categories</p>
                    <div className="category-list-items">
                      {categories.map(c => (
                        <div key={c} className="category-list-item">
                          <span className="category-name">{c}</span>
                          <button onClick={() => deleteCategory(c)} className="category-delete-btn" title="Delete category"><TrashIcon /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="card form-card">
                <h2 className="card-title"><span className="title-icon"><TargetIcon /></span>Set Budget</h2>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={budgetCategory} onChange={e => setBudgetCategory(e.target.value)}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Budget Amount</label>
                  <input type="number" placeholder="Enter budget limit" className="form-input" value={budgetInput} onChange={e => setBudgetInput(e.target.value)} />
                </div>
                <button onClick={setBudget} className="btn btn-primary"><span>Set Budget</span><span className="btn-icon">✓</span></button>
              </div>
            </div>
            <div className="card" style={{ marginTop: '2rem' }}>
              <h2 className="section-title"><span className="title-accent"></span>Budget Overview</h2>
              {Object.keys(budgets).length === 0 ? (
                <div className="empty-state-small"><p>No budgets set yet</p></div>
              ) : (
                <div className="budgets-progress-list">
                  {Object.entries(budgets).map(([cat, amount]) => {
                    const spent = transactions.filter(t => t.category === cat && t.type === "expense").reduce((a, t) => a + t.amount, 0);
                    const percentage = (spent / amount) * 100;
                    return (
                      <div key={cat} className="budget-progress-item">
                        <div className="budget-progress-header">
                          <div className="budget-progress-title">
                            <span className="budget-category-name">{cat}</span>
                            <span className="budget-progress-subtitle">{percentage > 100 ? 'Over budget' : percentage > 80 ? 'Almost there' : 'On track'}</span>
                          </div>
                          <div className="budget-progress-amount">
                            <span className="budget-spent">₹{spent.toLocaleString()}</span>
                            <span className="budget-total">/ ₹{amount.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="budget-progress-bar-container">
                          <div className={`budget-progress-bar-fill ${percentage > 100 ? "over" : percentage > 80 ? "warning" : ""}`} style={{ width: `${Math.min(percentage, 100)}%` }}>
                            <span className="budget-progress-percentage">{percentage.toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
                <h2 className="card-title"><span className="title-icon"><RepeatIcon /></span>Add Frequent Payment</h2>
                <div className="form-group">
                  <label className="form-label">Payment Name</label>
                  <input placeholder="e.g., Netflix Subscription" value={paymentName} onChange={(e) => setPaymentName(e.target.value)} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Amount</label>
                  <input type="number" placeholder="Enter amount" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={paymentCategory} onChange={(e) => setPaymentCategory(e.target.value)}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <button onClick={addFrequentPayment} className="btn btn-primary"><span>Save Payment</span><span className="btn-icon">+</span></button>
              </div>
              <div className="card">
                <h2 className="card-title"><span className="title-icon"><HistoryIcon /></span>Saved Payments</h2>
                {frequentPayments.length === 0 ? (
                  <div className="empty-state-small"><p>No saved payments yet</p></div>
                ) : (
                  <div className="frequent-list">
                    {frequentPayments.map(p => (
                      <div key={p.id} className="frequent-item">
                        <div className="frequent-icon">{categoryIcons[p.category] || <WalletIcon />}</div>
                        <div className="frequent-details">
                          <span className="frequent-name">{p.name}</span>
                          <span className="frequent-meta">{p.category} • ₹{p.amount}</span>
                        </div>
                        <button onClick={() => useFrequentPayment(p)} className="btn-quick-add"><span>Quick Add</span><span>→</span></button>
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