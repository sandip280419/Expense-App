import "@fontsource/poppins";
import React, { useState, useEffect } from "react";

function App() {
  const [expenses, setExpenses] = useState(
    JSON.parse(localStorage.getItem("expenses")) || []
  );

  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!date || !name || !amount) {
      alert("Please fill all fields");
      return;
    }

    const newExpense = {
      id: Date.now(),
      date,
      name,
      amount: Number(amount),
      category,
    };

    setExpenses([...expenses, newExpense]);

    setDate("");
    setName("");
    setAmount("");
    setCategory("Food");
  };

  const deleteExpense = (id) => {
    const updated = expenses.filter((item) => item.id !== id);
    setExpenses(updated);
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
    <div
      style={{
        maxWidth: "650px",
        margin: "30px auto",
        padding: "20px",
        background: "#ffffff",
        borderRadius: "20px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#2563eb",
          marginBottom: "20px",
          fontSize: "32px",
        }}
      >
        Expense Tracker 💰
      </h1>

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

      <button
        onClick={addExpense}
        style={{
          width: "100%",
          padding: "14px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          marginBottom: "25px",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        Add Expense
      </button>

      <div
        style={{
          background: "#eff6ff",
          padding: "15px",
          borderRadius: "16px",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#1e40af",
          }}
        >
          Grand Total: ₹{grandTotal}
        </h2>
      </div>

      {Object.keys(groupedExpenses)
        .sort((a, b) => new Date(b) - new Date(a))
        .map((dateKey) => {
          const total = groupedExpenses[dateKey].reduce(
            (sum, item) => sum + item.amount,
            0
          );

          return (
            <div
              key={dateKey}
              style={{
                background: "#eef4ff",
                padding: "18px",
                borderRadius: "16px",
                marginTop: "20px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              }}
            >
              <h3
                style={{
                  color: "#1d4ed8",
                  marginBottom: "10px",
                }}
              >
                📅{" "}
                {new Date(dateKey).toLocaleDateString(
                  "en-GB",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </h3>

              <h4
                style={{
                  marginTop: "0",
                  color: "#111827",
                }}
              >
                Total: ₹{total}
              </h4>

              {groupedExpenses[dateKey].map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "#ffffff",
                    padding: "14px",
                    borderRadius: "14px",
                    marginTop: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow:
                      "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <div>
                    <strong
                      style={{
                        fontSize: "16px",
                        color: "#111827",
                      }}
                    >
                      {item.name}
                    </strong>

                    <div
                      style={{
                        marginTop: "4px",
                        color: "#2563eb",
                        fontWeight: "600",
                      }}
                    >
                      ₹{item.amount}
                    </div>

                    <small
                      style={{
                        color: "#6b7280",
                      }}
                    >
                      🏷 {item.category}
                    </small>
                  </div>

                  <button
                    onClick={() => deleteExpense(item.id)}
                    style={{
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          );
        })}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "12px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  fontFamily: "'Poppins', sans-serif",
  boxSizing: "border-box",
};

export default App;
