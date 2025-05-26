import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import { getProfile } from './services/api';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek profile saat App mount
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        console.log(data);
      } catch (error) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
