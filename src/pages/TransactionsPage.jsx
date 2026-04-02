import { useState, useMemo } from 'react';
import {
  Search, Plus, Trash2, ArrowUpRight, ArrowDownRight,
  FileX, Filter, Download, Calendar, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import AddTransactionModal from '../components/AddTransactionModal';

const ITEMS_PER_PAGE = 8;

export default function TransactionsPage() {
  const { transactions, userRole, addTransaction, deleteTransaction } = useTransactions();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);

  const isAdmin = userRole === 'Admin';

  // Extract unique categories
  const categories = useMemo(() => {
    return [...new Set(transactions.map((t) => t.category))].sort();
  }, [transactions]);

  // Filter + sort
  const filtered = useMemo(() => {
    let result = transactions.filter((t) => {
      const matchesSearch =
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
      return matchesSearch && matchesType && matchesCategory;
    });

    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'date') cmp = new Date(a.date) - new Date(b.date);
      else if (sortBy === 'amount') cmp = a.amount - b.amount;
      else if (sortBy === 'description') cmp = a.description.localeCompare(b.description);
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [transactions, search, typeFilter, categoryFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const handleSort = (column) => {
    if (sortBy === column) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(column); setSortDir('desc'); }
  };

  // Summary stats
  const stats = useMemo(() => {
    const income = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { total: filtered.length, income, expenses };
  }, [filtered]);

  const handleExportCSV = () => {
    const header = 'Date,Description,Category,Amount,Type\n';
    const rows = filtered.map((t) =>
      `${t.date},"${t.description}",${t.category},${t.type === 'income' ? '' : '-'}${t.amount},${t.type}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-content animate-fade-in-up" style={{ opacity: 0 }}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">View, search, and manage all your transactions</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-outline" onClick={handleExportCSV} id="export-csv-btn">
            <Download size={14} />
            Export CSV
          </button>
          {isAdmin && (
            <button className="add-btn" onClick={() => setShowModal(true)} id="add-transaction-btn-page">
              <Plus size={16} />
              Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="txn-stats-row">
        <div className="txn-stat glass-card">
          <span className="txn-stat-label">Showing</span>
          <span className="txn-stat-value">{stats.total} transactions</span>
        </div>
        <div className="txn-stat glass-card">
          <span className="txn-stat-label">Filtered Income</span>
          <span className="txn-stat-value" style={{ color: 'var(--emerald-400)' }}>
            {formatCurrency(stats.income)}
          </span>
        </div>
        <div className="txn-stat glass-card">
          <span className="txn-stat-label">Filtered Expenses</span>
          <span className="txn-stat-value" style={{ color: 'var(--crimson-400)' }}>
            {formatCurrency(stats.expenses)}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="txn-filters glass-card">
        <div className="search-wrapper">
          <Search size={14} className="search-icon" />
          <input
            className="search-input"
            id="txn-search"
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="txn-filter-group">
          <Filter size={14} style={{ color: 'var(--slate-500)' }} />
          <select
            className="form-select txn-filter-select"
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            id="txn-type-filter"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            className="form-select txn-filter-select"
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            id="txn-category-filter"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card txn-table-card">
        {paged.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><FileX size={48} strokeWidth={1.2} /></div>
            <div className="empty-state-text">
              {search || typeFilter !== 'all' || categoryFilter !== 'all'
                ? 'No transactions match your filters.'
                : 'No transactions yet. Add one to get started!'}
            </div>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="transactions-table" id="txn-full-table">
                <thead>
                  <tr>
                    <th className="sortable-th" onClick={() => handleSort('date')}>
                      <Calendar size={12} /> Date {sortBy === 'date' && (sortDir === 'desc' ? '↓' : '↑')}
                    </th>
                    <th className="sortable-th" onClick={() => handleSort('description')}>
                      Description {sortBy === 'description' && (sortDir === 'desc' ? '↓' : '↑')}
                    </th>
                    <th>Category</th>
                    <th className="sortable-th" onClick={() => handleSort('amount')}>
                      Amount {sortBy === 'amount' && (sortDir === 'desc' ? '↓' : '↑')}
                    </th>
                    <th>Type</th>
                    {isAdmin && <th style={{ width: 48 }} />}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((txn) => (
                    <tr key={txn.id} id={`txn-row-${txn.id}`}>
                      <td style={{ whiteSpace: 'nowrap', color: 'var(--slate-400)' }}>
                        {formatDate(txn.date)}
                      </td>
                      <td style={{ fontWeight: 500, color: 'var(--slate-200)' }}>
                        {txn.description}
                      </td>
                      <td><span className="category-badge">{txn.category}</span></td>
                      <td className={`amount-cell ${txn.type}`}>
                        {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                      </td>
                      <td>
                        <span className={`type-badge ${txn.type}`}>
                          {txn.type === 'income' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
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

            {/* Pagination */}
            <div className="txn-pagination">
              <span className="txn-pagination-info">
                Page {page} of {totalPages} · {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
              <div className="txn-pagination-btns">
                <button
                  className="btn-outline btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <button
                  className="btn-outline btn-sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          onSubmit={(txn) => { addTransaction(txn); setPage(1); }}
        />
      )}
    </div>
  );
}
