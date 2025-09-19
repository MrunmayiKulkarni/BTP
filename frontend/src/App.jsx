import React from 'react';
import { AppProvider } from './hooks/useWorkoutData';
import { AuthProvider } from './hooks/useAuth';
import AppRouter from './Router';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <div className="App">
          <AppRouter />
        </div>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;