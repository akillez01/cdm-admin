import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change?: number;
  changeText?: string;
  prefix?: string;
  suffix?: string;
  iconBackground?: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  icon,
  change,
  changeText,
  prefix = '',
  suffix = '',
  iconBackground = 'bg-primary-100 dark:bg-primary-800',
}) => {
  return (
    <div className="card bg-white dark:bg-gray-800 overflow-hidden animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {prefix}{value}{suffix}
            </p>
          </div>
          
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change >= 0 ? (
                <ArrowUp size={16} className="text-success-500 mr-1" />
              ) : (
                <ArrowDown size={16} className="text-danger-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  change >= 0 ? 'text-success-500' : 'text-danger-500'
                }`}
              >
                {Math.abs(change)}%
              </span>
              {changeText && (
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                  {changeText}
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${iconBackground}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;