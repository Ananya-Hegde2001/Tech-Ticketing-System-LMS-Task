import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Badge, Button, Card, CardBody, Flex, Heading, HStack, Link, SimpleGrid, Spacer, Stack, Text } from '@chakra-ui/react'
import { fetchTickets } from '../api'
import { AuthContext } from './App'

function PriorityTag({ p }) {
  const color = { LOW: 'gray', MEDIUM: 'blue', HIGH: 'orange', CRITICAL: 'red' }[p] || 'gray'
  return <Badge colorScheme={color}>{p}</Badge>
}

export default function Tickets() {
  const { user } = React.useContext(AuthContext)
  const [tickets, setTickets] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let mounted = true
    fetchTickets().then((t) => { if (mounted) setTickets(t) }).finally(() => setLoading(false))
    return () => { mounted = false }
  }, [])

  if (!user) return <Text>Please login first.</Text>

  return (
    <Stack>
      <Flex align="center">
        <Heading size="md">Tickets</Heading>
        <Spacer />
        {user.role === 'EMPLOYEE' && (
          <Button as={RouterLink} to="/tickets/new" colorScheme="teal">New Ticket</Button>
        )}
      </Flex>
      {loading ? <Text>Loading...</Text> : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {tickets.map(t => (
            <Card key={t.id} _hover={{ shadow: 'md' }}>
              <CardBody>
                <HStack justify="space-between">
                  <Heading size="sm">{t.title}</Heading>
                  <PriorityTag p={t.priority} />
                </HStack>
                <Text mt={2} color="gray.700">{t.description}</Text>
                <HStack mt={2} spacing={4} color="gray.600" fontSize="sm">
                  <Text>Created by: {t.created_by_name}</Text>
                  <Text>Assigned to: {t.assigned_to_name || '—'}</Text>
                  <Text>Status: {t.status}</Text>
                </HStack>
                {user.role === 'ADMIN' && (
                  <Box mt={3}>
                    <Button as={RouterLink} to={`/tickets/${t.id}/edit`}>Edit</Button>
                  </Box>
                )}
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  )
}
