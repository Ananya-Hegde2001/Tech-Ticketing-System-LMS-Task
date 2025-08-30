import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Box, Button, Card, CardBody, FormControl, FormErrorMessage, FormLabel, Heading, Input, Select, Stack, Textarea } from '@chakra-ui/react'
import { fetchTickets, listResolvers, updateTicket } from '../api'

const AdminEditSchema = Yup.object({
  title: Yup.string().min(3).max(120).required('Required'),
  description: Yup.string().min(10).max(2000).required('Required'),
  priority: Yup.mixed().oneOf(['LOW','MEDIUM','HIGH','CRITICAL']).required('Required'),
  deadline: Yup.date().nullable(),
  status: Yup.mixed().oneOf(['OPEN','IN_PROGRESS','RESOLVED','CLOSED']).required('Required'),
  assigned_to: Yup.number().nullable()
})

export default function EditTicket() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = React.useState(null)
  const [resolvers, setResolvers] = React.useState([])

  React.useEffect(() => {
    fetchTickets().then(list => setTicket(list.find(t => String(t.id) === id)))
    listResolvers().then(setResolvers)
  }, [id])

  if (!ticket) return <div>Loading…</div>

  return (
    <Stack>
      <Heading size="md">Edit Ticket</Heading>
      <Card>
        <CardBody>
          <Formik
            enableReinitialize
            initialValues={{
              title: ticket.title,
              description: ticket.description,
              priority: ticket.priority,
              deadline: ticket.deadline ? ticket.deadline.slice(0,10) : '',
              status: ticket.status,
              assigned_to: ticket.assigned_to || ''
            }}
            validationSchema={AdminEditSchema}
            onSubmit={async (values, actions) => {
              try {
                const payload = { ...values, assigned_to: values.assigned_to || null }
                await updateTicket(id, payload)
                navigate('/tickets')
              } catch (e) {
                actions.setStatus(e.response?.data?.error || 'Failed to update')
              } finally {
                actions.setSubmitting(false)
              }
            }}
          >
            {({ errors, touched, isSubmitting, status }) => (
              <Form>
                <Stack spacing={4}>
                  <FormControl isInvalid={touched.title && errors.title}>
                    <FormLabel>Title</FormLabel>
                    <Field as={Input} name="title" />
                    <FormErrorMessage>{errors.title}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={touched.description && errors.description}>
                    <FormLabel>Description</FormLabel>
                    <Field as={Textarea} name="description" rows={5} />
                    <FormErrorMessage>{errors.description}</FormErrorMessage>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Assign to</FormLabel>
                    <Field as={Select} name="assigned_to">
                      <option value="">Unassigned</option>
                      {resolvers.map(r => (
                        <option key={r.id} value={r.id}>{r.name} ({r.email})</option>
                      ))}
                    </Field>
                  </FormControl>
                  <FormControl isInvalid={touched.priority && errors.priority}>
                    <FormLabel>Priority</FormLabel>
                    <Field as={Select} name="priority">
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </Field>
                    <FormErrorMessage>{errors.priority}</FormErrorMessage>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Deadline</FormLabel>
                    <Field as={Input} type="date" name="deadline" />
                  </FormControl>
                  <FormControl isInvalid={touched.status && errors.status}>
                    <FormLabel>Status</FormLabel>
                    <Field as={Select} name="status">
                      <option value="OPEN">OPEN</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="CLOSED">CLOSED</option>
                    </Field>
                    <FormErrorMessage>{errors.status}</FormErrorMessage>
                  </FormControl>
                  {status && <Box color="red.500">{status}</Box>}
                  <Button colorScheme="teal" type="submit" isLoading={isSubmitting}>Save</Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </Stack>
  )
}
