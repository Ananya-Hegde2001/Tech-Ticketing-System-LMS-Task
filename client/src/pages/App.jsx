import React from 'react'
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import { Box, Button, Container, Flex, Heading, Spacer } from '@chakra-ui/react'
import Login from './Login.jsx'
import Tickets from './Tickets.jsx'
import NewTicket from './NewTicket.jsx'
import EditTicket from './EditTicket.jsx'
import { setAuthHeaders } from '../api.js'
import Register from './Register.jsx'

function useAuth() {
  const [user, setUser] = React.useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const navigate = useNavigate();
  const login = (u) => { localStorage.setItem('user', JSON.stringify(u)); setUser(u); navigate('/tickets'); };
  const logout = () => { localStorage.removeItem('user'); setUser(null); navigate('/'); };
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
      <Container maxW="6xl" py={6}>
        <Flex mb={6} align="center">
          <Heading size="md">Tech Ticketing</Heading>
          <Spacer />
          <Flex gap={2}>
            <Button as={Link} to="/tickets" variant="ghost">Tickets</Button>
            {auth.user?.role === 'EMPLOYEE' && (
              <Button as={Link} to="/tickets/new" colorScheme="teal">New Ticket</Button>
            )}
            {auth.user ? (
              <Button onClick={auth.logout}>Logout</Button>
            ) : (
              <>
                <Button as={Link} to="/register" variant="outline">Register</Button>
                <Button as={Link} to="/">Login</Button>
              </>
            )}
          </Flex>
        </Flex>
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
