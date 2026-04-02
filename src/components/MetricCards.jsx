import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(value);
}

export default function MetricCards() {
  const { totals } = useTransactions();

  const cards = [
    {
      id: 'card-balance',
      label: 'Total Balance',
      value: totals.balance,
      valueClass: 'balance-val',
      iconClass: 'balance',
      icon: <Wallet size={20} />,
      trend: '+12.5%',
      trendDir: 'up',
      trendIcon: <ArrowUpRight size={14} />,
      subtitle: 'vs last month',
    },
    {
      id: 'card-income',
      label: 'Total Income',
      value: totals.income,
      valueClass: 'income-val',
      iconClass: 'income',
      icon: <TrendingUp size={20} />,
      trend: '+8.2%',
      trendDir: 'up',
      trendIcon: <ArrowUpRight size={14} />,
      subtitle: 'vs last month',
    },
    {
      id: 'card-expenses',
      label: 'Total Expenses',
      value: totals.expenses,
      valueClass: 'expenses-val',
      iconClass: 'expenses',
      icon: <TrendingDown size={20} />,
      trend: '-3.1%',
      trendDir: 'down',
      trendIcon: <ArrowDownRight size={14} />,
      subtitle: 'vs last month',
    },
  ];

  return (
    <div className="metric-cards">
      {cards.map((card, i) => (
        <div
          key={card.id}
          id={card.id}
          className={`glass-card metric-card animate-fade-in-up stagger-${i + 1}`}
          style={{ opacity: 0 }}
        >
          <div className="metric-card-header">
            <span className="label">{card.label}</span>
            <div className={`metric-icon ${card.iconClass}`}>{card.icon}</div>
          </div>
          <div className={`metric-value ${card.valueClass}`}>
            {formatCurrency(card.value)}
          </div>
          <div className={`metric-trend ${card.trendDir}`}>
            {card.trendIcon}
            <span>{card.trend}</span>
            <span style={{ color: 'var(--slate-500)', marginLeft: 4, fontSize: 12 }}>
              {card.subtitle}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
