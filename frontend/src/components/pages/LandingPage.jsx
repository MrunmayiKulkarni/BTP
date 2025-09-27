import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div 
      className="relative min-h-screen flex flex-col items-center justify-center text-white bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto=format&fit=crop')" }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="relative z-10 text-center p-8 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-shadow-lg">
          Track Your Grind.
          <br />
          <span className="text-yellow-400">See Your Gains.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl mx-auto">
          The ultimate companion for your fitness journey. Log every set, track your progress, and crush your goals.
        </p>
        <Link
          to="/login"
          className="group flex items-center justify-center gap-3 mx-auto bg-yellow-500 text-black font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-yellow-500/20 transition-all duration-300 hover:bg-yellow-400 hover:scale-105 transform"
        >
          Log Your Workout
          <ArrowRight className="transition-transform duration-300 group-hover:translate-x-2" />
        </Link>
      </div>

      <div className="absolute bottom-4 text-center w-full text-sm text-gray-400 z-10">
        <p>Photo by <a href="https://unsplash.com/@sargale" className="underline hover:text-white">Sven Mieke</a> on <a href="https://unsplash.com" className="underline hover:text-white">Unsplash</a></p>
      </div>
    </div>
  );
};

export default LandingPage;