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
  Popover,
  TextArea,
} from "@radix-ui/themes";
import {
  deleteVocabulary,
  getVocabularyById,
} from "@/services/vocabularyService";
import { getExamplesByVocabularyId } from "@/services/exampleServices";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { getCommentsByVocabularyId } from "@/services/commentService";
import Comments from "@/components/Comments";

export default function Home() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [vocabulary, setVocabulary] = useState([]);
  const [examples, setExamples] = useState([]);
  const params = useParams();
  const vocabularyId = params.id;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [comments, setComments] = useState([]);

  const fetchData = async () => {
    const vocabularyData = await getVocabularyById(vocabularyId);
    setVocabulary(vocabularyData);
    const exampleData = await getExamplesByVocabularyId(vocabularyId);
    setExamples(exampleData);
    const commentData = await getCommentsByVocabularyId(vocabularyId);
    setComments(commentData);
  };

  useEffect(() => {
    fetchData();
  }, [vocabularyId]);

  const handleDelete = async () => {
    try {
      await deleteVocabulary(vocabularyId);
      router.push("/vocabulary");
    } catch (err) {
      console.error("Error deleting vocabulary:", err);
      setError("Failed to delete vocabulary. Please try again.");
      setIsDeleteDialogOpen(false);
    }
  };
  
  const testBtn = () => {
    console.log(comments)
  }

  const vocabularyContent = (
    <>
      <Navbar />
      <Button onClick={() => testBtn()}>
        Test
      </Button>
      <Container size="4" py="9">
        <Flex direction="column" gap="6" align="center">
          <Heading size="9" mb="2">
            {vocabulary.term}
          </Heading>
          <Text size="6">{vocabulary.translation}</Text>
          {isAdmin() ? (
            <Button color="red" onClick={() => setIsDeleteDialogOpen(true)}>
              Delete
            </Button>
          ) : (
            <></>
          )}

          <Box>
            <Heading size="8" mb="2">
              Examples
            </Heading>
          </Box>
        </Flex>
      </Container>

      {examples.map((example) => (
        <Flex key={example.id} direction="row" gap="6" align="center">
          <iframe width="420" height="315" src={example.videoUrl}></iframe>
          <Flex direction="column" gap="6" align="center">
            <Text>Subtitle: {example.subtitle}</Text>
            <Text>Translation: {example.englishSubtitle}</Text>
          </Flex>
        </Flex>
      ))}

      <Container>
        <Flex direction="column" gap="6" align="center">
          <Heading size="8" mb="2">
            User Comments
          </Heading>
          <Card>
            <Comments 
              comments = {comments}
            />
          </Card>
          <Popover.Root>
            <Popover.Trigger>
              <Button variant="soft">
                <ChatBubbleIcon width="16" height="16" />
                Comment
              </Button>
            </Popover.Trigger>
            <Popover.Content width="360px">
              <Flex gap="3">
                <Box flexGrow="1">
                  <TextArea
                    placeholder="Write a comment…"
                    style={{ height: 80 }}
                  />
                  <Flex gap="3" mt="3" justify="between">
                    <Popover.Close>
                      <Button size="1">Comment</Button>
                    </Popover.Close>
                  </Flex>
                </Box>
              </Flex>
            </Popover.Content>
          </Popover.Root>
        </Flex>
      </Container>

      <Dialog.Root
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <Dialog.Content>
          <Dialog.Title>Delete Vocabulary</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Are you sure you want to delete this vocabulary term? This action
            cannot be undone.
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
