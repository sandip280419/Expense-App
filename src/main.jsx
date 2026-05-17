import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  const [text, setText] = useState("")
  const [amount, setAmount] = useState("")
  const [items, setItems] = useState([])

  const addExpense = () => {
    if (!text || !amount) return

    const newItem = {
      text,
      amount
    }

    setItems([...items, newItem])

    setText("")
    setAmount("")
  }

  return (
    <div style={{padding:20,fontFamily:"Arial"}}>
      <h1>বাংলা Expense App 💰</h1>

      <input
        placeholder="খরচের নাম"
        value={text}
        onChange={(e)=>setText(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="টাকার পরিমাণ"
        value={amount}
        onChange={(e)=>setAmount(e.target.value)}
      />

      <br /><br />

      <button onClick={addExpense}>
        Add Expense
      </button>

      <hr />

      {items.map((item,index)=>(
        <div key={index}>
          {item.text} - ₹{item.amount}
        </div>
      ))}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
