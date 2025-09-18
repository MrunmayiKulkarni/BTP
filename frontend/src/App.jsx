import React from 'react';
import { AppProvider } from './hooks/useWorkoutData';
import { AuthProvider } from './hooks/useAuth';
import AppRouter from './Router';
import './styles/globals.css';

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <div className="App">
          <AppRouter />
        </div>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;