import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Badge, Button, Card, CardBody, CardHeader, CardFooter, Flex, Heading, HStack, SimpleGrid, Spacer, Stack, Text, Tag, Input, InputGroup, InputLeftElement, Tabs, TabList, Tab, TabPanels, TabPanel, Select, Icon, Tooltip } from '@chakra-ui/react'
import { fetchTickets } from '../api'
import { AuthContext } from './App'
import { SearchIcon } from '@chakra-ui/icons'

function PriorityTag({ p }) {
  const color = { LOW: 'gray', MEDIUM: 'blue', HIGH: 'orange', CRITICAL: 'red' }[p] || 'gray'
  return <Badge colorScheme={color}>{p}</Badge>
}

export default function Tickets() {
  const { user } = React.useContext(AuthContext)
  const [tickets, setTickets] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('ALL')
  const [priorityFilter, setPriorityFilter] = React.useState('ALL')

  React.useEffect(() => {
    if (!user) return
    let mounted = true
    fetchTickets().then((t) => { if (mounted) setTickets(t) }).finally(() => setLoading(false))
    return () => { mounted = false }
  }, [user])

  if (!user) return <Text>Please login first.</Text>

  const filtered = tickets.filter(t => {
    const matchesSearch = [t.title, t.description, t.created_by_name, t.assigned_to_name].join(' ').toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <Stack gap={4}>
      <Flex align="center" wrap="wrap" gap={3}>
        <Heading size="lg">Tickets</Heading>
        <Spacer />
        {user.role === 'EMPLOYEE' && (
          <Button as={RouterLink} to="/tickets/new" colorScheme="teal">New Ticket</Button>
        )}
      </Flex>

      <Stack direction={{ base: 'column', md: 'row' }} spacing={3} align="stretch">
        <InputGroup maxW={{ base: '100%', md: '380px' }}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input placeholder="Search tickets…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </InputGroup>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} maxW={{ base: '100%', md: '220px' }}>
          <option value="ALL">All Statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="CLOSED">CLOSED</option>
        </Select>
        <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} maxW={{ base: '100%', md: '220px' }}>
          <option value="ALL">All Priorities</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="CRITICAL">CRITICAL</option>
        </Select>
      </Stack>

      {loading ? <Text>Loading...</Text> : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
          {filtered.map(t => (
            <Card key={t.id} _hover={{ shadow: 'lg', transform: 'translateY(-4px)' }} transition="all 0.2s" h="full">
              <CardHeader pb={2}>
                <HStack justify="space-between" align="start">
                  <Stack spacing={0}>
                    <Heading size="sm" noOfLines={1}>{t.title}</Heading>
                    <HStack spacing={2} color="gray.600" _dark={{ color: 'gray.400' }} fontSize="xs">
                      <Tag size="sm">{t.status}</Tag>
                      <PriorityTag p={t.priority} />
                    </HStack>
                  </Stack>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                <Text color="gray.700" _dark={{ color: 'gray.300' }} noOfLines={4}>{t.description}</Text>
                <Stack mt={3} spacing={1} color="gray.600" _dark={{ color: 'gray.400' }} fontSize="sm">
                  <Text>Creator: {t.created_by_name}</Text>
                  <Text>Assignee: {t.assigned_to_name || '—'}</Text>
                </Stack>
              </CardBody>
              <CardFooter pt={0}>
                {user.role === 'ADMIN' && (
                  <Button as={RouterLink} to={`/tickets/${t.id}/edit`} size="sm" variant="outline">Edit</Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  )
}
