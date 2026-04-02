import MetricCards from '../components/MetricCards';
import BalanceChart from '../components/BalanceChart';
import TransactionsTable from '../components/TransactionsTable';

export default function Dashboard() {
  return (
    <>
      <MetricCards />
      <BalanceChart />
      <TransactionsTable />
    </>
  );
}
