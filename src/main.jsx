import React, { useState } from "react";

export default function ExpenseNotepad() {

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [items, setItems] = useState([]);

  const addItem = () => {
    if (!description || !amount || !date) return;

    const newItem = {
      id: Date.now(),
      description,
      date,
      amount: parseFloat(amount),
    };

    setItems([newItem, ...items]);
    setDescription("");
    setAmount("");
    setDate("");
  };

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-3xl p-6 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">
          Daily Expense Notepad
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-2xl p-3 outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="text"
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded-2xl p-3 outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded-2xl p-3 outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          onClick={addItem}
          className="w-full bg-black text-white rounded-2xl py-3 text-lg font-semibold hover:opacity-90 transition"
        >
          Add Entry
        </button>

        <div className="mt-8">
          <div className="grid grid-cols-3 font-bold text-lg border-b pb-2 mb-3">
            <span>Date</span>
            <span>Description</span>
            <span className="text-right">Amount</span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="text-gray-500 text-center">No entries added yet</p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-3 bg-gray-50 p-3 rounded-2xl items-center"
                >
                  <span>{item.date}</span>
                  <span>{item.description}</span>
                  <span className="text-right">₹ {item.amount.toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 border-t pt-4 flex justify-between text-2xl font-bold">
          <span>Total</span>
          <span>₹ {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
