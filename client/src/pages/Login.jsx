import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Box, Button, Card, CardBody, FormControl, FormErrorMessage, FormLabel, Heading, Input, Stack, Text, CardHeader } from '@chakra-ui/react'
import { login, setAuthHeaders } from '../api'
import { AuthContext } from './App'

const LoginSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Required')
})

export default function Login() {
  const { login: setUser, user } = React.useContext(AuthContext)

  React.useEffect(() => {
    if (user) setAuthHeaders(user)
  }, [user])

  return (
    <Stack spacing={6} align="center" minH="70vh" justify="center">
      <Stack spacing={1} textAlign="center">
        <Heading size="lg">Welcome back</Heading>
        <Text color="gray.600" _dark={{ color: 'gray.300' }}>Sign in to continue to Tech Ticketing</Text>
      </Stack>
      <Card w={{ base: '100%', sm: 'sm' }} shadow="lg">
        <CardHeader pb={0}>
          <Heading size="md">Login</Heading>
        </CardHeader>
        <CardBody>
          <Formik
            initialValues={{ email: 'employee1@example.com', password: 'password123' }}
            validationSchema={LoginSchema}
            onSubmit={async (values, actions) => {
              try {
                const u = await login(values.email, values.password)
                setAuthHeaders(u)
                setUser(u)
              } catch (e) {
                actions.setStatus(e.response?.data?.error || 'Login failed')
              } finally {
                actions.setSubmitting(false)
              }
            }}
          >
            {({ errors, touched, isSubmitting, status }) => (
              <Form>
                <Stack spacing={4}>
                  <FormControl isInvalid={touched.email && errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Field as={Input} name="email" placeholder="you@example.com" />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={touched.password && errors.password}>
                    <FormLabel>Password</FormLabel>
                    <Field as={Input} type="password" name="password" placeholder="••••••••" />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  {status && <Text color="red.500">{status}</Text>}
                  <Button colorScheme="teal" type="submit" isLoading={isSubmitting}>Login</Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
      <Box color="gray.600" _dark={{ color: 'gray.300' }} fontSize="sm" textAlign="center">
        Try seeded accounts: employee1@example.com, admin@example.com, resolver1@example.com (password: password123)
      </Box>
    </Stack>
  )
}
