import { useMemo } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon,
  BarChart3, Activity, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#f87171', '#06b6d4', '#ec4899', '#14b8a6'];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="chart-custom-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        {payload.map((entry) => (
          <p key={entry.dataKey} style={{ color: entry.color, fontSize: 13, fontWeight: 500 }}>
            {entry.name}: ₹{entry.value.toLocaleString('en-IN')}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function AnalyticsPage() {
  const { transactions, chartData } = useTransactions();

  // Category breakdown
  const categoryData = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Income vs Expense summary
  const summary = useMemo(() => {
    const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const savings = income - expenses;
    const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : 0;
    return { income, expenses, savings, savingsRate };
  }, [transactions]);

  // Monthly bar data
  const barData = useMemo(() => {
    return chartData.map((d) => ({
      ...d,
      savings: d.income - d.expenses,
    }));
  }, [chartData]);

  // Type distribution for pie
  const typeDistribution = useMemo(() => {
    return [
      { name: 'Income', value: summary.income },
      { name: 'Expenses', value: summary.expenses },
    ];
  }, [summary]);

  const formatCurrency = (v) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(v);

  return (
    <div className="page-content animate-fade-in-up" style={{ opacity: 0 }}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Visualize your financial data and spending patterns</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="analytics-summary">
        <div className="glass-card analytics-stat-card">
          <div className="analytics-stat-icon income-bg">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="analytics-stat-label">Total Income</div>
            <div className="analytics-stat-value" style={{ color: 'var(--emerald-400)' }}>
              {formatCurrency(summary.income)}
            </div>
          </div>
        </div>
        <div className="glass-card analytics-stat-card">
          <div className="analytics-stat-icon expense-bg">
            <TrendingDown size={20} />
          </div>
          <div>
            <div className="analytics-stat-label">Total Expenses</div>
            <div className="analytics-stat-value" style={{ color: 'var(--crimson-400)' }}>
              {formatCurrency(summary.expenses)}
            </div>
          </div>
        </div>
        <div className="glass-card analytics-stat-card">
          <div className="analytics-stat-icon savings-bg">
            <DollarSign size={20} />
          </div>
          <div>
            <div className="analytics-stat-label">Net Savings</div>
            <div className="analytics-stat-value" style={{ color: 'var(--accent-blue)' }}>
              {formatCurrency(summary.savings)}
            </div>
          </div>
        </div>
        <div className="glass-card analytics-stat-card">
          <div className="analytics-stat-icon rate-bg">
            <Activity size={20} />
          </div>
          <div>
            <div className="analytics-stat-label">Savings Rate</div>
            <div className="analytics-stat-value" style={{ color: 'var(--accent-purple)' }}>
              {summary.savingsRate}%
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="analytics-charts-grid">
        {/* Income & Expense Trends */}
        <div className="glass-card analytics-chart-card span-2">
          <div className="analytics-chart-header">
            <div className="analytics-chart-title-row">
              <BarChart3 size={18} className="analytics-chart-icon" />
              <div>
                <div className="chart-title">Income & Expense Trends</div>
                <div className="chart-subtitle">Monthly breakdown over 6 months</div>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="aGradIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aGradExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2} fill="url(#aGradIncome)" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f87171" strokeWidth={2} fill="url(#aGradExpenses)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Savings Bar */}
        <div className="glass-card analytics-chart-card">
          <div className="analytics-chart-header">
            <div className="analytics-chart-title-row">
              <ArrowUpRight size={18} className="analytics-chart-icon" />
              <div>
                <div className="chart-title">Monthly Savings</div>
                <div className="chart-subtitle">Income minus expenses</div>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="savings" name="Savings" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown Pie */}
        <div className="glass-card analytics-chart-card">
          <div className="analytics-chart-header">
            <div className="analytics-chart-title-row">
              <PieIcon size={18} className="analytics-chart-icon" />
              <div>
                <div className="chart-title">By Category</div>
                <div className="chart-subtitle">Spending distribution</div>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(148,163,184,0.1)',
                  borderRadius: 12,
                  fontSize: 13,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
            {categoryData.map((cat, i) => (
              <div key={cat.name} className="pie-legend-item">
                <span className="legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
                <span>{cat.name}</span>
                <span style={{ color: 'var(--slate-500)', marginLeft: 'auto' }}>{formatCurrency(cat.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Income vs Expenses Comparison */}
        <div className="glass-card analytics-chart-card">
          <div className="analytics-chart-header">
            <div className="analytics-chart-title-row">
              <Activity size={18} className="analytics-chart-icon" />
              <div>
                <div className="chart-title">Income vs Expenses</div>
                <div className="chart-subtitle">Total comparison</div>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={typeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell fill="#10b981" />
                <Cell fill="#f87171" />
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(148,163,184,0.1)',
                  borderRadius: 12,
                  fontSize: 13,
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, color: 'var(--slate-400)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="analytics-comparison-bar">
            <div className="comparison-bar-fill income-fill" style={{ width: `${(summary.income / (summary.income + summary.expenses)) * 100}%` }} />
          </div>
          <div className="analytics-comparison-labels">
            <span style={{ color: 'var(--emerald-400)' }}>
              <ArrowUpRight size={12} /> {((summary.income / (summary.income + summary.expenses)) * 100).toFixed(1)}% Income
            </span>
            <span style={{ color: 'var(--crimson-400)' }}>
              <ArrowDownRight size={12} /> {((summary.expenses / (summary.income + summary.expenses)) * 100).toFixed(1)}% Expenses
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
