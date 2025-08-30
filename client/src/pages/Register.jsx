import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Button, Card, CardBody, CardHeader, FormControl, FormErrorMessage, FormLabel, Heading, Input, Stack, Text } from '@chakra-ui/react'
import { registerUser, setAuthHeaders } from '../api'
import { AuthContext } from './App'

const RegisterSchema = Yup.object({
  name: Yup.string().min(2).max(80).required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6).required('Required')
})

export default function Register() {
  const { login } = React.useContext(AuthContext)
  return (
    <Stack spacing={6} align="center" minH="70vh" justify="center">
      <Stack spacing={1} textAlign="center">
        <Heading size="lg">Create your account</Heading>
        <Text color="gray.600" _dark={{ color: 'gray.300' }}>Start tracking your tech issues in minutes</Text>
      </Stack>
      <Card w={{ base: '100%', sm: 'sm' }} shadow="lg">
        <CardHeader pb={0}>
          <Heading size="md">Register</Heading>
        </CardHeader>
        <CardBody>
          <Formik
            initialValues={{ name: '', email: '', password: '' }}
            validationSchema={RegisterSchema}
            onSubmit={async (values, actions) => {
              try {
                const u = await registerUser(values)
                setAuthHeaders(u)
                login(u)
              } catch (e) {
                actions.setStatus(e.response?.data?.error || 'Registration failed')
              } finally {
                actions.setSubmitting(false)
              }
            }}
          >
            {({ errors, touched, isSubmitting, status }) => (
              <Form>
                <Stack spacing={4}>
                  <FormControl isInvalid={touched.name && errors.name}>
                    <FormLabel>Name</FormLabel>
                    <Field as={Input} name="name" />
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={touched.email && errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Field as={Input} name="email" type="email" />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={touched.password && errors.password}>
                    <FormLabel>Password</FormLabel>
                    <Field as={Input} name="password" type="password" />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  {status && <div style={{ color: 'red' }}>{status}</div>}
                  <Button colorScheme="teal" type="submit" isLoading={isSubmitting}>Register</Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </Stack>
  )
}
