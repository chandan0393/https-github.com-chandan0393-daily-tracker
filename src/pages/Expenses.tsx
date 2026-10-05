import { useState, useEffect } from 'react'
import { Plus, Wallet, Trash2 } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'

type ExpenseItem = {
  id: string
  title: string
  amount: number
  category: 'food' | 'travel' | 'shopping' | 'other'
  time: string
}

const STORAGE_KEY = 'lifeos.expenses'

const INITIAL_EXPENSES: ExpenseItem[] = [
  { id: '1', title: 'Lunch & Fruit Juice', amount: 450, category: 'food', time: '1:15 PM' },
  { id: '2', title: 'Bus Pass / Metro', amount: 120, category: 'travel', time: '9:30 AM' },
  { id: '3', title: 'Notebook & Pen', amount: 200, category: 'shopping', time: '4:45 PM' },
  { id: '4', title: 'Phone Mobile Data', amount: 80, category: 'other', time: '6:10 PM' },
]

const CATEGORY_META = {
  food: { label: 'Food & Snacks', emoji: '🍔', bg: 'var(--pastel-pink-soft)', color: '#A8454D' },
  travel: { label: 'Travel', emoji: '🚕', bg: 'var(--pastel-blue-soft)', color: '#3E5C8A' },
  shopping: { label: 'Shopping', emoji: '🛒', bg: 'var(--pastel-yellow-soft)', color: '#826D1D' },
  other: { label: 'Other', emoji: '📱', bg: 'var(--pastel-purple-soft)', color: '#5F4B84' },
}

export function Expenses() {
  const [items, setItems] = useState<ExpenseItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : INITIAL_EXPENSES
    } catch {
      return INITIAL_EXPENSES
    }
  })

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<ExpenseItem['category']>('food')
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // storage unavailable
    }
  }, [items])

  const total = items.reduce((sum, it) => sum + it.amount, 0)

  function handleAdd() {
    if (!title.trim() || !amount.trim() || isNaN(Number(amount))) return
    const now = new Date()
    const newItem: ExpenseItem = {
      id: `exp-${Date.now()}`,
      title: title.trim(),
      amount: Number(amount),
      category,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setItems([newItem, ...items])
    setTitle('')
    setAmount('')
    setShowAdd(false)
  }

  function handleDelete(id: string) {
    setItems(items.filter((it) => it.id !== id))
  }

  return (
    <section className="page expenses-page">
      <div className="page-toolbar">
        <PageHeader
          title="Daily Expenses"
          subtitle="Keep your pocket money and daily spending organized."
        />
        <button
          type="button"
          className="fun-btn fun-btn-primary"
          onClick={() => setShowAdd((s) => !s)}
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>{showAdd ? 'Close' : 'Add Expense'}</span>
        </button>
      </div>

      <div className="fun-hero-card expense-hero-card">
        <div className="expense-hero-top">
          <div className="expense-wallet-icon">
            <Wallet size={36} />
          </div>
          <span className="expense-budget-badge">Daily Budget: ₹1,500</span>
        </div>
        <div className="expense-total-display">
          <span className="expense-currency">₹</span>
          <span className="expense-total-num">{total.toLocaleString()}</span>
          <span className="expense-total-lbl">spent today</span>
        </div>
      </div>

      {showAdd ? (
        <div className="fun-card add-expense-card">
          <h3>New Expense Entry</h3>
          <div className="form-row">
            <input
              type="text"
              placeholder="What did you buy? (e.g., Pizza, Bus ticket)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="fun-input"
              autoFocus
            />
            <input
              type="number"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="fun-input"
            />
          </div>

          <div className="category-select-row">
            {(Object.keys(CATEGORY_META) as ExpenseItem['category'][]).map((cat) => {
              const meta = CATEGORY_META[cat]
              return (
                <button
                  key={cat}
                  type="button"
                  className={`cat-pill-btn ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  <span>{meta.emoji}</span>
                  <span>{meta.label}</span>
                </button>
              )
            })}
          </div>

          <div className="form-actions">
            <button type="button" className="fun-btn fun-btn-soft" onClick={() => setShowAdd(false)}>
              Cancel
            </button>
            <button type="button" className="fun-btn fun-btn-primary" onClick={handleAdd}>
              Save Expense
            </button>
          </div>
        </div>
      ) : null}

      <div className="fun-card expense-list-card">
        <h3 className="fun-card-title">Recent Spending</h3>
        {items.length === 0 ? (
          <p className="empty-subtext">No expenses recorded today! Great savings! 🎉</p>
        ) : (
          <div className="expense-items-list">
            {items.map((item) => {
              const meta = CATEGORY_META[item.category] || CATEGORY_META.other
              return (
                <div key={item.id} className="expense-row-item">
                  <div className="expense-row-left">
                    <span className="expense-row-emoji">{meta.emoji}</span>
                    <div className="expense-row-details">
                      <strong>{item.title}</strong>
                      <span className="expense-row-time">{item.time} · {meta.label}</span>
                    </div>
                  </div>
                  <div className="expense-row-right">
                    <span className="expense-row-amount">-₹{item.amount}</span>
                    <button
                      type="button"
                      className="expense-del-btn"
                      onClick={() => handleDelete(item.id)}
                      aria-label={`Delete ${item.title}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
