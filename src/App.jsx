import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

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
        maxWidth: "600px",
        margin: "30px auto",
        padding: "20px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#007bff" }}>
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
          padding: "12px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "20px",
          fontSize: "16px",
        }}
      >
        Add Expense
      </button>

      <h2>Grand Total: ₹{grandTotal}</h2>

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
                background: "#f5f5f5",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            >
              <h3>📅 {dateKey}</h3>
              <h4>Total: ₹{total}</h4>

              {groupedExpenses[dateKey].map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "white",
                    padding: "10px",
                    marginTop: "10px",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>{item.name}</strong>
                    <div>₹{item.amount}</div>
                    <small>🏷 {item.category}</small>
                  </div>

                  <button
                    onClick={() => deleteExpense(item.id)}
                    style={{
                      background: "red",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
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
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
