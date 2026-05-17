import React, { useState } from "react";
import ReactDOM from "react-dom/client";

function App() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [items, setItems] = useState([]);

  const addExpense = () => {
    if (!description || !amount) return;

    const newItem = {
      id: Date.now(),
      description,
      amount,
    };

    setItems([newItem, ...items]);

    setDescription("");
    setAmount("");
  };

  const total = items.reduce(
    (sum, item) => sum + parseFloat(item.amount),
    0
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          margin: "auto",
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>
          বাংলা Expense App 💰
        </h1>

        <input
          type="text"
          placeholder="খরচের নাম"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
          }}
        />

        <input
          type="number"
          placeholder="টাকার পরিমাণ"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
          }}
        />

        <button
          onClick={addExpense}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Add Expense
        </button>

        <h2 style={{ marginTop: "20px" }}>
          Total: ₹{total}
        </h2>

        {items.map((item) => (
          <div
            key={item.id}
            style={{
              padding: "10px",
              marginTop: "10px",
              background: "#e5e7eb",
              borderRadius: "8px",
            }}
          >
            {item.description} — ₹{item.amount}
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
