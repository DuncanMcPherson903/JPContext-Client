"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import FeatureErrorBoundary from "../../components/FeatureErrorBoundary";
import {
  Container,
  Heading,
  Text,
  Flex,
  Card,
  Box,
  TextField,
} from "@radix-ui/themes";
import Link from "next/link";
import {
  getAllVocabulary,
  searchAllVocabulary,
} from "@/services/vocabularyService";


export default function Vocabulary() {
  const [vocabulary, setVocabulary] = useState([]);
  const [searchResultCards, setSearchResultCards] = useState("");

  const fetchData = async () => {
    const vocabularyData = await getAllVocabulary();
    setVocabulary(vocabularyData);
    makeResultCards(vocabularyData)
  };

  const handleVocabSearch = async (e) => {
    const { value } = e.target;
    const searchResults = await searchAllVocabulary(value);
    makeResultCards(searchResults);
  };

  const makeResultCards = async (results) => {
    await setSearchResultCards(() => {
      return results.map((vocabulary) => (
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
      ));
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const vocabularyContent = (
    <>
      <Navbar />
      <Container size="4" py="9">
        <Flex direction="column" gap="6" align="center">

            <Heading size="9" mb="2">
              Vocabulary
            </Heading>


          <Box>
            <TextField.Root
              onChange={handleVocabSearch}
              placeholder="Search Vocabulary"
            />
          </Box>

          <Flex gap="6" wrap="wrap">
            {searchResultCards}
          </Flex>
        </Flex>
      </Container>
    </>
  );

  return (
    <FeatureErrorBoundary featureName="Vocabulary">
      {vocabularyContent}
    </FeatureErrorBoundary>
  );
}
