import React from 'react';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`text-white hover:text-yellow-400 transition-colors ${className}`}
    >
      <ArrowLeft size={24} />
    </button>
  );
};

export default BackButton;