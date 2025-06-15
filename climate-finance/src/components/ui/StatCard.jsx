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
        h-full min-h-[140px]
        ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}
        transition-all duration-300
      `}
      padding={true}
    >
      <div className="flex flex-col h-full text-center">
        {/* Icon and Title - Centered */}
        <div className="flex flex-col items-center mb-4">
          {icon && (
            <div className={`
              p-2 rounded-xl 
              ${colorVariants[color]}
              group-hover:scale-110 
              transition-transform duration-300
              mb-2
            `}>
              {icon}
            </div>
          )}
          <p className="text-gray-600 text-sm font-medium leading-tight text-center">{title}</p>
        </div>
        
        {/* Value - Centered and taking available space */}
        <div className="flex-1 flex items-center justify-center mb-4">
          <h3 className="text-3xl font-bold text-gray-900 tracking-tight text-center">
            {formatDisplayValue(animatedValue)}
          </h3>
        </div>
        
        {/* Change indicator - Centered at bottom */}
        <div className="flex justify-center">
          <div className={`
            inline-flex items-center gap-1 px-3 py-1.5 
            rounded-full text-xs font-semibold
            ${changeColorClass}
          `}>
            {isPositive ? (
              <TrendingUp size={12} className="text-success-600" />
            ) : (
              <TrendingDown size={12} className="text-error-600" />
            )}
            <span className="leading-none">{change}</span>
          </div>
        </div>
        
        {/* Progress indicator for percentage values */}
        {change.includes('%') && (
          <div className="mt-3">
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
      </div>
    </Card>
  );
};

export default StatCard;