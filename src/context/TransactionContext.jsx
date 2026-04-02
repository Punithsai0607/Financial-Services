import { createContext, useContext, useReducer, useMemo } from 'react';

const TransactionContext = createContext();

// ─── Mock Data ───
const initialTransactions = [
  {
    id: 1,
    date: '2026-04-01',
    description: 'Salary Deposit',
    amount: 8500.00,
    category: 'Salary',
    type: 'income',
  },
  {
    id: 2,
    date: '2026-03-30',
    description: 'AWS Cloud Services',
    amount: 349.99,
    category: 'Software',
    type: 'expense',
  },
  {
    id: 3,
    date: '2026-03-28',
    description: 'Freelance UI Project',
    amount: 2200.00,
    category: 'Freelance',
    type: 'income',
  },
  {
    id: 4,
    date: '2026-03-25',
    description: 'Office Rent Payment',
    amount: 1800.00,
    category: 'Rent',
    type: 'expense',
  },
  {
    id: 5,
    date: '2026-03-22',
    description: 'Grocery Shopping',
    amount: 187.50,
    category: 'Groceries',
    type: 'expense',
  },
  {
    id: 6,
    date: '2026-03-20',
    description: 'Stock Dividends',
    amount: 420.00,
    category: 'Investments',
    type: 'income',
  },
  {
    id: 7,
    date: '2026-03-18',
    description: 'Gym Membership',
    amount: 59.99,
    category: 'Health',
    type: 'expense',
  },
];

// ─── Chart Data ───
const chartData = [
  { month: 'Oct', income: 7200, expenses: 4100, balance: 3100 },
  { month: 'Nov', income: 8800, expenses: 5200, balance: 3600 },
  { month: 'Dec', income: 9400, expenses: 4800, balance: 4600 },
  { month: 'Jan', income: 7900, expenses: 5600, balance: 2300 },
  { month: 'Feb', income: 10200, expenses: 4900, balance: 5300 },
  { month: 'Mar', income: 11120, expenses: 2397, balance: 8723 },
];

// ─── Reducer ───
function transactionReducer(state, action) {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case 'SET_ROLE':
      return { ...state, userRole: action.payload };
    default:
      return state;
  }
}

const initialState = {
  transactions: initialTransactions,
  userRole: 'Admin', // 'Admin' or 'Viewer'
};

// ─── Provider ───
export function TransactionProvider({ children }) {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  const totals = useMemo(() => {
    const income = state.transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = state.transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [state.transactions]);

  const addTransaction = (transaction) => {
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: { ...transaction, id: Date.now() },
    });
  };

  const deleteTransaction = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const setRole = (role) => {
    dispatch({ type: 'SET_ROLE', payload: role });
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions: state.transactions,
        userRole: state.userRole,
        totals,
        chartData,
        addTransaction,
        deleteTransaction,
        setRole,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

// ─── Hook ───
export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}
