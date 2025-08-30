import React from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Box, Container } from '@chakra-ui/react'
import Login from './Login.jsx'
import Tickets from './Tickets.jsx'
import NewTicket from './NewTicket.jsx'
import EditTicket from './EditTicket.jsx'
import { setAuthHeaders } from '../api.js'
import Register from './Register.jsx'
import Navbar from '../components/Navbar.jsx'

function useAuth() {
  const [user, setUser] = React.useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const navigate = useNavigate();
  const login = (u) => { localStorage.setItem('user', JSON.stringify(u)); setUser(u); navigate('/tickets'); };
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    // Ensure axios stops sending auth headers after logout
    setAuthHeaders(null);
    navigate('/');
  };
  return { user, login, logout };
}

export const AuthContext = React.createContext(null);

export default function App() {
  const auth = useAuth();
  React.useEffect(() => {
    if (auth.user) setAuthHeaders(auth.user);
  }, [auth.user]);
  return (
    <AuthContext.Provider value={auth}>
      <Navbar />
      <Container maxW="6xl" py={{ base: 4, md: 8 }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/tickets/new" element={<NewTicket />} />
          <Route path="/tickets/:id/edit" element={<EditTicket />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </AuthContext.Provider>
  )
}
