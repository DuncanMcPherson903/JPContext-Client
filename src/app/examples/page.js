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
import { getAllExamples, searchAllExamples } from "@/services/exampleServices";


export default function Example() {
  const [searchResultCards, setSearchResultCards] = useState("");

  const fetchData = async () => {
    const exampleData = await getAllExamples();
    makeResultCards(exampleData)
  };

  const handleVocabSearch = async (e) => {
    const { value } = e.target;
    const searchResults = await searchAllExamples(value);
    makeResultCards(searchResults);
  };

  const makeResultCards = async (results) => {
    await setSearchResultCards(() => {
      return results.map((example) => (
        <Link
          href={`/examples/${example.id}`}
          key={example.id}
          style={{ textDecoration: "none" }}
        >
          <Card style={{ flex: "1 1 300px" }}>
            <Flex direction="column" gap="3">
              <Heading size="4">{example.title}</Heading>
              <Text>Source: {example.source}</Text>
            </Flex>
          </Card>
        </Link>
      ));
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const exampleContent = (
    <>
      <Navbar />
      <Container size="4" py="9">
        <Flex direction="column" gap="6">
          <Box>
            <Heading size="9" mb="2">
              Examples
            </Heading>
          </Box>

          <Box>
            <TextField.Root
              onChange={handleVocabSearch}
              placeholder="Search Examples"
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
    <FeatureErrorBoundary featureName="Example">
      {exampleContent}
    </FeatureErrorBoundary>
  );
}
