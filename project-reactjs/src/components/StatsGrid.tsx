import StatCard from './StatCard';

interface Stat {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: string;
}

interface StatsGridProps {
  stats: Stat[];
  columns?: 2 | 3 | 4 | 5;
}

export default function StatsGrid({ stats, columns = 4 }: StatsGridProps) {
  const gridClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
    5: 'md:grid-cols-2 lg:grid-cols-5',
  };

  return (
    <div className={`grid grid-cols-1 ${gridClass[columns]} gap-6`}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
