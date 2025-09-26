import React from 'react';

const StatCard = ({ title, value, color, growth, icon }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-gradient-to-br from-blue-50/80 to-blue-100/50',
          iconBg: 'bg-gradient-to-br from-blue-900 to-blue-700',
          text: 'text-blue-900',
          trend: 'text-blue-900',
          border: 'border-blue-200/60',
          shadow: 'shadow-blue-900/5',
          hoverBorder: 'hover:border-blue-300/60',
          hoverShadow: 'hover:shadow-blue-900/10'
        };
      case 'orange':
        return {
          bg: 'bg-gradient-to-br from-orange-50/80 to-orange-100/50',
          iconBg: 'bg-gradient-to-br from-orange-600 to-orange-500',
          text: 'text-orange-700',
          trend: 'text-orange-600',
          border: 'border-orange-200/60',
          shadow: 'shadow-orange-900/5',
          hoverBorder: 'hover:border-orange-300/60',
          hoverShadow: 'hover:shadow-orange-900/10'
        };
      case 'indigo':
        return {
          bg: 'bg-gradient-to-br from-indigo-50/80 to-indigo-100/50',
          iconBg: 'bg-gradient-to-br from-indigo-900 to-indigo-700',
          text: 'text-indigo-900',
          trend: 'text-indigo-600',
          border: 'border-indigo-200/60',
          shadow: 'shadow-indigo-900/5',
          hoverBorder: 'hover:border-indigo-300/60',
          hoverShadow: 'hover:shadow-indigo-900/10'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-blue-50/80 to-blue-100/50',
          iconBg: 'bg-gradient-to-br from-blue-900 to-blue-700',
          text: 'text-blue-900',
          trend: 'text-blue-900',
          border: 'border-blue-200/60',
          shadow: 'shadow-blue-900/5',
          hoverBorder: 'hover:border-blue-300/60',
          hoverShadow: 'hover:shadow-blue-900/10'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border ${colors.border} p-6 transition-all duration-300 ${colors.shadow} ${colors.hoverBorder} ${colors.hoverShadow} hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`${colors.bg} p-3 rounded-xl`}>
            <div className={`${colors.text} w-6 h-6`}>
              {icon}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
          </div>
        </div>
        {growth && (
          <div className={`flex items-center ${colors.trend} text-sm font-medium`}>
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d={growth.includes('-') 
                  ? "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" 
                  : "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"} />
            </svg>
            {growth}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;