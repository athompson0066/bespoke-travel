
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AIGenerator from './components/AIGenerator';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';
import { CreditProvider } from './contexts/CreditContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CreditProvider>
        <HashRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-20 flex flex-col">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/generator" element={<AIGenerator />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </HashRouter>
      </CreditProvider>
    </AuthProvider>
  );
};

export default App;
