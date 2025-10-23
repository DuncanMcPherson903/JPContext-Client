"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ChatBubbleIcon } from "@radix-ui/react-icons";

const {
  Flex,
  Text,
  Card,
  DropdownMenu,
  Button,
  Dialog,
  TextField,
  Popover,
  Box,
  Container,
} = require("@radix-ui/themes");

const Comments = ({ comments, onEditFunction, onDeleteFunction }) => {
  const { user, isAdmin } = useAuth();

  if (comments?.length < 1) {
    return <></>;
  }
  return comments.map((comment) => (
    <Flex key={comment.id} direction="row" gap="3">
      <Text>{comment.username}</Text>
      <Card>
        <Flex direction="row" gap="5" p="4">
          <Text>{comment.text}</Text>
          {isAdmin() || user.username == comment.username ? (
            <>
              <Button onClick={() => onEditFunction(comment)}>Edit</Button>
              <Button color="red" onClick={() => onDeleteFunction(comment)}>
                Delete
              </Button>
            </>
          ) : (
            <></>
          )}
        </Flex>
      </Card>
    </Flex>
  ));
};

export default Comments;
