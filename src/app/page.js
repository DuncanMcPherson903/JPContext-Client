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
  ScrollArea,
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
      <Flex
        direction="column"
        gap="3"
        align="center"
        style={{ backgroundColor: "#eafdf8" }}
      >
        <Heading size="9" mb="5" mt="5">
          Latest Vocabulary
        </Heading>
        <ScrollArea
          type="always"
          scrollbars="horizontal"
          style={{ height: 130 }}
        >
          <Flex gap="6" wrap="nowrap" py="3">
            {vocabulary.map((vocabulary) => (
              <Link
                href={`/vocabulary/${vocabulary.id}`}
                key={vocabulary.id}
                style={{ textDecoration: "none" }}
              >
                <Card style={{ flex: "1 1 300px" }}>
                  <Flex direction="column" gap="3" wrap="nowrap" align="center">
                    <Heading size="4" style={{whiteSpace: "nowrap"}}>{vocabulary.term}</Heading>
                    <Text style={{whiteSpace: "nowrap"}}>{vocabulary.translation}</Text>
                  </Flex>
                </Card>
              </Link>
            ))}
          </Flex>
        </ScrollArea>
      </Flex>

      <Flex
        direction="column"
        gap="3"
        align="center"
        style={{ backgroundColor: "#ddcad9" }}
      >
        <Heading size="9" mb="5" mt="5">
          Latest Examples
        </Heading>

        <Flex
        direction="column"
        gap="6"
        align="center"
        style={{ backgroundColor: "#ddcad9" }}
        p="5"
      >

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
      </Flex>
    </>
  );

  return (
    <FeatureErrorBoundary featureName="Home">
      {homeContent}
    </FeatureErrorBoundary>
  );
}
