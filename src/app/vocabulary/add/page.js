"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import Navbar from "../../../components/Navbar";
import FeatureErrorBoundary from "../../../components/FeatureErrorBoundary";
import {
  Container,
  Heading,
  Text,
  Flex,
  Card,
  TextField,
  Button,
  Box,
} from "@radix-ui/themes";
import { createVocabulary } from "@/services/vocabularyService";

export default function AddVocabulary() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    term: "",
    translation: "",
    pronunciation: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {}, []);

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
    setIsLoading(true);

    try {
      const vocabularyData = { ...formData };
      const newVocabulary = await createVocabulary(vocabularyData);
      router.push(`/vocabulary/${newVocabulary.id}`);
    } catch (err) {
      console.error("Error adding vocabulary:", err);
      setError("Failed to add vocabulary. Please try again.");
      setIsLoading(false);
    }
  };

  const addVocabularyContent = (
    <>
      <Navbar />
      <Container size="2" py="9">
        <Card>
          <Flex direction="column" gap="5" p="4">
            <Heading size="6" align="center">
              Add a New Vocabulary Term
            </Heading>

            {error && (
              <Text color="red" size="2">
                {error}
              </Text>
            )}

            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap="4">
                <Box>
                  <Text as="label" size="2" mb="1" htmlFor="term">
                    Term
                  </Text>
                  <TextField.Root
                    id="term"
                    value={formData.term}
                    onChange={handleChange}
                    placeholder="Enter vocabulary term"
                    required
                  />
                </Box>

                <Box>
                  <Text as="label" size="2" mb="1" htmlFor="translation">
                    Translation
                  </Text>
                  <TextField.Root
                    id="translation"
                    value={formData.translation}
                    onChange={handleChange}
                    placeholder="Enter translation"
                    required
                  />
                </Box>

                <Box>
                  <Text as="label" size="2" mb="1" htmlFor="pronunciation">
                    Pronunciation
                  </Text>
                  <TextField.Root
                    id="pronunciation"
                    value={formData.pronunciation}
                    onChange={handleChange}
                    placeholder="Enter pronunciation"
                  />
                </Box>

                <Flex gap="3" mt="4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Adding Vocabulary..." : "Add Vocabulary"}
                  </Button>

                  <Button
                    type="button"
                    variant="soft"
                    onClick={() => router.push("/vocabulary")}
                  >
                    Cancel
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
    <FeatureErrorBoundary featureName="AddVocabulary">
      {addVocabularyContent}
    </FeatureErrorBoundary>
  );
}
