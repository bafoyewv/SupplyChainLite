
import React, { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className,
}) => {
  return (
    <div className={cn('stat-card stack-card', className)}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="stat-title">{title}</h3>
          <div className="stat-value">{value}</div>
          {description && <p className="stat-desc">{description}</p>}
          {trend && (
            <div className="flex items-center mt-1 text-xs">
              {trend === 'up' && (
                <span className="text-green-500 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1 h-3 w-3"
                  >
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                  {trendValue}
                </span>
              )}
              {trend === 'down' && (
                <span className="text-red-500 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1 h-3 w-3"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                  {trendValue}
                </span>
              )}
              {trend === 'neutral' && (
                <span className="text-gray-500 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1 h-3 w-3"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  {trendValue}
                </span>
              )}
            </div>
          )}
        </div>
        {icon && <div className="text-primary opacity-80">{icon}</div>}
      </div>
    </div>
  );
};

export default StatCard;
