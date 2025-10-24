'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '../../../services/authService';
import { useAuth } from '../../../contexts/AuthContext';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import FeatureErrorBoundary from '../../../components/FeatureErrorBoundary';
import { Container, Heading, Text, Flex, Card, TextField, Button, Box, Grid } from '@radix-ui/themes';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = formData;
      const userData = await register(registrationData);
      login(userData);
      router.push('/');
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const registerContent = (
    <>
      <Navbar />
      <Container size="2" py="9">
        <Card>
          <Flex direction="column" gap="5" p="4">
            <Heading size="6" align="center">Create a JPContext Account</Heading>

            {error && (
              <Text color="red" size="2">
                {error}
              </Text>
            )}

            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap="4">
                  <Box>
                    <Text as="label" size="2" mb="1" htmlFor="username">
                      Username
                    </Text>
                    <TextField.Root
                      id="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      required
                    />
                  </Box>

                  <Box>
                    <Text as="label" size="2" mb="1" htmlFor="email">
                      Email
                    </Text>
                    <TextField.Root
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </Box>

                <Grid columns="2" gap="4">
                  <Box>
                    <Text as="label" size="2" mb="1" htmlFor="password">
                      Password
                    </Text>
                    <TextField.Root
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      required
                    />
                  </Box>

                  <Box>
                    <Text as="label" size="2" mb="1" htmlFor="confirmPassword">
                      Confirm Password
                    </Text>
                    <TextField.Root
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                    />
                  </Box>
                </Grid>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Register'}
                </Button>
              </Flex>
            </form>

            <Text size="2" align="center">
              Already have an account?{' '}
              <Link href="/auth/login" style={{ color: 'var(--accent-9)' }}>
                Login
              </Link>
            </Text>
          </Flex>
        </Card>
      </Container>
    </>
  );

  return (
    <FeatureErrorBoundary featureName="Register">
      {registerContent}
    </FeatureErrorBoundary>
  );
}
