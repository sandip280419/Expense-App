import "@fontsource/poppins";
import React, { useState, useEffect, useCallback, useRef } from "react";

// ---------- Reusable Components ----------
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

// ---------- Main App ----------
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
  const [editingId, setEditingId] = useState(null);

  // Save to localStorage
  const saveTimeout = useRef(null);

  useEffect(() => {
    clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(() => {
      localStorage.setItem("expenses", JSON.stringify(expenses));
    }, 300);

    return () => clearTimeout(saveTimeout.current);
  }, [expenses]);

  // Add / Update Expense
  const addExpense = useCallback(() => {
    if (!date || !name || !amount) {
      alert("Please fill all fields");
      return;
    }

    if (editingId) {
      setExpenses((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                date,
                name,
                amount: Number(amount),
                category,
              }
            : item
        )
      );

      setEditingId(null);
    } else {
      const newExpense = {
        id: Date.now() + Math.random(),
        date,
        name: name.trim(),
        amount: Number(amount),
        category,
      };

      setExpenses((prev) => [...prev, newExpense]);
    }

    setDate("");
    setName("");
    setAmount("");
    setCategory("Food");
  }, [date, name, amount, category, editingId]);

  // Delete Expense
  const deleteExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Edit Expense
  const editExpense = (item) => {
    setEditingId(item.id);
    setDate(item.date);
    setName(item.name);
    setAmount(item.amount);
    setCategory(item.category);
  };

  // Search
  const filteredExpenses = expenses.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Group by date
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
      {/* Header */}
      <h1 style={headerStyle}>💰 Expense Tracker</h1>

      {/* Form */}
      <div style={formCardStyle}>
        <GlassInput
          type="date"
          placeholder="DD-MM-YYYY"
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
          {editingId ? "✏ Update Expense" : "✨ Add Expense"}
        </button>
      </div>

      {/* Search */}
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

      {/* Expenses */}
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
                  month: "long",
                  year: "numeric",
                })}
              </span>

              <span style={dayTotalStyle}>
                ₹{dayTotal.toLocaleString()}
              </span>
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

                  <div style={expenseAmountStyle}>
                    ₹{item.amount}
                  </div>

                  <small style={expenseCategoryStyle}>
                    🏷 {item.category}
                  </small>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => editExpense(item)}
                    style={editButtonStyle}
                  >
                    ✏ Edit
                  </button>

                  <button
                    onClick={() => deleteExpense(item.id)}
                    style={deleteButtonStyle}
                  >
                    ✕ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {sortedDates.length === 0 && (
        <p style={emptyStyle}>
          No expenses yet. Add your first one!
        </p>
      )}
    </div>
  );
}

// ---------- Styles ----------
const containerStyle = {
  maxWidth: "620px",
  margin: "40px auto",
  padding: "30px",
  background:
    "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))",
  borderRadius: "28px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
  color: "#fff",
  fontFamily: "'Trebuchet MS', sans-serif",
};

const headerStyle = {
  textAlign: "center",
  fontSize: "36px",
  fontWeight: "700",
  marginBottom: "30px",
  color: "#38bdf8",
  letterSpacing: "1px",
  fontFamily: "'Trebuchet MS', sans-serif",
};

const formCardStyle = {
  background: "rgba(255,255,255,0.06)",
  borderRadius: "20px",
  padding: "20px",
  marginBottom: "20px",
  border: "1px solid rgba(255,255,255,0.08)",
};

const inputStyle = {
  width: "100%",
  padding: "15px",
  marginBottom: "14px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  fontSize: "16px",
  fontFamily: "'Trebuchet MS', sans-serif",
  boxSizing: "border-box",
  outline: "none",
};

const addButtonStyle = {
  width: "100%",
  padding: "15px",
  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
  color: "#fff",
  border: "none",
  borderRadius: "14px",
  cursor: "pointer",
  fontSize: "17px",
  fontWeight: "700",
  boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
  fontFamily: "'Trebuchet MS', sans-serif",
};

const totalCardStyle = {
  background: "rgba(56,189,248,0.1)",
  borderRadius: "16px",
  padding: "18px 24px",
  marginBottom: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const totalLabel = {
  fontSize: "20px",
  color: "#cbd5e1",
};

const totalValue = {
  fontSize: "30px",
  fontWeight: "700",
  color: "#38bdf8",
};

const dayCardStyle = {
  background: "rgba(255,255,255,0.04)",
  borderRadius: "20px",
  padding: "18px",
  marginTop: "20px",
};

const dayHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "15px",
  color: "#fff",
  fontWeight: "600",
  fontSize: "17px",
};

const dayTotalStyle = {
  color: "#38bdf8",
  fontWeight: "700",
};

const expenseItemStyle = {
  background: "rgba(255,255,255,0.06)",
  borderRadius: "14px",
  padding: "14px 16px",
  marginTop: "12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const expenseNameStyle = {
  fontSize: "18px",
  fontWeight: "700",
};

const expenseAmountStyle = {
  fontSize: "16px",
  color: "#38bdf8",
  marginTop: "4px",
};

const expenseCategoryStyle = {
  color: "#cbd5e1",
  fontSize: "13px",
};

const editButtonStyle = {
  background: "rgba(34,197,94,0.2)",
  color: "#86efac",
  border: "1px solid rgba(34,197,94,0.3)",
  padding: "8px 12px",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
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
};

const emptyStyle = {
  textAlign: "center",
  color: "#94a3b8",
  marginTop: "20px",
  fontSize: "16px",
};

export default App;
