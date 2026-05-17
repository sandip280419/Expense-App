import React, { useState } from "react";
import ReactDOM from "react-dom/client";

function App() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [items, setItems] = useState([]);

  const addExpense = () => {
    if (!description || !amount || !date) return;

    const newItem = {
      id: Date.now(),
      description,
      amount,
      date,
    };

    setItems([newItem, ...items]);

    setDescription("");
    setAmount("");
    setDate("");
  };

  const total = items.reduce(
    (sum, item) => sum + parseFloat(item.amount),
    0
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          margin: "auto",
          background: "white",
          padding: "25px",
          borderRadius: "15px",
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#2563eb" }}>
          Expense Tracker 💰
        </h1>

        <input
          type="text"
          placeholder="Expense Name"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={addExpense}
          style={{
            width: "100%",
            padding: "14px",
            marginTop: "20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Add Expense
        </button>

        <h2 style={{ marginTop: "25px" }}>
          Total: ₹{total}
        </h2>

        {items.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#e2e8f0",
              padding: "12px",
              borderRadius: "8px",
              marginTop: "12px",
            }}
          >
            <strong>{item.description}</strong>
            <br />
            ₹{item.amount}
            <br />
            {item.date}
          </div>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
