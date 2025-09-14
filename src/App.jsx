import React from 'react';
import { AppProvider } from './hooks/useWorkoutData';
import AppRouter from './Router';
import './styles/globals.css';

function App() {
  return (
    <AppProvider>
      <div className="App">
        <AppRouter />
      </div>
    </AppProvider>
  );
}

export default App;