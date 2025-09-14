import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const BackButton = ({ to, onClick, className = "" }) => {
  const buttonContent = (
    <div className={`text-white hover:text-yellow-400 transition-colors ${className}`}>
      <ArrowLeft size={24} />
    </div>
  );

  if (to) {
    return <Link to={to}>{buttonContent}</Link>;
  }

  return <button onClick={onClick}>{buttonContent}</button>;
};

export default BackButton;