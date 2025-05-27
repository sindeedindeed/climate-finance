import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from './Card';

const StatCard = ({ title, value, change, icon = null, color = 'primary' }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const isPositive = change.startsWith('+');
  const isNumericValue = typeof value === 'number' || (!isNaN(parseFloat(value)) && !value.toString().includes('$'));
  
  const changeColorClass = isPositive 
    ? 'text-success-600 bg-success-50' 
    : 'text-error-600 bg-error-50';

  const colorVariants = {
    primary: 'text-primary-600 bg-primary-50',
    success: 'text-success-600 bg-success-50',
    warning: 'text-warning-600 bg-warning-50',
    error: 'text-error-600 bg-error-50',
  };

  // Animation for numeric values
  useEffect(() => {
    if (isNumericValue && typeof value === 'number') {
      const timer = setTimeout(() => {
        setIsVisible(true);
        const duration = 1500;
        const steps = 60;
        const increment = value / steps;
        let current = 0;
        
        const counter = setInterval(() => {
          current += increment;
          if (current >= value) {
            setAnimatedValue(value);
            clearInterval(counter);
          } else {
            setAnimatedValue(Math.floor(current));
          }
        }, duration / steps);

        return () => clearInterval(counter);
      }, 200);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
      setAnimatedValue(value);
    }
  }, [value, isNumericValue]);

  const formatDisplayValue = (val) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <Card 
      hover 
      className={`
        group
        ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            {icon && (
              <div className={`
                p-2 rounded-xl 
                ${colorVariants[color]}
                group-hover:scale-110 
                transition-transform duration-300
              `}>
                {icon}
              </div>
            )}
            <p className="text-gray-600 text-sm font-medium">{title}</p>
          </div>
          
          <div className="mb-3">
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
              {formatDisplayValue(animatedValue)}
            </h3>
          </div>
          
          <div className={`
            inline-flex items-center gap-1 px-2 py-1 
            rounded-full text-xs font-semibold
            ${changeColorClass}
          `}>
            {isPositive ? (
              <TrendingUp size={12} className="text-success-600" />
            ) : (
              <TrendingDown size={12} className="text-error-600" />
            )}
            <span>{change}</span>
          </div>
        </div>
        
        {/* Decorative Element */}
        <div className="opacity-20 group-hover:opacity-30 transition-opacity duration-300">
          <div className={`
            w-12 h-12 rounded-xl 
            ${colorVariants[color]}
            flex items-center justify-center
          `}>
            {icon || <div className="w-6 h-6 bg-current rounded opacity-50"></div>}
          </div>
        </div>
      </div>
      
      {/* Progress indicator for percentage values */}
      {change.includes('%') && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`
                h-1.5 rounded-full transition-all duration-1000 ease-out
                ${isPositive ? 'bg-success-500' : 'bg-error-500'}
              `}
              style={{ 
                width: `${Math.min(Math.abs(parseFloat(change)), 100)}%`,
                transitionDelay: '500ms'
              }}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default StatCard;