import { ArrowDown, ArrowUp } from 'lucide-react';
import React from 'react';

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
    <div className="card bg-white dark:bg-gray-800 overflow-hidden animate-fade-in p-4 sm:p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 sm:mb-2 truncate">
            {title}
          </h3>
          <div className="flex items-baseline">
            <p className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white truncate">
              {prefix}{value}{suffix}
            </p>
          </div>
          
          {change !== undefined && (
            <div className="flex items-center mt-1 sm:mt-2">
              {change >= 0 ? (
                <ArrowUp size={14} className="text-success-500 mr-1 flex-shrink-0" />
              ) : (
                <ArrowDown size={14} className="text-danger-500 mr-1 flex-shrink-0" />
              )}
              <span
                className={`text-xs sm:text-sm font-medium ${
                  change >= 0 ? 'text-success-500' : 'text-danger-500'
                }`}
              >
                {Math.abs(change)}%
              </span>
              {changeText && (
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-1 truncate">
                  {changeText}
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className={`p-2 sm:p-3 rounded-lg ${iconBackground} flex-shrink-0 ml-3`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;