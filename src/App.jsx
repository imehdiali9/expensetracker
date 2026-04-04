import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const Icon = ({ name, filled, className = "" }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
  >
    {name}
  </span>
);

export default function App() {
  const { user, logout } = useAuth();

  /* DARK MODE */
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : false;
  });

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    document.body.classList.toggle("light", !darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  /* STATE */
  const [activeTab, setActiveTab] = useState("dashboard");
  const [categories, setCategories] = useState(["Food", "Transport", "Bills"]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});

  const [amount, setAmount] = useState("");
  const [transactionCategory, setTransactionCategory] = useState("Food");
  const [type, setType] = useState("expense");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

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
      description: description || transactionCategory,
    };
    setTransactions((prev) => [...prev, newTransaction]);
    setAmount("");
    setDate("");
    setDescription("");
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addCategory = () => {
    if (!newCategory || categories.includes(newCategory)) return;
    setCategories((prev) => [...prev, newCategory]);
    setNewCategory("");
  };

  const setBudget = () => {
    if (!budgetInput) return;
    setBudgets((prev) => ({ ...prev, [budgetCategory]: Number(budgetInput) }));
    setBudgetInput("");
  };

  const addFrequentPayment = () => {
    if (!paymentName || !paymentAmount) return;
    setFrequentPayments((prev) => [
      ...prev,
      { id: Date.now(), name: paymentName, amount: Number(paymentAmount), category: paymentCategory, type: "expense" },
    ]);
    setPaymentName("");
    setPaymentAmount("");
  };

  const handleFrequentPayment = (payment) => {
    setTransactions((prev) => [
      ...prev,
      { id: Date.now(), amount: payment.amount, category: payment.category, type: payment.type, date: new Date().toISOString().split("T")[0], description: payment.name },
    ]);
  };

  const handleLogout = async () => {
    try { await logout(); } catch (e) { console.warn("Logout:", e.message || e); }
  };

  /* CALCULATIONS */
  const income = transactions.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0);
  const remaining = income - expenses;
  const totalBudget = Object.values(budgets).reduce((a, b) => a + b, 0);
  const budgetUsed = totalBudget > 0 ? Math.round((expenses / totalBudget) * 100) : 0;

  const categoryIcons = {
    Food: "restaurant", Transport: "commute", Bills: "bolt",
    Entertainment: "movie", Shopping: "shopping_bag", Health: "medical_services",
    Travel: "flight", Housing: "home",
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "grid_view" },
    { id: "add", label: "Add Expense", icon: "add_circle" },
    { id: "history", label: "History", icon: "receipt_long" },
    { id: "budgets", label: "Budgets", icon: "account_balance_wallet" },
    { id: "frequent", label: "Quick Pay", icon: "bolt" },
    { id: "profile", label: "Profile", icon: "person" },
  ];

  const displayName = user?.user_metadata?.display_name || "User";
  const userEmail = user?.email || "";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  /* DARK MODE CLASSES */
  const dm = darkMode;
  const bg = dm ? "bg-[#060e20]" : "bg-[#f7f9ff]";
  const sidebarBg = dm ? "bg-[#091328]" : "bg-white";
  const cardBg = dm ? "bg-[#0f1930]" : "bg-white";
  const cardBg2 = dm ? "bg-[#141f38]" : "bg-slate-50";
  const inputBg = dm ? "bg-[#192540]" : "bg-surface-container-low";
  const textPrimary = dm ? "text-[#dee5ff]" : "text-on-surface";
  const textSecondary = dm ? "text-[#a3aac4]" : "text-on-surface-variant";
  const textMuted = dm ? "text-[#6d758c]" : "text-slate-400";
  const borderColor = dm ? "border-[#40485d]/15" : "border-slate-100";
  const headerBg = dm ? "bg-[#060e20]/60" : "bg-white/80";
  const hoverBg = dm ? "hover:bg-[#192540]" : "hover:bg-slate-50";
  const activeNavBg = dm ? "bg-[#69f6b8]/10" : "bg-primary/5";
  const activeNavText = dm ? "text-[#69f6b8]" : "text-primary";
  const activeNavBorder = dm ? "border-[#69f6b8]" : "border-primary";
  const greenAccent = dm ? "text-[#69f6b8]" : "text-primary";
  const primaryBtnBg = "bg-gradient-to-r from-primary to-primary-container";

  return (
    <div className={`flex min-h-screen ${bg} font-body text-sm`}>
      {/* SIDEBAR */}
      <aside className={`hidden md:flex flex-col sticky top-0 h-screen w-64 ${sidebarBg} ${borderColor} border-r z-50`}>
        <div className="px-6 py-8">
          <h1 className={`text-xl font-bold font-headline tracking-tight ${greenAccent}`}>The Ledger</h1>
          <p className={`text-xs mt-1 ${textMuted}`}>Wealth Architecture</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                activeTab === tab.id
                  ? `${activeNavText} font-bold border-r-4 ${activeNavBorder} ${activeNavBg}`
                  : `${textSecondary} ${hoverBg} hover:${textPrimary}`
              }`}
            >
              <Icon name={tab.icon} filled={activeTab === tab.id} className="text-xl" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Profile Section */}
        <div className="mt-auto px-4 pb-6 space-y-3">
          <button onClick={() => setActiveTab("profile")} className={`w-full flex items-center gap-3 p-3 rounded-xl ${activeTab === "profile" ? activeNavBg + " ring-1 ring-primary/30" : cardBg2} ${borderColor} border hover:ring-1 hover:ring-primary/20 transition-all cursor-pointer text-left`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {avatarLetter}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`font-bold text-sm truncate ${textPrimary}`}>{displayName}</p>
              <p className={`text-xs truncate ${textMuted}`}>{userEmail}</p>
            </div>
            <Icon name="chevron_right" className={`text-lg ${textMuted} flex-shrink-0`} />
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50">
        <header className={`flex items-center justify-between px-4 py-3 ${headerBg} backdrop-blur-xl ${borderColor} border-b`}>
          <h1 className={`text-lg font-bold font-headline ${greenAccent}`}>The Ledger</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-full ${textSecondary}`}>
              <Icon name={darkMode ? "light_mode" : "dark_mode"} className="text-xl" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white font-bold text-xs">
              {avatarLetter}
            </div>
          </div>
        </header>
        <nav className={`flex overflow-x-auto gap-1 px-2 py-2 ${sidebarBg} ${borderColor} border-b hide-scrollbar`}>
          {navItems.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-xs font-medium transition-all ${
                activeTab === tab.id ? `${primaryBtnBg} text-white` : `${textSecondary}`
              }`}>
              <Icon name={tab.icon} className="text-base" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header (Desktop) */}
        <header className={`hidden md:flex justify-between items-center w-full px-8 lg:px-12 py-4 sticky top-0 z-40 ${headerBg} backdrop-blur-xl shadow-sm`}>
          <div className="relative w-full max-w-sm">
            <Icon name="search" className={`absolute left-4 top-1/2 -translate-y-1/2 ${textMuted} text-lg`} />
            <input className={`w-full pl-11 pr-4 py-2.5 ${inputBg} border-none rounded-full focus:ring-2 focus:ring-primary/20 text-sm placeholder:${textMuted} ${textPrimary}`} placeholder="Search transactions..." type="text" />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 ${textSecondary} hover:${textPrimary} transition-colors`}>
              <Icon name={darkMode ? "light_mode" : "dark_mode"} />
            </button>
            <button className={`p-2 ${textSecondary} hover:${textPrimary} transition-colors`}>
              <Icon name="notifications" />
            </button>
          </div>
        </header>

        <div className="px-4 md:px-8 lg:px-12 py-6 md:py-8 pt-32 md:pt-8 max-w-[1400px] w-full mx-auto space-y-8 md:space-y-12">

          {/* ===================== DASHBOARD ===================== */}
          {activeTab === "dashboard" && (
            <>
              {/* Hero Header */}
              <section className="flex flex-col md:flex-row justify-between md:items-end gap-4 md:gap-8">
                <div className="space-y-1">
                  <span className={`${greenAccent} font-bold tracking-wider text-xs uppercase`}>Monthly Overview</span>
                  <h2 className={`text-3xl md:text-5xl font-headline font-extrabold ${textPrimary} tracking-tight`}>Financial Architecture</h2>
                </div>
                <div className="md:text-right">
                  <p className={`${textSecondary} text-sm font-medium mb-1`}>Remaining Liquidity</p>
                  <p className={`text-4xl md:text-6xl font-headline font-extrabold ${remaining >= 0 ? greenAccent : "text-error"} tracking-tight`}>
                    ₹{Math.abs(remaining).toLocaleString()}
                  </p>
                </div>
              </section>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                {/* Expense Analytics */}
                <div className={`md:col-span-8 ${cardBg} rounded-3xl p-6 md:p-8 ${borderColor} border shadow-sm flex flex-col justify-between min-h-[300px] md:min-h-[400px]`}>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className={`font-headline text-xl md:text-2xl font-bold ${textPrimary}`}>Expense Analytics</h3>
                      <p className={`${textSecondary} text-sm mt-1`}>Flow tracking by category</p>
                    </div>
                    <span className="px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
                      {categories.length} Categories
                    </span>
                  </div>
                  <div className="flex-1 flex items-end gap-3 md:gap-6 px-2 md:px-4">
                    {categories.map((cat) => {
                      const spent = transactions.filter((t) => t.category === cat && t.type === "expense").reduce((a, t) => a + t.amount, 0);
                      const budget = budgets[cat] || 0;
                      const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : (spent > 0 ? 50 : 0);
                      return (
                        <div key={cat} className="flex-1 flex flex-col items-center gap-3">
                          <div className={`w-full ${dm ? "bg-[#192540]" : "bg-slate-50"} rounded-xl relative h-32 md:h-48 group overflow-hidden`}>
                            {budget > 0 && <div className="absolute bottom-0 w-full bg-primary/10 rounded-xl" style={{ height: "100%" }} />}
                            <div className={`absolute bottom-0 w-full ${spent > budget && budget > 0 ? "bg-error" : "bg-primary"} rounded-xl transition-all duration-500`}
                              style={{ height: `${pct}%` }} />
                          </div>
                          <span className={`text-[10px] font-bold ${textMuted} uppercase tracking-widest`}>{cat}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Budget & Insights */}
                <div className="md:col-span-4 space-y-6 md:space-y-8">
                  <div className={`${dm ? "bg-[#69f6b8]" : "bg-[#006B37]"} text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden group`}>
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-2">Total Monthly Budget</p>
                    <p className={`text-3xl md:text-4xl font-headline font-extrabold mb-6 ${dm ? "text-[#005027]" : "text-white"}`}>
                      ₹{totalBudget.toLocaleString()}
                    </p>
                    <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden mb-3">
                      <div className={`${dm ? "bg-[#005027]" : "bg-white"} h-full rounded-full`} style={{ width: `${Math.min(budgetUsed, 100)}%` }} />
                    </div>
                    <p className={`text-xs font-medium ${dm ? "text-[#005027]/80" : "text-white/80"}`}>{budgetUsed}% of budget utilized</p>
                  </div>

                  <div className={`${cardBg2} rounded-3xl p-6 md:p-8 ${borderColor} border`}>
                    <h4 className={`font-bold text-sm ${textPrimary} mb-4 uppercase tracking-wider`}>Quick Stats</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0">
                          <Icon name="trending_up" className="text-lg text-primary" />
                        </div>
                        <p className={`text-xs ${textSecondary} font-medium`}>Income: <span className="text-primary font-bold">₹{income.toLocaleString()}</span></p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center flex-shrink-0">
                          <Icon name="trending_down" className="text-lg text-error" />
                        </div>
                        <p className={`text-xs ${textSecondary} font-medium`}>Expenses: <span className="text-error font-bold">₹{expenses.toLocaleString()}</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="md:col-span-12 mt-2 md:mt-4">
                  <div className="flex justify-between items-center mb-6 md:mb-8">
                    <h3 className={`font-headline text-2xl md:text-3xl font-bold ${textPrimary}`}>Recent Transactions</h3>
                    {transactions.length > 3 && (
                      <button onClick={() => setActiveTab("history")} className="text-primary text-sm font-bold flex items-center gap-1.5 hover:translate-x-1 transition-transform group">
                        View All <Icon name="arrow_right_alt" className="text-lg group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                  {transactions.length === 0 ? (
                    <div className={`${cardBg} rounded-3xl p-12 ${borderColor} border text-center`}>
                      <Icon name="receipt_long" className={`text-6xl ${textMuted} mb-4`} />
                      <p className={`font-bold text-lg ${textSecondary}`}>No transactions yet</p>
                      <p className={`text-sm ${textMuted} mt-1`}>Add your first transaction to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-3 md:space-y-4">
                      {transactions.slice(-4).reverse().map((t) => (
                        <div key={t.id} className={`${cardBg} p-4 md:p-6 rounded-2xl md:rounded-[2rem] ${borderColor} border flex items-center justify-between ${hoverBg} hover:shadow-lg transition-all cursor-pointer group`}>
                          <div className="flex items-center gap-4 md:gap-6 min-w-0">
                            <div className={`w-12 h-12 md:w-14 md:h-14 ${t.type === "income" ? "bg-primary/10" : dm ? "bg-[#192540]" : "bg-[#EAF5F0]"} rounded-2xl flex items-center justify-center ${greenAccent} group-hover:scale-110 transition-transform flex-shrink-0`}>
                              <Icon name={categoryIcons[t.category] || "payments"} className="text-xl md:text-2xl" />
                            </div>
                            <div className="min-w-0">
                              <p className={`font-bold ${textPrimary} text-base md:text-lg truncate`}>{t.description || t.category}</p>
                              <p className={`text-xs md:text-sm ${textMuted} truncate`}>{t.category} • {t.date}</p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <p className={`font-extrabold text-lg md:text-xl ${t.type === "income" ? greenAccent : textPrimary}`}>
                              {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ===================== ADD EXPENSE ===================== */}
          {activeTab === "add" && (
            <>
              <section>
                <h2 className={`text-3xl md:text-4xl font-headline font-extrabold ${textPrimary} tracking-tight`}>Add Expense</h2>
                <p className={`${textSecondary} font-medium mt-1`}>Architecture your wealth, one entry at a time.</p>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className={`lg:col-span-2 ${cardBg} rounded-xl p-6 md:p-8 ${borderColor} border shadow-sm`}>
                  {/* Amount */}
                  <div className="mb-8 md:mb-12">
                    <label className={`block text-xs font-bold uppercase tracking-widest ${textSecondary} mb-4`}>Transaction Amount</label>
                    <div className={`flex items-baseline gap-2 border-b-2 ${dm ? "border-[#192540]" : "border-surface-container"} py-2 focus-within:border-primary transition-all`}>
                      <span className={`font-headline text-3xl md:text-4xl font-bold ${textMuted}`}>₹</span>
                      <input className={`w-full border-none bg-transparent font-headline text-4xl md:text-6xl font-extrabold ${textPrimary} focus:ring-0 placeholder:${textMuted} p-0`}
                        placeholder="0.00" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </div>
                  </div>

                  {/* Type Selection */}
                  <div className="mb-8">
                    <label className={`block text-sm font-semibold ${textSecondary} mb-3`}>Type</label>
                    <div className="flex gap-3">
                      <button onClick={() => setType("expense")}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${type === "expense" ? "bg-error text-white" : `${inputBg} ${textSecondary}`}`}>
                        Expense
                      </button>
                      <button onClick={() => setType("income")}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${type === "income" ? "bg-primary text-white" : `${inputBg} ${textSecondary}`}`}>
                        Income
                      </button>
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div className="mb-8">
                    <label className={`block text-sm font-semibold ${textSecondary} mb-3`}>Category</label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {categories.map((cat) => (
                        <button key={cat} onClick={() => setTransactionCategory(cat)}
                          className={`flex flex-col items-center justify-center p-3 md:p-4 rounded-xl transition-all ${
                            transactionCategory === cat
                              ? "bg-primary-container text-on-primary-container ring-2 ring-primary"
                              : `${inputBg} ${textSecondary} ${hoverBg}`
                          }`}>
                          <Icon name={categoryIcons[cat] || "category"} className="mb-1 md:mb-2" />
                          <span className="text-xs font-bold">{cat}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date & Description */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
                    <div className="md:col-span-1">
                      <label className={`block text-sm font-semibold ${textSecondary} mb-2`}>Date</label>
                      <input className={`w-full ${inputBg} border-none rounded-lg py-3 px-4 text-sm ${textPrimary} focus:ring-2 focus:ring-primary/20`}
                        type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-semibold ${textSecondary} mb-2`}>Description</label>
                      <input className={`w-full ${inputBg} border-none rounded-lg py-3 px-4 text-sm ${textPrimary} focus:ring-2 focus:ring-primary/20`}
                        placeholder="What was this for?" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                  </div>

                  <button onClick={addTransaction}
                    className={`w-full ${primaryBtnBg} text-on-primary font-headline font-bold py-4 rounded-full shadow-lg hover:opacity-90 active:scale-95 transition-all`}>
                    Save Transaction
                  </button>
                </div>

                {/* New Category */}
                <div className="space-y-6">
                  <div className={`${cardBg} rounded-xl p-6 ${borderColor} border`}>
                    <h4 className={`font-headline font-bold ${textPrimary} mb-4`}>New Category</h4>
                    <input className={`w-full ${inputBg} border-none rounded-lg py-3 px-4 text-sm ${textPrimary} focus:ring-2 focus:ring-primary/20 mb-4`}
                      placeholder="e.g., Entertainment" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                    <button onClick={addCategory}
                      className="w-full bg-secondary-container text-on-secondary-container font-bold py-3 rounded-full hover:opacity-90 active:scale-95 transition-all">
                      Add Category
                    </button>
                  </div>
                  {categories.length > 0 && (
                    <div className={`${cardBg2} rounded-xl p-6 ${borderColor} border`}>
                      <h4 className={`font-bold text-sm ${textPrimary} mb-3`}>All Categories</h4>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((c) => (
                          <span key={c} className="px-3 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ===================== HISTORY ===================== */}
          {activeTab === "history" && (
            <>
              <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
                <div className="space-y-2">
                  <h2 className={`text-3xl md:text-4xl font-extrabold font-headline tracking-tight ${textPrimary}`}>Transaction History</h2>
                  <p className={`${textSecondary} text-base md:text-lg`}>A meticulous log of your financial architecture.</p>
                </div>
              </section>

              {transactions.length === 0 ? (
                <div className={`${cardBg} rounded-3xl p-12 ${borderColor} border text-center`}>
                  <Icon name="receipt_long" className={`text-6xl ${textMuted} mb-4`} />
                  <p className={`font-bold text-lg ${textSecondary}`}>No transactions yet</p>
                  <p className={`text-sm ${textMuted} mt-1`}>Add your first transaction to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.slice().reverse().map((t) => (
                    <div key={t.id} className={`${cardBg} p-4 md:p-5 rounded-xl flex items-center justify-between ${hoverBg} hover:shadow-md transition-all group ${borderColor} border border-l-4 border-l-transparent hover:border-l-primary`}>
                      <div className="flex items-center gap-4 md:gap-5 min-w-0 flex-1">
                        <div className={`w-10 h-10 md:w-12 md:h-12 ${dm ? "bg-[#192540]" : "bg-surface-container"} rounded-lg flex items-center justify-center ${greenAccent} group-hover:scale-110 transition-transform flex-shrink-0`}>
                          <Icon name={categoryIcons[t.category] || "payments"} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`font-bold ${textPrimary} truncate`}>{t.description || t.category}</p>
                          <p className={`text-xs ${textMuted}`}>{t.category} • {t.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 md:gap-4 flex-shrink-0 ml-4">
                        <span className={`text-base md:text-lg font-bold font-headline ${t.type === "income" ? greenAccent : textPrimary}`}>
                          {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
                        </span>
                        <button onClick={() => deleteTransaction(t.id)}
                          className="p-1.5 rounded-full text-error/50 hover:text-error hover:bg-error/10 transition-all opacity-0 group-hover:opacity-100">
                          <Icon name="delete" className="text-lg" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ===================== BUDGETS ===================== */}
          {activeTab === "budgets" && (
            <>
              <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
                <div>
                  <h2 className={`text-3xl md:text-4xl font-headline font-extrabold tracking-tight ${textPrimary}`}>Budgets & Analytics</h2>
                  <p className={`${textSecondary} font-medium text-base md:text-lg mt-1`}>
                    Managing ₹{totalBudget.toLocaleString()} monthly liquidity across {Object.keys(budgets).length} categories.
                  </p>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                {/* Set Budget Form */}
                <div className={`lg:col-span-5 ${cardBg} rounded-xl p-6 md:p-8 ${borderColor} border shadow-sm`}>
                  <h3 className={`font-headline text-xl font-bold ${textPrimary} mb-6`}>Set Budget</h3>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-semibold ${textSecondary} mb-2`}>Category</label>
                      <select className={`w-full ${inputBg} border-none rounded-lg py-3 px-4 text-sm ${textPrimary} focus:ring-2 focus:ring-primary/20`}
                        value={budgetCategory} onChange={(e) => setBudgetCategory(e.target.value)}>
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold ${textSecondary} mb-2`}>Budget Amount</label>
                      <input className={`w-full ${inputBg} border-none rounded-lg py-3 px-4 text-sm ${textPrimary} focus:ring-2 focus:ring-primary/20`}
                        type="number" placeholder="Enter budget limit" value={budgetInput} onChange={(e) => setBudgetInput(e.target.value)} />
                    </div>
                    <button onClick={setBudget}
                      className={`w-full ${primaryBtnBg} text-on-primary font-bold py-3 rounded-full active:scale-95 transition-all shadow-md`}>
                      Set Budget
                    </button>
                  </div>
                </div>

                {/* Category Budgets */}
                <div className="lg:col-span-7 space-y-4 md:space-y-6">
                  <h3 className={`font-headline text-xl md:text-2xl font-bold ${textPrimary}`}>Category Distribution</h3>
                  {Object.keys(budgets).length === 0 ? (
                    <div className={`${cardBg2} rounded-xl p-8 text-center ${borderColor} border`}>
                      <p className={`${textMuted}`}>No budgets set yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {Object.entries(budgets).map(([cat, amt]) => {
                        const spent = transactions.filter((t) => t.category === cat && t.type === "expense").reduce((a, t) => a + t.amount, 0);
                        const pct = Math.round((spent / amt) * 100);
                        const isOver = pct > 85;
                        return (
                          <div key={cat} className={`${cardBg} p-5 md:p-6 rounded-xl ${borderColor} border`}>
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 ${dm ? "bg-[#192540]" : "bg-surface-container"} rounded-lg`}>
                                  <Icon name={categoryIcons[cat] || "category"} className={greenAccent} />
                                </div>
                                <div className="font-bold">{cat}</div>
                              </div>
                              <span className={`text-xs font-black ${isOver ? "text-tertiary" : textMuted}`}>{pct}% USED</span>
                            </div>
                            <div className={`relative h-2 w-full ${dm ? "bg-[#192540]" : "bg-surface-container"} rounded-full overflow-hidden mb-3`}>
                              <div className={`absolute top-0 left-0 h-full ${isOver ? "bg-tertiary-container" : "bg-primary-container"} rounded-full`}
                                style={{ width: `${Math.min(pct, 100)}%` }} />
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className={`font-medium ${textSecondary}`}>₹{spent.toLocaleString()} spent</span>
                              <span className={`font-bold ${textPrimary}`}>of ₹{amt.toLocaleString()}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ===================== FREQUENT PAYMENTS ===================== */}
          {activeTab === "frequent" && (
            <>
              <section>
                <h2 className={`text-3xl md:text-4xl font-headline font-extrabold ${textPrimary} tracking-tight`}>Quick Payments</h2>
                <p className={`${textSecondary} font-medium mt-1 text-base md:text-lg`}>Save and quickly add recurring expenses.</p>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <div className={`${cardBg} rounded-xl p-6 md:p-8 ${borderColor} border shadow-sm`}>
                  <h3 className={`font-headline text-xl font-bold ${textPrimary} mb-6`}>Add Quick Payment</h3>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-semibold ${textSecondary} mb-2`}>Name</label>
                      <input className={`w-full ${inputBg} border-none rounded-lg py-3 px-4 text-sm ${textPrimary} focus:ring-2 focus:ring-primary/20`}
                        placeholder="e.g., Netflix Subscription" value={paymentName} onChange={(e) => setPaymentName(e.target.value)} />
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold ${textSecondary} mb-2`}>Amount</label>
                      <input className={`w-full ${inputBg} border-none rounded-lg py-3 px-4 text-sm ${textPrimary} focus:ring-2 focus:ring-primary/20`}
                        type="number" placeholder="Enter amount" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold ${textSecondary} mb-2`}>Category</label>
                      <select className={`w-full ${inputBg} border-none rounded-lg py-3 px-4 text-sm ${textPrimary} focus:ring-2 focus:ring-primary/20`}
                        value={paymentCategory} onChange={(e) => setPaymentCategory(e.target.value)}>
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <button onClick={addFrequentPayment}
                      className={`w-full ${primaryBtnBg} text-on-primary font-bold py-3 rounded-full active:scale-95 transition-all shadow-md`}>
                      Save Payment
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className={`font-headline text-xl font-bold ${textPrimary} mb-6`}>Saved Payments</h3>
                  {frequentPayments.length === 0 ? (
                    <div className={`${cardBg2} rounded-xl p-8 text-center ${borderColor} border`}>
                      <Icon name="bolt" className={`text-4xl ${textMuted} mb-2`} />
                      <p className={`${textMuted}`}>No saved payments yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {frequentPayments.map((p) => (
                        <div key={p.id} className={`${cardBg} p-5 rounded-xl ${borderColor} border flex items-center justify-between ${hoverBg} transition-all`}>
                          <div className="flex items-center gap-4 min-w-0">
                            <div className={`w-12 h-12 ${dm ? "bg-[#192540]" : "bg-[#EAF5F0]"} rounded-2xl flex items-center justify-center ${greenAccent} flex-shrink-0`}>
                              <Icon name={categoryIcons[p.category] || "payments"} />
                            </div>
                            <div className="min-w-0">
                              <p className={`font-bold ${textPrimary} truncate`}>{p.name}</p>
                              <p className={`text-xs ${textMuted}`}>{p.category} • ₹{p.amount}</p>
                            </div>
                          </div>
                          <button onClick={() => handleFrequentPayment(p)}
                            className="bg-primary text-on-primary px-4 py-2 rounded-full text-xs font-bold hover:opacity-90 active:scale-95 transition-all flex-shrink-0 ml-4">
                            Quick Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ===================== PROFILE ===================== */}
          {activeTab === "profile" && (
            <>
              <section>
                <h2 className={`text-3xl md:text-4xl font-headline font-extrabold ${textPrimary} tracking-tight`}>Profile</h2>
                <p className={`${textSecondary} font-medium mt-1 text-base md:text-lg`}>Manage your account and preferences.</p>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Profile Card */}
                <div className={`lg:col-span-1 ${cardBg} rounded-2xl p-6 md:p-8 ${borderColor} border shadow-sm flex flex-col items-center text-center`}>
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white font-bold text-4xl font-headline mb-6 shadow-lg shadow-primary/20">
                    {avatarLetter}
                  </div>
                  <h3 className={`font-headline text-xl font-bold ${textPrimary} mb-1`}>{displayName}</h3>
                  <p className={`text-sm ${textMuted} mb-6`}>{userEmail}</p>
                  <div className="w-full space-y-3">
                    <div className={`flex items-center justify-between p-3 rounded-xl ${cardBg2} ${borderColor} border`}>
                      <div className="flex items-center gap-3">
                        <Icon name="calendar_today" className={`${textSecondary}`} />
                        <span className={`text-sm ${textSecondary}`}>Member since</span>
                      </div>
                      <span className={`text-sm font-bold ${textPrimary}`}>{user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}</span>
                    </div>
                    <div className={`flex items-center justify-between p-3 rounded-xl ${cardBg2} ${borderColor} border`}>
                      <div className="flex items-center gap-3">
                        <Icon name="receipt_long" className={`${textSecondary}`} />
                        <span className={`text-sm ${textSecondary}`}>Transactions</span>
                      </div>
                      <span className={`text-sm font-bold ${textPrimary}`}>{transactions.length}</span>
                    </div>
                    <div className={`flex items-center justify-between p-3 rounded-xl ${cardBg2} ${borderColor} border`}>
                      <div className="flex items-center gap-3">
                        <Icon name="category" className={`${textSecondary}`} />
                        <span className={`text-sm ${textSecondary}`}>Categories</span>
                      </div>
                      <span className={`text-sm font-bold ${textPrimary}`}>{categories.length}</span>
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Appearance */}
                  <div className={`${cardBg} rounded-2xl p-6 md:p-8 ${borderColor} border shadow-sm`}>
                    <h4 className={`font-headline text-lg font-bold ${textPrimary} mb-6 flex items-center gap-3`}>
                      <Icon name="palette" className={greenAccent} />
                      Appearance
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button onClick={() => setDarkMode(false)}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                          !darkMode ? 'border-primary bg-primary/5' : `${borderColor} border ${hoverBg}`
                        }`}>
                        <div className={`w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm`}>
                          <Icon name="light_mode" className="text-2xl text-amber-500" />
                        </div>
                        <div className="text-left">
                          <p className={`font-bold ${textPrimary}`}>Light Mode</p>
                          <p className={`text-xs ${textMuted}`}>Clean and bright</p>
                        </div>
                        {!darkMode && <Icon name="check_circle" filled className={`ml-auto ${greenAccent} text-xl`} />}
                      </button>
                      <button onClick={() => setDarkMode(true)}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                          darkMode ? 'border-primary bg-primary/5' : `${borderColor} border ${hoverBg}`
                        }`}>
                        <div className={`w-12 h-12 rounded-xl bg-[#0f1930] border border-[#40485d]/30 flex items-center justify-center shadow-sm`}>
                          <Icon name="dark_mode" className="text-2xl text-indigo-400" />
                        </div>
                        <div className="text-left">
                          <p className={`font-bold ${textPrimary}`}>Dark Mode</p>
                          <p className={`text-xs ${textMuted}`}>Easy on the eyes</p>
                        </div>
                        {darkMode && <Icon name="check_circle" filled className={`ml-auto ${greenAccent} text-xl`} />}
                      </button>
                    </div>
                  </div>

                  {/* Financial Overview */}
                  <div className={`${cardBg} rounded-2xl p-6 md:p-8 ${borderColor} border shadow-sm`}>
                    <h4 className={`font-headline text-lg font-bold ${textPrimary} mb-6 flex items-center gap-3`}>
                      <Icon name="analytics" className={greenAccent} />
                      Financial Overview
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className={`p-4 rounded-xl ${cardBg2} ${borderColor} border text-center`}>
                        <p className={`text-xs font-bold uppercase tracking-widest ${textMuted} mb-2`}>Total Income</p>
                        <p className={`text-2xl font-headline font-extrabold ${greenAccent}`}>₹{income.toLocaleString()}</p>
                      </div>
                      <div className={`p-4 rounded-xl ${cardBg2} ${borderColor} border text-center`}>
                        <p className={`text-xs font-bold uppercase tracking-widest ${textMuted} mb-2`}>Total Expenses</p>
                        <p className={`text-2xl font-headline font-extrabold text-error`}>₹{expenses.toLocaleString()}</p>
                      </div>
                      <div className={`p-4 rounded-xl ${cardBg2} ${borderColor} border text-center`}>
                        <p className={`text-xs font-bold uppercase tracking-widest ${textMuted} mb-2`}>Balance</p>
                        <p className={`text-2xl font-headline font-extrabold ${remaining >= 0 ? greenAccent : 'text-error'}`}>₹{Math.abs(remaining).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div className={`${cardBg} rounded-2xl p-6 md:p-8 ${borderColor} border shadow-sm`}>
                    <h4 className={`font-headline text-lg font-bold ${textPrimary} mb-6 flex items-center gap-3`}>
                      <Icon name="settings" className={greenAccent} />
                      Account
                    </h4>
                    <div className="space-y-3">
                      <div className={`flex items-center justify-between p-4 rounded-xl ${cardBg2} ${borderColor} border`}>
                        <div className="flex items-center gap-3">
                          <Icon name="email" className={textSecondary} />
                          <div>
                            <p className={`font-bold text-sm ${textPrimary}`}>Email</p>
                            <p className={`text-xs ${textMuted}`}>{userEmail}</p>
                          </div>
                        </div>
                      </div>
                      <div className={`flex items-center justify-between p-4 rounded-xl ${cardBg2} ${borderColor} border`}>
                        <div className="flex items-center gap-3">
                          <Icon name="badge" className={textSecondary} />
                          <div>
                            <p className={`font-bold text-sm ${textPrimary}`}>Display Name</p>
                            <p className={`text-xs ${textMuted}`}>{displayName}</p>
                          </div>
                        </div>
                      </div>
                      <button onClick={handleLogout}
                        className="w-full mt-4 flex items-center justify-center gap-3 p-4 rounded-xl bg-error/10 text-error hover:bg-error/20 transition-all font-bold">
                        <Icon name="logout" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </main>

      {/* Mobile FAB */}
      {activeTab !== "add" && (
        <button onClick={() => setActiveTab("add")}
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-on-primary shadow-2xl flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-all">
          <Icon name="add" className="text-3xl" />
        </button>
      )}
    </div>
  );
}