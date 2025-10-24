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
    <Flex key={comment.id} direction="row" gap="3" align="center">
      <Box width="80px">
        <Text>{comment.username}:</Text>
      </Box>
      
      <Card
        style={{
          height: "50px",
          width: "800px",
        }}
      >
        <Text>{comment.text}</Text>
      </Card>
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
  ));
};

export default Comments;
