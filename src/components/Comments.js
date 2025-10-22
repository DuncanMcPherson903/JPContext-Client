"use client";

const { Flex, Text, TextArea } = require("@radix-ui/themes");

const Comments = ({ comments }) => {
  
  if (comments?.length < 1) {
    return <></>;
  }
  return comments.map((comment) => (
    <Flex key={comment.id} direction="row" gap="3">
      <Text>{comment.username}</Text>
      <TextArea>{comment.text}</TextArea>
    </Flex>
  ));
};

export default Comments;
