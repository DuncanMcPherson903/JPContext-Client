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
  Popover,
  TextField,
  Card,
  Inset,
} from "@radix-ui/themes";
import {
  deleteVocabulary,
  getVocabularyById,
} from "@/services/vocabularyService";
import { getExamplesByVocabularyId } from "@/services/exampleServices";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import {
  createComment,
  deleteComment,
  getCommentsByVocabularyId,
  updateComment,
} from "@/services/commentService";
import Comments from "@/components/Comments";

export default function Home() {
  const { user, isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    text: "",
    userProfileId: 0,
    vocabularyId: 0,
  });
  const [editCommentData, seteditCommentData] = useState({
    text: "",
  });
  const router = useRouter();
  const [vocabulary, setVocabulary] = useState([]);
  const [examples, setExamples] = useState([]);
  const params = useParams();
  const vocabularyId = params.id;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditCommentDialogOpen, setIsEditCommentDialogOpen] = useState(false);
  const [isDeleteCommentDialogOpen, setIsDeleteCommentDialogOpen] =
    useState(false);
  const [comments, setComments] = useState([]);
  const [editingComment, setEditingComment] = useState({});
  const [commentToBeDeleted, setCommentToBeDeleted] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCommentChange = (e) => {
    const { id, value } = e.target;
    seteditCommentData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmitComment = async () => {
    let tempFormData = formData;
    tempFormData = {
      ...tempFormData,
      userProfileId: user.id,
      vocabularyId: vocabularyId,
    };
    console.log(tempFormData);

    await createComment(tempFormData);
    fetchData();
  };

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

  const handleEditCommentDialogueBox = (comment) => {
    setEditingComment(comment);
    setIsEditCommentDialogOpen(true);
  };

  const handleDeleteCommentDialogueBox = (comment) => {
    setCommentToBeDeleted(comment);
    setIsDeleteCommentDialogOpen(true);
  };

  const handleEditComment = async () => {
    let tempEditCommentData = editCommentData;
    await updateComment(editingComment.id, tempEditCommentData);
    fetchData();
  };

  const handleDeleteComment = async () => {
    let tempDeleteCommentData = commentToBeDeleted;
    await deleteComment(tempDeleteCommentData.id);
    fetchData();
  };

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

  const vocabularyContent = (
    <>
      <Navbar />
      <Container size="4" py="9" style={{ backgroundColor: "#eafdf8" }}>
        <Flex direction="column" gap="6" align="center">
          <Heading size="9" mb="2">
            {vocabulary.term}
          </Heading>
          <Text size="6">Translation: {vocabulary.translation}</Text>
          <Text size="6">Pronunciation: {vocabulary.pronunciation}</Text>
          {isAdmin() ? (
            <Flex direction="row" gap="3">
              <Button
                onClick={() => router.push(`/vocabulary/${vocabularyId}/edit`)}
              >
                Edit
              </Button>
              <Button color="red" onClick={() => setIsDeleteDialogOpen(true)}>
                Delete
              </Button>
            </Flex>
          ) : (
            <></>
          )}
        </Flex>
      </Container>
      <Flex
        direction="column"
        gap="6"
        align="center"
        style={{ backgroundColor: "#ddcad9" }}
        p="5"
      >
        <Heading size="8" mb="2">
          Examples
        </Heading>

        {examples.map((example) => (
          <Box key={example.id} width="1000px">
            <Card width="1000px">
              <Flex direction="row" gap="9" align="center">
                <iframe
                  width="420"
                  height="315"
                  src={example.videoUrl}
                ></iframe>

                <Flex direction="column" gap="6" align="center">
                  <Text size="7">Subtitle: {example.subtitle}</Text>
                  <Text size="7">Translation: {example.englishSubtitle}</Text>
                  <Button
                    onClick={() => router.push(`/examples/${example.id}`)}
                  >
                    View
                  </Button>
                </Flex>
              </Flex>
            </Card>
          </Box>
        ))}
      </Flex>

      <Container size="4" py="9" style={{ backgroundColor: "#eafdf8" }}>
        <Flex direction="column" gap="6" align="center">
          <Heading size="8" mb="2">
            User Comments
          </Heading>
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
                    <TextField.Root
                      id="text"
                      value={formData.text}
                      onChange={handleChange}
                      placeholder="Enter Comment..."
                      required
                    />
                    <Flex gap="3" mt="3" justify="between">
                      <Popover.Close>
                        <Button size="1" onClick={() => handleSubmitComment()}>
                          Comment
                        </Button>
                      </Popover.Close>
                    </Flex>
                  </Box>
                </Flex>
              </Popover.Content>
            </Popover.Root>

          <Box width="1000px">
            <Flex direction="column" gap="3">
              <Comments
                comments={comments}
                onEditFunction={handleEditCommentDialogueBox}
                onDeleteFunction={handleDeleteCommentDialogueBox}
              />
            </Flex>
          </Box>
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

      <Dialog.Root
        open={isEditCommentDialogOpen}
        onOpenChange={setIsEditCommentDialogOpen}
      >
        <Dialog.Content maxWidth="450px">
          <Dialog.Title>Edit Comment</Dialog.Title>

          <Flex direction="column" gap="3">
            <label>
              <TextField.Root
                id="text"
                onChange={handleCommentChange}
                defaultValue={editingComment.text}
              />
            </label>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button onClick={() => handleEditComment()}>Save</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <Dialog.Root
        open={isDeleteCommentDialogOpen}
        onOpenChange={setIsDeleteCommentDialogOpen}
      >
        <Dialog.Content>
          <Dialog.Title>Delete Comment</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Are you sure you want to delete this comment?
          </Dialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft">Cancel</Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button color="red" onClick={handleDeleteComment}>
                Delete
              </Button>
            </Dialog.Close>
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
