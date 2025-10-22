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
  Popover,
  ScrollArea,
} from "@radix-ui/themes";
import { createExample } from "@/services/exampleServices";
import {
  getVocabularyById,
  searchAllVocabulary,
} from "@/services/vocabularyService";
import { PlusIcon } from "@radix-ui/react-icons";

export default function AddExample() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    source: "",
    videoUrl: "",
    subtitle: "",
    englishSubtitle: "",
    vocabularyId: [],
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResultCards, setSearchResultCards] = useState("");
  const [addedVocabCards, setAddedVocabCards] = useState("");
  const [addedVocab, setAddedVocab] = useState([]);
  const [vocabIdList, setVocabIdList] = useState([]);
  let eventData;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleVocabSearch = async (e) => {
    const { value } = e.target;
    eventData = e;
    const searchResults = await searchAllVocabulary(value);
    await setSearchResultCards(() => {
      if (value !== "") {
        return searchResults.map((result) => (
          <Card key={result.id} style={{ flex: "1 1 300px" }}>
            <Flex direction="column" gap="3">
              <Heading size="4">{result.term}</Heading>
              <Text>{result.translation}</Text>
              {addedVocabIncludesSearchResult(result) ? (
                <></>
              ) : (
                <Button type="button" onClick={() => addVocabToForm(result.id)}>
                  Add
                </Button>
              )}
            </Flex>
          </Card>
        ));
      }
    });
  };


  const addVocabToForm = async (vocabId) => {
    let tempVocabIdList = vocabIdList;
    tempVocabIdList.push(vocabId);
    setVocabIdList(tempVocabIdList);
    console.log(vocabIdList);
    let vocabList = addedVocab;
    vocabList.push(await getVocabularyById(vocabId));
    setAddedVocab(vocabList);
    displayAddedVocabCards(vocabList);
    handleVocabSearch(eventData);
  };

  const removeVocabFromForm = (vocabId) => {
    let tempVocabIdList = vocabIdList;
    tempVocabIdList = tempVocabIdList.filter((item) => item !== vocabId);
    setVocabIdList(tempVocabIdList);
    let vocabList = addedVocab;
    vocabList = vocabList.filter((item) => item.id !== vocabId);
    setAddedVocab(vocabList);
    console.log(vocabList);
    console.log(addedVocab);
    displayAddedVocabCards(vocabList);
    setSearchResultCards(<></>)
  };

  const displayAddedVocabCards = (vocabList) => {
    setAddedVocabCards(() => {
      return vocabList.map((result) => (
        <Card key={result.id} style={{ flex: "1 1 100px" }}>
          <Flex direction="column" gap="3">
            <Heading size="4">{result.term}</Heading>
            <Text>{result.translation}</Text>
            <Button
              type="button"
              onClick={() => removeVocabFromForm(result.id)}
            >
              Remove
            </Button>
          </Flex>
        </Card>
      ));
    });
  };

  const addedVocabIncludesSearchResult = (result) => {
    const foundVocab = addedVocab.find((vocab) => vocab.id === result.id);
    if (foundVocab == undefined) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log(vocabIdList);
      let tempFormData = formData;
      tempFormData = { ...tempFormData, vocabularyId: vocabIdList}
      console.log(tempFormData);
      const newExample = await createExample(tempFormData);
      router.push(`/examples/${newExample.id}`);
    } catch (err) {
      console.error("Error adding example:", err);
      setError("Failed to add example. Please try again.");
      setIsLoading(false);
    }
  };

  const testBtn = async () => {
    console.log(vocabIdList);
  };

  const addExampleContent = (
    <>
      <Navbar />
      <Container size="2" py="9">
        <Card>
          <Flex direction="column" gap="5" p="4">
            <Heading size="6" align="center">
              Add a New Example
            </Heading>

            {error && (
              <Text color="red" size="2">
                {error}
              </Text>
            )}

            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap="4">
                <Box>
                  <Text as="label" size="2" mb="1" htmlFor="title">
                    Title
                  </Text>
                  <TextField.Root
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter title"
                    required
                  />
                </Box>

                <Box>
                  <Text as="label" size="2" mb="1" htmlFor="source">
                    Source
                  </Text>
                  <TextField.Root
                    id="source"
                    value={formData.source}
                    onChange={handleChange}
                    placeholder="Enter name of source"
                    required
                  />
                </Box>

                <Box>
                  <Text as="label" size="2" mb="1" htmlFor="videoUrl">
                    Video URL
                  </Text>
                  <TextField.Root
                    id="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    placeholder="Enter video URL"
                  />
                </Box>

                <Box>
                  <Text as="label" size="2" mb="1" htmlFor="subtitle">
                    Subtitle
                  </Text>
                  <TextField.Root
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    placeholder="Enter Japanese subtitle"
                    required
                  />
                </Box>

                <Box>
                  <Text as="label" size="2" mb="1" htmlFor="englishSubtitle">
                    English Subtitle
                  </Text>
                  <TextField.Root
                    id="englishSubtitle"
                    value={formData.englishSubtitle}
                    onChange={handleChange}
                    placeholder="Enter English subtitle"
                    required
                  />
                </Box>

                <Popover.Root>
                  <Popover.Trigger>
                    <Button variant="soft">
                      <PlusIcon width="16" height="16" />
                      Add Example
                    </Button>
                  </Popover.Trigger>
                  <Popover.Content width="360px">
                    <TextField.Root
                      id="example"
                      onChange={handleVocabSearch}
                      placeholder="Search Examples…"
                    ></TextField.Root>
                    <ScrollArea
                      type="always"
                      scrollbars="vertical"
                      style={{ height: 180 }}
                    >
                      {searchResultCards}
                    </ScrollArea>
                  </Popover.Content>
                </Popover.Root>
                <ScrollArea type="always" scrollbars="vertical">
                  {addedVocabCards}
                </ScrollArea>
                <Flex gap="3" mt="4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Adding Example..." : "Add Example"}
                  </Button>
                  <Button
                    type="button"
                    variant="soft"
                    onClick={() => router.push("/examples")}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => testBtn()} type="button">
                    Test
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
    <FeatureErrorBoundary featureName="AddExample">
      {addExampleContent}
    </FeatureErrorBoundary>
  );
}
