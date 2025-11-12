import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const BackButton = ({ to, onClick, className = "" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  const buttonContent = (
    <div className={`text-white hover:text-yellow-400 transition-colors ${className}`}>
      <ArrowLeft size={24} />
    </div>
  );

  if (to) {
    return <Link to={to}>{buttonContent}</Link>;
  }

  return <button onClick={handleBack}>{buttonContent}</button>;
};

export default BackButton;