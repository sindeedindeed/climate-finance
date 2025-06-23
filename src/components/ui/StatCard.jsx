import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';

const StatCard = ({ title, value, change, icon = null, color = 'primary' }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef(null);

  const isPositive = typeof change === 'string' && change.startsWith('+');
  const isNumericValue = typeof value === 'number' || (!isNaN(parseFloat(value)) && !value.toString().includes('$'));

  useEffect(() => {
    if (isNumericValue && typeof value === 'number') {
      const timer = setTimeout(() => {
        setIsVisible(true);
        const duration = 1500;
        const startTime = Date.now();
        
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const currentValue = Math.floor(value * progress);
          
          setAnimatedValue(currentValue);
          
          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animate);
          }
        };
        
        animationRef.current = requestAnimationFrame(animate);
      }, 200);

      return () => {
        clearTimeout(timer);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else {
      setAnimatedValue(value);
      setIsVisible(true);
    }
  }, [value, isNumericValue]);

  // ...existing code...

  return (
    <Card 
      padding="p-4 sm:p-6" 
      className="h-full flex flex-col justify-between hover:shadow-lg transition-shadow duration-200"
      role="article"
      aria-label={`${title}: ${value}${change ? `, ${change}` : ''}`}
    >
      {/* ...existing content... */}
    </Card>
  );
};
