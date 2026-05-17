import React, { useState, useEffect } from "react";

function App() {
  const [expenses, setExpenses] = useState(() => {
    return JSON.parse(localStorage.getItem("expenses")) || [];
  });

  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!date || !name || !amount) {
      alert("Please fill all fields");
      return;
    }

    if (editingId) {
      setExpenses(
        expenses.map((item) =>
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
        id: Date.now(),
        date,
        name,
        amount: Number(amount),
        category,
      };

      setExpenses([...expenses, newExpense]);
    }

    setDate("");
    setName("");
    setAmount("");
    setCategory("Food");
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((item) => item.id !== id));
  };

  const editExpense = (item) => {
    setEditingId(item.id);
    setDate(item.date);
    setName(item.name);
    setAmount(item.amount);
    setCategory(item.category);
  };

  // Group by date
  const groupedExpenses = expenses.reduce((groups, expense) => {
    if (!groups[expense.date]) {
      groups[expense.date] = [];
    }

    groups[expense.date].push(expense);

    return groups;
  }, {});

  const grandTotal = expenses.reduce(
    (total, item) => total + item.amount,
    0
  );

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>💰 Expense Tracker</h1>

      <div style={formStyle}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={inputStyle}
        />

        <div style={dateTextStyle}>DD-MM-YYYY</div>

        <input
          type="text"
          placeholder="Expense Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={inputStyle}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={inputStyle}
        >
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Bills</option>
          <option>Entertainment</option>
          <option>Other</option>
        </select>

        <button onClick={addExpense} style={addButton}>
          {editingId ? "Update Expense" : "Add Expense"}
        </button>
      </div>

      <div style={totalBox}>
        Grand Total: ₹{grandTotal}
      </div>

      {Object.keys(groupedExpenses)
        .sort((a, b) => new Date(b) - new Date(a))
        .map((dateKey) => {
          const total = groupedExpenses[dateKey].reduce(
            (sum, item) => sum + item.amount,
            0
          );

          return (
            <div key={dateKey} style={dateGroupStyle}>
              <div style={dateHeaderStyle}>
                <span>
                  📅{" "}
                  {new Date(dateKey).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>

                <span>₹{total}</span>
              </div>

              {groupedExpenses[dateKey].map((item) => (
                <div key={item.id} style={expenseCard}>
                  <div>
                    <h3 style={expenseName}>
                      {item.name}
                    </h3>

                    <p style={amountStyle}>
                      ₹{item.amount}
                    </p>

                    <small style={categoryStyle}>
                      🏷 {item.category}
                    </small>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => editExpense(item)}
                      style={editButton}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteExpense(item.id)}
                      style={deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
    </div>
  );
}

const containerStyle = {
  maxWidth: "650px",
  margin: "30px auto",
  padding: "25px",
  background:
    "linear-gradient(135deg, #0f172a, #1e293b)",
  borderRadius: "20px",
  fontFamily: "Trebuchet MS, sans-serif",
  color: "white",
};

const titleStyle = {
  textAlign: "center",
  color: "#38bdf8",
  marginBottom: "20px",
  fontSize: "36px",
};

const formStyle = {
  background: "rgba(255,255,255,0.05)",
  padding: "20px",
  borderRadius: "15px",
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "1px solid #334155",
  background: "#1e293b",
  color: "white",
  fontSize: "16px",
  boxSizing: "border-box",
};

const dateTextStyle = {
  color: "#94a3b8",
  marginBottom: "10px",
  marginTop: "-5px",
  fontSize: "14px",
  letterSpacing: "1px",
};

const addButton = {
  width: "100%",
  padding: "14px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "16px",
  cursor: "pointer",
};

const totalBox = {
  marginTop: "20px",
  background: "#0f172a",
  padding: "15px",
  borderRadius: "12px",
  fontSize: "24px",
  fontWeight: "bold",
  color: "#38bdf8",
};

const dateGroupStyle = {
  marginTop: "20px",
  background: "rgba(255,255,255,0.04)",
  borderRadius: "15px",
  padding: "15px",
};

const dateHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "15px",
  fontWeight: "bold",
  color: "#cbd5e1",
};

const expenseCard = {
  background: "#1e293b",
  padding: "15px",
  borderRadius: "12px",
  marginBottom: "12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const expenseName = {
  margin: 0,
  fontSize: "18px",
};

const amountStyle = {
  color: "#38bdf8",
  fontWeight: "bold",
  margin: "5px 0",
};

const categoryStyle = {
  color: "#94a3b8",
};

const editButton = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

const deleteButton = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

export default App;
