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
  Box,
  Button,
  Dialog,
  Card,
  Popover,
  TextArea,
} from "@radix-ui/themes";
import Link from "next/link";
import { deleteExample, getExampleById } from "@/services/exampleServices";
import { getVocabularyByExampleId } from "@/services/vocabularyService";
import { ChatBubbleIcon } from "@radix-ui/react-icons";

export default function Home() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const params = useParams();
  const exampleId = params.id;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [example, setExample] = useState({});
  const [vocabularies, setVocabularies] = useState([]);

  const fetchData = async () => {
    const exampleData = await getExampleById(exampleId);
    setExample(exampleData);
    const vocabularyData = await getVocabularyByExampleId(exampleId);
    setVocabularies(vocabularyData);
  };

  useEffect(() => {
    fetchData();
  }, [user, router, exampleId]);

  const handleDelete = async () => {
    try {
      await deleteExample(exampleId);
      router.push("/examples");
    } catch (err) {
      console.error("Error deleting example:", err);
      setError("Failed to delete example. Please try again.");
      setIsDeleteDialogOpen(false);
    }
  };

  const vocabularyContent = (
    <>
      <Navbar />
      <Container size="4" py="9">
        <Flex direction="column" gap="6" align="center">
          <Heading size="9" mb="2">
            {example.title}
          </Heading>
          {isAdmin() ? (
            <Button color="red" onClick={() => setIsDeleteDialogOpen(true)}>
              Delete
            </Button>
          ) : (
            <></>
          )}
        </Flex>
      </Container>
      <Flex direction="row" gap="6" align="center">
        <iframe width="420" height="315" src={example.videoUrl}></iframe>
        <Flex direction="column" gap="6" align="center">
          <Text>Subtitle: {example.subtitle}</Text>
          <Text>Translation: {example.englishSubtitle}</Text>
        </Flex>
      </Flex>

      <Container size="4" py="9">
        <Flex direction="column" gap="6" align="center">
          <Heading size="8" mb="2">
            Vocabulary Used
          </Heading>
          <Flex gap="6" wrap="wrap">
            {vocabularies.map((vocabulary) => (
              <Link
                href={`/vocabulary/${vocabulary.id}`}
                key={vocabulary.id}
                style={{ textDecoration: "none" }}
              >
                <Card style={{ flex: "1 1 300px" }}>
                  <Flex direction="column" gap="3">
                    <Heading size="4">{vocabulary.term}</Heading>
                    <Text>{vocabulary.translation}</Text>
                  </Flex>
                </Card>
              </Link>
            ))}
          </Flex>
        </Flex>
      </Container>

      <Dialog.Root
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <Dialog.Content>
          <Dialog.Title>Delete Example</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Are you sure you want to delete this example? This action cannot be
            undone.
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
