import React from 'react';
import { Dumbbell } from 'lucide-react';

const Header = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
        <Dumbbell className="text-yellow-400" />
        {title}
      </h1>
      {subtitle && (
        <p className="text-blue-200">{subtitle}</p>
      )}
    </div>
  );
};

export default Header;