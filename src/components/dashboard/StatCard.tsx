import React from 'react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string | number;
    type: 'increase' | 'decrease';
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, className }) => {
  return (
    <div className={cn('bg-white p-6 rounded-lg shadow-sm border border-gray-200', className)}>
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-blue-50 text-blue-600">
          {icon}
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
      </div>
      
      {change && (
        <div className="mt-2">
          <span 
            className={cn(
              'text-xs font-medium',
              change.type === 'increase' ? 'text-green-600' : 'text-red-600'
            )}
          >
            {change.type === 'increase' ? '↑' : '↓'} {change.value}
            {typeof change.value === 'number' ? '%' : ''}
          </span>
          <span className="text-xs text-gray-500 ml-1">from last period</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;