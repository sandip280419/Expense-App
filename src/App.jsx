
import React, { useState, useEffect, useCallback, useRef } from "react";

// --- Reusable Input Component (glass style) ---
const GlassInput = ({ style, ...props }) => (
  <input
    style={{
      ...inputStyle,
      ...style,
    }}
    {...props}
  />
);

const GlassSelect = ({ style, children, ...props }) => (
  <select
    style={{
      ...inputStyle,
      ...style,
    }}
    {...props}
  >
    {children}
  </select>
);

// --- Main App ---
function App() {
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem("expenses");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [search, setSearch] = useState("");

  // Save to localStorage with debounce – only when expenses change
  const saveTimeout = useRef(null);
  useEffect(() => {
    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      localStorage.setItem("expenses", JSON.stringify(expenses));
    }, 300);
    return () => clearTimeout(saveTimeout.current);
  }, [expenses]);

  const addExpense = useCallback(() => {
    if (!date || !name || !amount) {
      alert("Please fill all fields");
      return;
    }
    const newExpense = {
      id: Date.now() + Math.random(), // more unique
      date,
      name: name.trim(),
      amount: Number(amount),
      category,
    };
    setExpenses((prev) => [...prev, newExpense]);
    // Reset form
    setDate("");
    setName("");
    setAmount("");
    setCategory("Food");
  }, [date, name, amount, category]);

  const deleteExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Filter expenses by search term (case-insensitive)
  const filteredExpenses = expenses.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Group by date (descending)
  const grouped = filteredExpenses.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  const grandTotal = filteredExpenses.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <div style={containerStyle}>
      {/* Glowing header */}
      <h1 style={headerStyle}>💰 Expense Tracker</h1>

      {/* Input form */}
      <div style={formCardStyle}>
        <GlassInput
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <GlassInput
          type="text"
          placeholder="Expense Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <GlassInput
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <GlassSelect
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Bills</option>
          <option>Entertainment</option>
          <option>Other</option>
        </GlassSelect>
        <button onClick={addExpense} style={addButtonStyle}>
          ✨ Add Expense
        </button>
      </div>

      {/* Search bar */}
      <GlassInput
        type="text"
        placeholder="🔍 Search expenses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "20px" }}
      />

      {/* Grand Total */}
      <div style={totalCardStyle}>
        <span style={totalLabel}>Grand Total</span>
        <span style={totalValue}>₹{grandTotal.toLocaleString()}</span>
      </div>

      {/* Expenses by date */}
      {sortedDates.map((dateKey) => {
        const dayTotal = grouped[dateKey].reduce(
          (sum, item) => sum + item.amount,
          0
        );
        return (
          <div key={dateKey} style={dayCardStyle}>
            <div style={dayHeaderStyle}>
              <span>
                📅{" "}
                {new Date(dateKey).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span style={dayTotalStyle}>₹{dayTotal.toLocaleString()}</span>
            </div>
            {grouped[dateKey].map((item, index) => (
              <div
                key={item.id}
                style={{
                  ...expenseItemStyle,
                  animationDelay: `${index * 0.05}s`,
                }}
                className="expense-item"
              >
                <div>
                  <div style={expenseNameStyle}>{item.name}</div>
                  <div style={expenseAmountStyle}>₹{item.amount}</div>
                  <small style={expenseCategoryStyle}>🏷 {item.category}</small>
                </div>
                <button
                  onClick={() => deleteExpense(item.id)}
                  style={deleteButtonStyle}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        );
      })}

      {sortedDates.length === 0 && (
        <p style={{ textAlign: "center", color: "#94a3b8", marginTop: "20px" }}>
          No expenses yet. Add your first one!
        </p>
      )}
    </div>
  );
}

// --- Styles (futuristic glassmorphism) ---
const containerStyle = {
  maxWidth: "600px",
  margin: "40px auto",
  padding: "30px",
  background:
    "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.95))",
  backdropFilter: "blur(12px)",
  borderRadius: "28px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
  color: "#e2e8f0",
  fontFamily: "'Poppins', sans-serif",
};

const headerStyle = {
  textAlign: "center",
  fontSize: "28px",
  fontWeight: "700",
  background: "linear-gradient(90deg, #38bdf8, #818cf8)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: "30px",
  letterSpacing: "1px",
};

const formCardStyle = {
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(8px)",
  borderRadius: "20px",
  padding: "20px",
  marginBottom: "20px",
  border: "1px solid rgba(255,255,255,0.08)",
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  marginBottom: "12px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.08)",
  color: "#f1f5f9",
  fontSize: "15px",
  fontFamily: "'Poppins', sans-serif",
  boxSizing: "border-box",
  outline: "none",
  transition: "all 0.2s",
};

const addButtonStyle = {
  width: "100%",
  padding: "14px",
  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
  color: "#fff",
  border: "none",
  borderRadius: "14px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "600",
  boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
  transition: "transform 0.15s, box-shadow 0.15s",
};

const totalCardStyle = {
  background: "rgba(56,189,248,0.1)",
  backdropFilter: "blur(8px)",
  borderRadius: "16px",
  padding: "18px 24px",
  marginBottom: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: "1px solid rgba(56,189,248,0.2)",
};

const totalLabel = {
  fontSize: "18px",
  fontWeight: "500",
  color: "#94a3b8",
};

const totalValue = {
  fontSize: "26px",
  fontWeight: "700",
  color: "#38bdf8",
};

const dayCardStyle = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(8px)",
  borderRadius: "20px",
  padding: "18px",
  marginTop: "20px",
  border: "1px solid rgba(255,255,255,0.06)",
};

const dayHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "14px",
  color: "#cbd5e1",
  fontWeight: "500",
  fontSize: "15px",
};

const dayTotalStyle = {
  color: "#a78bfa",
  fontWeight: "700",
  fontSize: "16px",
};

const expenseItemStyle = {
  background: "rgba(255,255,255,0.06)",
  borderRadius: "14px",
  padding: "14px 16px",
  marginTop: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: "1px solid rgba(255,255,255,0.04)",
  animation: "fadeInUp 0.3s ease forwards",
  opacity: 0,
};

const expenseNameStyle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#f1f5f9",
};

const expenseAmountStyle = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#60a5fa",
  marginTop: "4px",
};

const expenseCategoryStyle = {
  color: "#94a3b8",
  fontSize: "12px",
  marginTop: "2px",
  display: "block",
};

const deleteButtonStyle = {
  background: "rgba(239,68,68,0.2)",
  color: "#fca5a5",
  border: "1px solid rgba(239,68,68,0.3)",
  padding: "8px 12px",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  transition: "all 0.15s",
};

// Add a global style for the animation (could be in index.css)
// For simplicity, we inject a style tag (or you can add to your CSS)
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .expense-item:hover {
    background: rgba(255,255,255,0.1) !important;
    transform: scale(1.01);
    transition: all 0.15s;
  }
  button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  button:active {
    transform: scale(0.97);
  }
  input:focus, select:focus {
    border-color: #818cf8 !important;
    box-shadow: 0 0 0 2px rgba(129,140,248,0.3);
  }
`;
document.head.appendChild(styleSheet);

export default App;
