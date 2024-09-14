import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import DatasetsPage from './pages/DatasetsPage';
import UploadPage from './pages/UploadPage';
import ProtectedRoute from './components/ProtectedRoute';
import ImagePage from './pages/ImagePage';
import UploadImage from './pages/UploadImage';
import TextProcessingPage from './pages/TextProcessingPage';
import TSNEPage from './pages/TSNEPage';
import TextAnalysisPage from './pages/TextAnalysisPage';
import AccountInfo from './pages/AccountInfo'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
          <Route path="datasets" element={<DatasetsPage />} />
          <Route path="images" element={<ImagePage />} />
          <Route path="text_processing" element={<TextProcessingPage />} />
          <Route path="tsne" element={<TSNEPage />} />
          <Route path="text_analysis" element={<TextAnalysisPage />} />
        </Route>
        <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
        <Route path="/account-info" element={<ProtectedRoute><AccountInfo /></ProtectedRoute>} />
        <Route path="/upload_image" element={<UploadImage />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;