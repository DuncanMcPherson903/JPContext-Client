"use client";

const { Card, Flex, Text, Heading, Button } = require("@radix-ui/themes");

export const SearchResultCards = ({
  searchResults,
  addedVocabCheck,
  addVocabFunction,
}) => {
  return searchResults.map((result) => (
    <Card key={result.id} style={{ flex: "1 1 300px" }}>
      <Flex direction="column" gap="3">
        <Heading size="4">{result.term}</Heading>
        <Text>{result.translation}</Text>
        {addedVocabCheck(result) ? (
          <></>
        ) : (
          <Button type="button" onClick={() => addVocabFunction(result.id)}>
            Add
          </Button>
        )}
      </Flex>
    </Card>
  ));
};

export const AddedVocabCards = ({ vocabList, removeVocab }) => {
  return vocabList.map((result) => (
    <Card key={result.id} style={{ flex: "1 1 100px" }}>
      <Flex direction="column" gap="3">
        <Heading size="4">{result.term}</Heading>
        <Text>{result.translation}</Text>
        <Button type="button" onClick={() => removeVocab(result.id)}>
          Remove
        </Button>
      </Flex>
    </Card>
  ));
};
