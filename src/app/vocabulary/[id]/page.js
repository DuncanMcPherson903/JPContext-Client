"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import Navbar from "../../../components/Navbar";
import FeatureErrorBoundary from "../../../components/FeatureErrorBoundary";
import {
  Container,
  Heading,
  Text,
  Flex,
  Card,
  Box,
  Button,
  Dialog,
} from "@radix-ui/themes";
import Link from "next/link";
import Image from "next/image";
import {
  deleteVocabulary,
  getAllVocabulary,
  getVocabularyById,
} from "@/services/vocabularyService";
import { getAllExamples } from "@/services/exampleServices";

export default function Home() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [vocabulary, setVocabulary] = useState([]);
  const [examples, setExamples] = useState([]);
  const params = useParams();
  const vocabularyId = params.id;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchData = async () => {
    const vocabularyData = await getVocabularyById(vocabularyId);
    setVocabulary(vocabularyData);
    const exampleData = await getAllExamples();
    setExamples(exampleData);
  };

  useEffect(() => {
    fetchData();
  }, [user, router, vocabularyId]);

  const handleDelete = async () => {
    try {
      await deleteVocabulary(vocabularyId);
      router.push('/vocabulary');
    } catch (err) {
      console.error('Error deleting vocabulary:', err);
      setError('Failed to delete vocabulary. Please try again.');
      setIsDeleteDialogOpen(false);
    }
  };

  const vocabularyContent = (
    <>
      <Navbar />
      <Container size="4" py="9">
        <Flex direction="column" gap="6" align="center">
          <Heading size="9" mb="2">
            {vocabulary.term}
          </Heading>
          <Text size="6">{vocabulary.translation}</Text>
          {isAdmin() ? (
            <Button color="red" onClick={() => setIsDeleteDialogOpen(true)}>Delete</Button>
          ) : (
            <></>
          )}
          
          <Box>
            <Heading size="8" mb="2">
              Examples
            </Heading>
            <Button onClick={() => router.push('/examples/add')}>Add an Example</Button>
          </Box>
        </Flex>
      </Container>
      <Dialog.Root open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <Dialog.Content>
          <Dialog.Title>Delete Vocabulary</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Are you sure you want to delete this vocabulary term? This action cannot be undone.
          </Dialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft">Cancel</Button>
            </Dialog.Close>
            <Button color="red" onClick={handleDelete}>
              Delete
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );

  return (
    <FeatureErrorBoundary featureName="Vocabulary">
      {vocabularyContent}
    </FeatureErrorBoundary>
  );
}
