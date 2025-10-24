"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import Navbar from "../../components/Navbar";
import FeatureErrorBoundary from "../../components/FeatureErrorBoundary";
import {
  Container,
  Heading,
  Text,
  Flex,
  Card,
  TextField,
  Button,
  Box,
  Grid,
} from "@radix-ui/themes";
import { updateUser } from "@/services/userService";

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        username: user.username || "",
      });
    } else {
      // Redirect to login if not authenticated
      router.push("/auth/login");
    }
  }, [user, router]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Create FormData for file upload
      const userData = { ...formData };
      console.log(user.id);

      // Call API to create pet
      await updateUser(user.id, userData);

      // Redirect to the new pet's page
      router.push("/dashboard");
      setSuccess("Profile updated successfully");
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const profileContent = (
    <>
      <Navbar />
      <Container size="2" py="9">
        <Card>
          <Flex direction="column" gap="5" p="4">
            <Heading size="6" align="center">
              My Profile
            </Heading>

            {error && (
              <Text color="red" size="2">
                {error}
              </Text>
            )}

            {success && (
              <Text color="green" size="2">
                {success}
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
                      placeholder="Enter your Username"
                      required
                    />
                  </Box>

                <Box>
                  <Text as="label" size="2" mb="1" htmlFor="email">
                    Email
                  </Text>
                  <TextField.Root
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </Box>

                <Flex gap="3" mt="4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Profile"}
                  </Button>
                  <Button
                    type="button"
                    variant="soft"
                    onClick={() => router.push("/change-password")}
                  >
                    Change Password
                  </Button>
                </Flex>
              </Flex>
            </form>
          </Flex>
        </Card>
      </Container>
    </>
  );

  return (
    <FeatureErrorBoundary featureName="Profile">
      {profileContent}
    </FeatureErrorBoundary>
  );
}
