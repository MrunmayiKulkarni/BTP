import React from 'react';
import { AppProvider } from './hooks/useWorkoutData';
import Router from './Router';
import './styles/globals.css';

function App() {
  return (
    <AppProvider>
      <div className="App">
        <Router />
      </div>
    </AppProvider>
  );
}

export default App;