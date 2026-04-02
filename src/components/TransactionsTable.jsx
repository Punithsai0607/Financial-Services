import { useState } from 'react';
import { Search, Plus, Trash2, ArrowUpRight, ArrowDownRight, FileX } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import AddTransactionModal from './AddTransactionModal';

export default function TransactionsTable() {
  const { transactions, userRole, addTransaction, deleteTransaction } = useTransactions();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const isAdmin = userRole === 'Admin';

  const filtered = transactions.filter((t) =>
    t.category.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="transactions-section animate-fade-in-up stagger-5" style={{ opacity: 0 }}>
      <div className="glass-card transactions-card" id="transactions-table-section">
        <div className="transactions-header">
          <div className="transactions-title">Recent Transactions</div>
          <div className="transactions-controls">
            <div className="search-wrapper">
              <Search size={14} className="search-icon" />
              <input
                className="search-input"
                id="search-transactions"
                type="text"
                placeholder="Search by category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {isAdmin && (
              <button
                className="add-btn"
                onClick={() => setShowModal(true)}
                id="add-transaction-btn"
              >
                <Plus size={16} />
                Add Transaction
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FileX size={40} strokeWidth={1.2} />
            </div>
            <div className="empty-state-text">
              {search ? 'No transactions match your search.' : 'No transactions yet.'}
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="transactions-table" id="transactions-data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Type</th>
                  {isAdmin && <th style={{ width: 48 }} />}
                </tr>
              </thead>
              <tbody>
                {filtered.map((txn) => (
                  <tr key={txn.id} id={`txn-row-${txn.id}`}>
                    <td style={{ whiteSpace: 'nowrap', color: 'var(--slate-400)' }}>
                      {formatDate(txn.date)}
                    </td>
                    <td style={{ fontWeight: 500, color: 'var(--slate-200)' }}>
                      {txn.description}
                    </td>
                    <td>
                      <span className="category-badge">{txn.category}</span>
                    </td>
                    <td className={`amount-cell ${txn.type}`}>
                      {txn.type === 'income' ? '+' : '-'}
                      {formatCurrency(txn.amount)}
                    </td>
                    <td>
                      <span className={`type-badge ${txn.type}`}>
                        {txn.type === 'income' ? (
                          <ArrowUpRight size={12} />
                        ) : (
                          <ArrowDownRight size={12} />
                        )}
                        {txn.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    {isAdmin && (
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => deleteTransaction(txn.id)}
                          aria-label={`Delete ${txn.description}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          onSubmit={addTransaction}
        />
      )}
    </div>
  );
}
