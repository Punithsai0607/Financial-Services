import { useState } from 'react';
import { X } from 'lucide-react';

const categories = [
  'Salary',
  'Freelance',
  'Investments',
  'Software',
  'Rent',
  'Groceries',
  'Health',
  'Entertainment',
  'Utilities',
  'Travel',
];

export default function AddTransactionModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: categories[0],
    type: 'income',
    date: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    onSubmit({
      ...form,
      amount: parseFloat(form.amount),
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="add-transaction-modal">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="modal-title">Add Transaction</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--slate-400)',
              cursor: 'pointer',
            }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="txn-description">
              Description
            </label>
            <input
              className="form-input"
              id="txn-description"
              name="description"
              placeholder="e.g. Salary Deposit"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="txn-amount">
              Amount ($)
            </label>
            <input
              className="form-input"
              id="txn-amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="txn-category">
                Category
              </label>
              <select
                className="form-select"
                id="txn-category"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="txn-type">
                Type
              </label>
              <select
                className="form-select"
                id="txn-type"
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="txn-date">
              Date
            </label>
            <input
              className="form-input"
              id="txn-date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" id="submit-transaction-btn">
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
