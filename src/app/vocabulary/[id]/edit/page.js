"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../../contexts/AuthContext";
import Navbar from "../../../../components/Navbar";
import FeatureErrorBoundary from "../../../../components/FeatureErrorBoundary";
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
import {
  createVocabulary,
  getVocabularyById,
  updateVocabulary,
} from "@/services/vocabularyService";

export default function EditVocabulary() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const vocabularyId = params.id;
  const [formData, setFormData] = useState({
    term: "",
    translation: "",
    pronunciation: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    const vocabData = await getVocabularyById(vocabularyId);

    setFormData({
      term: vocabData.term,
      translation: vocabData.translation,
      pronunciation: vocabData.pronunciation,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      const updatedVocabulary = await updateVocabulary(vocabularyId, vocabularyData);
      router.push(`/vocabulary/${updatedVocabulary.id}`);
    } catch (err) {
      console.error("Error updating vocabulary:", err);
      setError("Failed to update vocabulary. Please try again.");
      setIsLoading(false);
    }
  };

  const editVocabularyContent = (
    <>
      <Navbar />
      <Container size="2" py="9">
        <Card>
          <Flex direction="column" gap="5" p="4">
            <Heading size="6" align="center">
              Update Vocabulary Term
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
                    {isLoading ? "Updating Vocabulary..." : "Update Vocabulary"}
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
    <FeatureErrorBoundary featureName="EditVocabulary">
      {editVocabularyContent}
    </FeatureErrorBoundary>
  );
}
