import React from 'react';
import Card from './Card';

const StatCard = ({ title, value, change }) => {
  const isPositive = change.startsWith('+');
  const changeColorClass = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <Card>
      <p className="text-gray-500 text-sm mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className={changeColorClass + " text-sm"}>{change}</p>
    </Card>
  );
};

export default StatCard;