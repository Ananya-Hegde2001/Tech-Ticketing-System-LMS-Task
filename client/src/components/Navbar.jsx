import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Container, Flex, HStack, IconButton, Link, Button, useColorMode, useDisclosure, Collapse, Spacer, Avatar, Text, Tag, Divider, VStack } from '@chakra-ui/react'
import { MoonIcon, SunIcon, HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { AuthContext } from '../pages/App'

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onToggle } = useDisclosure()
  const { user, logout } = React.useContext(AuthContext)

  const initials = (name) => name?.split(' ').map(s => s[0]).slice(0,2).join('')?.toUpperCase() || ''
  const roleColor = { EMPLOYEE: 'blue', ADMIN: 'purple', RESOLVER: 'green' }[user?.role] || 'gray'

  return (
    <Box as="header" position="sticky" top="0" zIndex="100" bg="white" shadow="sm" borderBottomWidth="1px" borderColor="blackAlpha.100" _dark={{ bg: 'gray.800', borderColor: 'whiteAlpha.200' }}>
      <Container maxW="6xl">
        <Flex py={3} align="center" gap={2}>
          <HStack spacing={3}>
            <IconButton display={{ base: 'inline-flex', md: 'none' }} onClick={onToggle} variant="ghost" icon={isOpen ? <CloseIcon /> : <HamburgerIcon />} aria-label="Toggle Menu" />
            <Link as={RouterLink} to="/tickets" fontWeight="bold" fontSize="lg">Tech Ticketing</Link>
            {user && (
              <Tag size="sm" colorScheme={roleColor} variant="subtle" display={{ base: 'none', md: 'inline-flex' }}>
                {user.role}
              </Tag>
            )}
          </HStack>
          <Spacer />
          <HStack spacing={3} display={{ base: 'none', md: 'flex' }}>
            <Link as={RouterLink} to="/tickets">Tickets</Link>
            {user?.role === 'EMPLOYEE' && (
              <Button as={RouterLink} to="/tickets/new" size="sm" colorScheme="teal">New Ticket</Button>
            )}
            <IconButton size="sm" onClick={toggleColorMode} aria-label="Toggle color mode" icon={colorMode === 'light' ? <MoonIcon/> : <SunIcon/>} />
            {user ? (
              <HStack spacing={3}>
                <HStack spacing={2}>
                  <Avatar name={user.name} size="sm">{initials(user.name)}</Avatar>
                  <VStack spacing={0} align="start">
                    <Text fontSize="sm" noOfLines={1} maxW="28ch">{user.name}</Text>
                    <Tag size="xs" colorScheme={roleColor} variant="subtle">{user.role}</Tag>
                  </VStack>
                </HStack>
                <Divider orientation="vertical" h="20px" />
                <Button size="sm" onClick={logout}>Logout</Button>
              </HStack>
            ) : (
              <>
                <Button as={RouterLink} to="/register" variant="outline" size="sm">Register</Button>
                <Button as={RouterLink} to="/" size="sm">Login</Button>
              </>
            )}
          </HStack>
        </Flex>
        <Collapse in={isOpen} animateOpacity>
          <Box pb={4} display={{ md: 'none' }}>
            <Flex direction="column" gap={3}>
              {user && (
                <HStack>
                  <Avatar name={user.name} size="sm">{initials(user.name)}</Avatar>
                  <VStack spacing={0} align="start">
                    <Text fontSize="sm">{user.name}</Text>
                    <Tag size="xs" colorScheme={roleColor} variant="subtle">{user.role}</Tag>
                  </VStack>
                </HStack>
              )}
              <Divider />
              <Link as={RouterLink} to="/tickets" onClick={onToggle}>Tickets</Link>
              {user?.role === 'EMPLOYEE' && (
                <Button as={RouterLink} to="/tickets/new" colorScheme="teal" onClick={onToggle}>New Ticket</Button>
              )}
              <IconButton onClick={toggleColorMode} aria-label="Toggle color mode" icon={colorMode === 'light' ? <MoonIcon/> : <SunIcon/>} />
              {user ? (
                <Button onClick={() => { logout(); onToggle(); }}>Logout</Button>
              ) : (
                <>
                  <Button as={RouterLink} to="/register" variant="outline" onClick={onToggle}>Register</Button>
                  <Button as={RouterLink} to="/" onClick={onToggle}>Login</Button>
                </>
              )}
            </Flex>
          </Box>
        </Collapse>
      </Container>
    </Box>
  )
}
