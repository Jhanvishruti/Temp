import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Welcome } from './pages/Welcome';
import { Login } from './pages/Login';
import { SignupProjectOwner } from './pages/SignupProjectOwner';
import { SignupContributor } from './pages/SignupContributor';
import { Dashboard } from './pages/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/project-owner" element={<SignupProjectOwner />} />
        <Route path="/signup/contributor" element={<SignupContributor />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;