import React from 'react';
import { ChartData } from '../../types';

interface ChartComponentProps {
  title: string;
  description?: string;
  chartData: ChartData;
  chartType: 'bar' | 'line' | 'pie' | 'doughnut';
  className?: string;
}

// This is a mock component since we don't have an actual chart library installed
// In a real application, you would use a library like Chart.js or Recharts
const ChartComponent: React.FC<ChartComponentProps> = ({
  title,
  description,
  chartData,
  chartType,
  className = '',
}) => {
  return (
    <div className={`card bg-white dark:bg-gray-800 ${className}`}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            )}
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full h-64 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400 italic">
              [Esta é uma visualização de gráfico do tipo {chartType}]
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-3">
          {chartData.datasets.map((dataset, index) => (
            <div key={index} className="flex items-center">
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{
                  backgroundColor: Array.isArray(dataset.backgroundColor)
                    ? dataset.backgroundColor[0]
                    : dataset.backgroundColor || '#003B4D'
                }}
              ></span>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {dataset.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;