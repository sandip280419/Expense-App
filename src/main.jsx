import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

function App() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(items));
  }, [items]);

  const addExpense = () => {
    if (!description || !amount || !date) return;

    const newItem = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      date,
    };

    setItems([newItem, ...items]);

    setDescription("");
    setAmount("");
    setDate("");
  };

  const deleteExpense = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const grouped = {};

  items.forEach((item) => {
    if (!grouped[item.date]) {
      grouped[item.date] = [];
    }
    grouped[item.date].push(item);
  });

  const grandTotal = items.reduce((sum, item) => sum + item.amount, 0);

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
          maxWidth: "550px",
          margin: "auto",
          background: "white",
          padding: "25px",
          borderRadius: "15px",
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#2563eb",
            marginBottom: "20px",
          }}
        >
          Expense Tracker 💰
        </h1>

        <input
          type="text"
          placeholder="Expense Name"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={inputStyle}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={inputStyle}
        />

        <button onClick={addExpense} style={buttonStyle}>
          Add Expense
        </button>

        <h2 style={{ marginTop: "20px" }}>
          Grand Total: ₹{grandTotal}
        </h2>

        {Object.keys(grouped).map((dateKey) => {
          const total = grouped[dateKey].reduce(
            (sum, item) => sum + item.amount,
            0
          );

          return (
            <div
              key={dateKey}
              style={{
                background: "#e2e8f0",
                padding: "15px",
                borderRadius: "10px",
                marginTop: "20px",
              }}
            >
              <h3>📅 {dateKey}</h3>

              <h4>Total: ₹{total}</h4>

              {grouped[dateKey].map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "white",
                    padding: "10px",
                    borderRadius: "8px",
                    marginTop: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>{item.description}</strong>
                    <br />
                    ₹{item.amount}
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
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "20px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  cursor: "pointer",
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
