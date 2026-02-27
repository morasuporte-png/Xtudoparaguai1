
import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  loading?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, change, icon, loading }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</h3>
        {icon && <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">{icon}</div>}
      </div>
      <div className="flex items-end gap-3">
        {loading ? (
            <div className="h-8 w-32 bg-slate-100 animate-pulse rounded"></div>
        ) : (
            <span className="text-2xl font-bold text-slate-900">{value}</span>
        )}
        {change !== undefined && (
          <span className={`text-xs font-bold mb-1 ${change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
