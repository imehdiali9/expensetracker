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

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

/* ---------- Premium Stat Card ---------- */

const StatCard = ({ title, value, color }) => (
  <div className="
    p-6 rounded-2xl
    bg-gradient-to-br
    from-white to-gray-50
    dark:from-gray-800 dark:to-gray-900
    shadow-lg hover:shadow-xl hover:scale-[1.02]
    transition
  ">
    <p className="text-gray-500 dark:text-gray-400">
      {title}
    </p>

    <h2 className={`text-3xl font-bold mt-2 ${color}`}>
      {value}
    </h2>
  </div>
);

export default function App() {

  /* ---------- DARK MODE ---------- */

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  /* ---------- APP STATE ---------- */

  const [activeTab, setActiveTab] = useState("dashboard");

  const [categories, setCategories] = useState([
    "Food",
    "Transport",
    "Bills",
  ]);

  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [type, setType] = useState("expense");
  const [newCategory, setNewCategory] = useState("");
  const [budgetInput, setBudgetInput] = useState("");

  /* ---------- LOGIC ---------- */

  const addTransaction = () => {
    if (!amount) return;

    setTransactions([
      ...transactions,
      {
        id: Date.now(),
        amount: Number(amount),
        category,
        type,
      },
    ]);

    setAmount("");
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const addCategory = () => {
    if (!newCategory) return;

    setCategories([...categories, newCategory]);
    setNewCategory("");
  };

  const setBudget = () => {
    if (!budgetInput) return;

    setBudgets({
      ...budgets,
      [category]: Number(budgetInput),
    });

    setBudgetInput("");
  };

  /* ---------- CALCULATIONS ---------- */

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

  /* ---------- UI ---------- */

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">

      {/* SIDEBAR */}
      <aside className="
        w-64 p-6 space-y-6
        bg-blue-700 text-white
        dark:bg-gray-950
        shadow-lg
      ">

        <h1 className="text-2xl font-bold">
          Smart Tracker
        </h1>

        {["dashboard", "add", "budgets", "history"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`block w-full text-left px-3 py-2 rounded-lg capitalize transition ${
              activeTab === tab
                ? "bg-white text-blue-700 font-semibold"
                : "hover:bg-blue-600 dark:hover:bg-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}

        {/* DARK MODE BUTTON */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="
            mt-10 w-full py-2 rounded-lg
            bg-white/20 hover:bg-white/30
            transition
          "
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

      </aside>


      {/* MAIN */}
      <main className="flex-1 p-10 max-w-screen-2xl mx-auto">

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Income" value={`₹${income}`} color="text-green-500"/>
              <StatCard title="Expenses" value={`₹${expenses}`} color="text-red-500"/>
              <StatCard title="Remaining" value={`₹${remaining}`} color={remaining >= 0 ? "text-green-500" : "text-red-500"}/>
              <StatCard title="Categories" value={categories.length} color="text-blue-500"/>
            </div>

            {/* CHARTS */}
            <div className="grid lg:grid-cols-2 gap-6 mt-10">

              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h3 className="font-semibold mb-4 text-lg dark:text-gray-200">
                  Budget vs Spending
                </h3>

                {transactions.length === 0 ? (
                  <p className="text-gray-400 text-center mt-20">
                    Add transactions to see analytics 📊
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3"/>
                      <XAxis dataKey="name"/>
                      <YAxis/>
                      <Tooltip/>
                      <Legend/>
                      <Bar dataKey="budget" fill="#3b82f6"/>
                      <Bar dataKey="spent" fill="#ef4444"/>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h3 className="font-semibold mb-4 text-lg dark:text-gray-200">
                  Expense Distribution
                </h3>

                {transactions.length === 0 ? (
                  <p className="text-gray-400 text-center mt-20">
                    No data yet 📉
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={chartData} dataKey="spent" outerRadius={100} label>
                        {chartData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip/>
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

            </div>
          </>
        )}

        {/* ADD */}
        {activeTab === "add" && (
          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h2 className="font-bold text-lg mb-4 dark:text-gray-200">
                Add Transaction
              </h2>

              <input
                type="number"
                placeholder="Amount"
                className="border p-3 rounded-lg w-full mb-3 dark:bg-gray-900 dark:border-gray-700"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />

              <select
                className="border p-3 rounded-lg w-full mb-3 dark:bg-gray-900 dark:border-gray-700"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {categories.map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <select
                className="border p-3 rounded-lg w-full mb-4 dark:bg-gray-900 dark:border-gray-700"
                value={type}
                onChange={e => setType(e.target.value)}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>

              <button
                onClick={addTransaction}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700"
              >
                Add Transaction
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h2 className="font-bold text-lg mb-4 dark:text-gray-200">
                Create Category
              </h2>

              <input
                placeholder="New category"
                className="border p-3 rounded-lg w-full mb-3 dark:bg-gray-900 dark:border-gray-700"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
              />

              <button
                onClick={addCategory}
                className="bg-green-600 text-white px-4 py-2 rounded-lg w-full hover:bg-green-700"
              >
                Add Category
              </button>
            </div>

          </div>
        )}

        {/* BUDGETS */}
        {activeTab === "budgets" && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg max-w-xl">
            <h2 className="font-bold text-lg mb-4 dark:text-gray-200">
              Set Budgets
            </h2>

            <select
              className="border p-3 rounded-lg w-full mb-3 dark:bg-gray-900 dark:border-gray-700"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {categories.map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Budget amount"
              className="border p-3 rounded-lg w-full mb-3 dark:bg-gray-900 dark:border-gray-700"
              value={budgetInput}
              onChange={e => setBudgetInput(e.target.value)}
            />

            <button
              onClick={setBudget}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg w-full hover:bg-purple-700"
            >
              Set Budget
            </button>
          </div>
        )}

        {/* HISTORY */}
        {activeTab === "history" && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="font-bold text-lg mb-4 dark:text-gray-200">
              Transactions
            </h2>

            {transactions.length === 0 ? (
              <p className="text-gray-400">
                No transactions yet.
              </p>
            ) : (
              transactions.map(t => (
                <div
                  key={t.id}
                  className="flex justify-between border-b py-2 dark:border-gray-700"
                >
                  <span className="dark:text-gray-300">
                    {t.category} • {t.type}
                  </span>

                  <div className="flex gap-4 items-center">
                    <span
                      className={
                        t.type === "income"
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      ₹{t.amount}
                    </span>

                    <button
                      onClick={() => deleteTransaction(t.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </main>
    </div>
  );
}
