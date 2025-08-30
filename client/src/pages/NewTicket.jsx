import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Button, Card, CardBody, CardHeader, FormControl, FormErrorMessage, FormLabel, Heading, Input, Stack, Textarea, Text } from '@chakra-ui/react'
import { createTicket } from '../api'
import { AuthContext } from './App'
import { useNavigate } from 'react-router-dom'

const TicketSchema = Yup.object({
  title: Yup.string().min(3).max(120).required('Required'),
  description: Yup.string().min(10).max(2000).required('Required')
})

export default function NewTicket() {
  const { user } = React.useContext(AuthContext)
  const navigate = useNavigate()
  if (!user) return null

  return (
    <Stack>
      <Stack spacing={1} mb={2}>
        <Heading size="lg">Create Ticket</Heading>
        <Text color="gray.600" _dark={{ color: 'gray.300' }}>Provide a clear title and detailed description to help resolvers act quickly.</Text>
      </Stack>
      <Card shadow="lg">
        <CardHeader pb={0}>
          <Heading size="md">Ticket details</Heading>
        </CardHeader>
        <CardBody>
          <Formik
            initialValues={{ title: '', description: '' }}
            validationSchema={TicketSchema}
            onSubmit={async (values, actions) => {
              try {
                await createTicket(values)
                navigate('/tickets')
              } catch (e) {
                actions.setStatus(e.response?.data?.error || 'Failed to create')
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
                    <Field as={Input} name="title" placeholder="Short issue title" />
                    <FormErrorMessage>{errors.title}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={touched.description && errors.description}>
                    <FormLabel>Description</FormLabel>
                    <Field as={Textarea} name="description" placeholder="Describe the issue…" rows={5} />
                    <FormErrorMessage>{errors.description}</FormErrorMessage>
                  </FormControl>
                  {status && <div style={{ color: 'red' }}>{status}</div>}
                  <Button colorScheme="teal" type="submit" isLoading={isSubmitting}>Create</Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </Stack>
  )
}
