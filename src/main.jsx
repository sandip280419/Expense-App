import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  return (
    <div style={{padding: 20}}>
      <h1>Expense App</h1>
      <p>App Running Successfully ✅</p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
