import { get, post, put, del } from './apiService';

export const getAllExamples = async () => {
  return get('/examples');
};

export const searchAllExamples = async (searchQuery) => {
  return get(`/examples?searchQuery=${searchQuery}`);
};

export const getExampleById = async (exampleId) => {
  return get(`/examples/${exampleId}`);
};

export const getExamplesByVocabularyId = async (vocabularyId) => {
  return get(`/vocabulary/${vocabularyId}/examples`);
}

export const createExample = async (exampleData) => {
  return post('/examples', exampleData);
};

export const deleteExample = async (exampleId) => {
  return del(`/examples/${exampleId}`);
};

export default {
  getAllExamples,
  getExampleById,
  createExample,
  deleteExample,
  getExamplesByVocabularyId
};
