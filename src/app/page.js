"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import FeatureErrorBoundary from "../components/FeatureErrorBoundary";
import {
  Container,
  Heading,
  Text,
  Flex,
  Card,
  Box,
  Button,
} from "@radix-ui/themes";
import Link from "next/link";
import Image from "next/image";
import { getAllVocabulary } from "@/services/vocabularyService";
import { getAllExamples } from "@/services/exampleServices";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [vocabulary, setVocabulary] = useState([]);
  const [examples, setExamples] = useState([]);

  const fetchData = async () => {
    const vocabularyData = await getAllVocabulary();
    setVocabulary(vocabularyData);
    const exampleData = await getAllExamples();
    setExamples(exampleData);
  };

  useEffect(() => {
    fetchData();
  }, [user, router]);

  const homeContent = (
    <>
      <Navbar />
      <Container size="4" py="9">
        <Flex direction="column" gap="6">
          <Box>
            <Heading size="9" mb="2">
              Vocabulary
            </Heading>
          </Box>
          <Flex gap="6" wrap="wrap">
            {vocabulary.map((vocabulary) => (
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

          <Box>
            <Heading size="9" mb="2">
              Examples
            </Heading>
          </Box>
          <Flex gap="6" wrap="wrap">
            {examples.map((example) => (
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
            ))}
          </Flex>
        </Flex>
      </Container>
    </>
  );

  return (
    <FeatureErrorBoundary featureName="Home">
      {homeContent}
    </FeatureErrorBoundary>
  );
}
