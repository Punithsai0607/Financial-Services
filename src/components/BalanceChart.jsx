import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useTransactions } from '../context/TransactionContext';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderRadius: 12,
          padding: '12px 16px',
          backdropFilter: 'blur(12px)',
        }}
      >
        <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8, fontWeight: 600 }}>
          {label}
        </p>
        {payload.map((entry) => (
          <p
            key={entry.dataKey}
            style={{
              color: entry.color,
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 2,
            }}
          >
            {entry.name}: ₹{entry.value.toLocaleString('en-IN')}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function BalanceChart() {
  const { chartData } = useTransactions();

  return (
    <div className="chart-section animate-fade-in-up stagger-4" style={{ opacity: 0 }}>
      <div className="glass-card chart-card" id="balance-chart">
        <div className="chart-header">
          <div>
            <div className="chart-title">Balance Trends</div>
            <div className="chart-subtitle">6 month overview</div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#10b981' }} />
              Income
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#f87171' }} />
              Expenses
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#3b82f6' }} />
              Balance
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148, 163, 184, 0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#475569', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#475569', fontSize: 12 }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#gradIncome)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#f87171"
              strokeWidth={2}
              fill="url(#gradExpenses)"
            />
            <Area
              type="monotone"
              dataKey="balance"
              name="Balance"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#gradBalance)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
