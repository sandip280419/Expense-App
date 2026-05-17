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

  const grandTotal = expenses.reduce(
    (total, item) => total + item.amount,
    0
  );

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Expense Tracker</h1>

      <div style={formStyle}>
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

        <button onClick={addExpense} style={addButton}>
          {editingId ? "Update Expense" : "Add Expense"}
        </button>
      </div>

      <div style={totalBox}>
        Grand Total: ₹{grandTotal}
      </div>

      {expenses
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map((item) => (
          <div key={item.id} style={expenseCard}>
            <div>
              <h3 style={{ marginBottom: "5px" }}>
                {item.name}
              </h3>

              <p style={amountStyle}>₹{item.amount}</p>

              <small style={dateStyle}>
                📅{" "}
                {new Date(item.date).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </small>

              <br />

              <small style={{ color: "#555" }}>
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
}

const containerStyle = {
  maxWidth: "650px",
  margin: "30px auto",
  padding: "25px",
  background: "#f4f4f4",
  borderRadius: "15px",
  fontFamily: "Times New Roman, Times, serif",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "20px",
  color: "#1d4ed8",
  fontSize: "34px",
  fontFamily: "Times New Roman, Times, serif",
};

const formStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "16px",
  fontFamily: "Times New Roman, Times, serif",
  textTransform: "uppercase",
  boxSizing: "border-box",
};

const addButton = {
  width: "100%",
  padding: "12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "17px",
  cursor: "pointer",
  fontFamily: "Times New Roman, Times, serif",
};

const totalBox = {
  marginTop: "20px",
  background: "#dbeafe",
  padding: "15px",
  borderRadius: "10px",
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1d4ed8",
  fontFamily: "Times New Roman, Times, serif",
};

const expenseCard = {
  background: "white",
  marginTop: "15px",
  padding: "15px",
  borderRadius: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

const amountStyle = {
  color: "#2563eb",
  fontWeight: "bold",
  margin: "5px 0",
  fontFamily: "Times New Roman, Times, serif",
};

const dateStyle = {
  color: "#444",
  fontFamily: "Times New Roman, Times, serif",
};

const editButton = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontFamily: "Times New Roman, Times, serif",
};

const deleteButton = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontFamily: "Times New Roman, Times, serif",
};

export default App;
