import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import StatisticsPage from './pages/StatisticsPage';
import GraphPage from './pages/GraphPage';
import ImageManipulationPage from './pages/ImageManipulationPage';
import UploadsPage from './pages/UploadsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}>
          <Route path="statistics" element={<ProtectedRoute><StatisticsPage /></ProtectedRoute>} />
          <Route path="graph" element={<ProtectedRoute><GraphPage /></ProtectedRoute>} />
          <Route path="images" element={<ProtectedRoute><ImageManipulationPage /></ProtectedRoute>} />
          <Route path="uploads" element={<ProtectedRoute><UploadsPage /></ProtectedRoute>} />
        </Route>
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
