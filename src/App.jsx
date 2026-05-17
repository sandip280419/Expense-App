import "@fontsource/poppins";
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

      <div style={cardStyle}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={inputStyle}
        />

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

        <button onClick={addExpense} style={buttonStyle}>
          {editingId ? "✏️ Update Expense" : "✨ Add Expense"}
        </button>
      </div>

      <div style={totalStyle}>
        Grand Total: ₹{grandTotal.toLocaleString()}
      </div>

      {Object.keys(groupedExpenses)
        .sort((a, b) => new Date(b) - new Date(a))
        .map((dateKey) => {
          const total = groupedExpenses[dateKey].reduce(
            (sum, item) => sum + item.amount,
            0
          );

          return (
            <div key={dateKey} style={dateCard}>
              <div style={dateHeader}>
                <span>
                  📅{" "}
                  {new Date(dateKey).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>

                <span>₹{total}</span>
              </div>

              {groupedExpenses[dateKey].map((item) => (
                <div key={item.id} style={expenseItem}>
                  <div>
                    <h3 style={{ margin: 0 }}>{item.name}</h3>

                    <p style={{ margin: "5px 0", color: "#38bdf8" }}>
                      ₹{item.amount}
                    </p>

                    <small>{item.category}</small>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
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
                      X
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
  margin: "40px auto",
  padding: "30px",
  background: "#0f172a",
  borderRadius: "25px",
  color: "white",
  fontFamily: "'Poppins', sans-serif",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "25px",
  fontSize: "42px",
  color: "#38bdf8",
};

const cardStyle = {
  background: "#1e293b",
  padding: "25px",
  borderRadius: "20px",
};

const inputStyle = {
  width: "100%",
  padding: "18px",
  marginBottom: "15px",
  borderRadius: "12px",
  border: "none",
  outline: "none",
  background: "#334155",
  color: "white",
  fontSize: "18px",
  textTransform: "uppercase",
  boxSizing: "border-box",
  fontFamily: "'Poppins', sans-serif",
};

const buttonStyle = {
  width: "100%",
  padding: "16px",
  background: "#0ea5e9",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontSize: "18px",
  cursor: "pointer",
  fontWeight: "bold",
};

const totalStyle = {
  marginTop: "20px",
  background: "#082f49",
  padding: "20px",
  borderRadius: "15px",
  fontSize: "28px",
  fontWeight: "bold",
  color: "#38bdf8",
};

const dateCard = {
  background: "#111827",
  marginTop: "25px",
  padding: "20px",
  borderRadius: "18px",
};

const dateHeader = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "15px",
  fontSize: "20px",
  fontWeight: "bold",
};

const expenseItem = {
  background: "#1e293b",
  padding: "15px",
  borderRadius: "12px",
  marginBottom: "12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const editButton = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "10px 14px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

const deleteButton = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "10px 14px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default App;
