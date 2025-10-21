import { get, post, put, del } from './apiService';

export const getAllVocabulary = async () => {
  return get('/vocabulary');
};

export const searchAllVocabulary = async (searchQuery) => {
  return get(`/vocabulary?searchQuery=${searchQuery}`);
};

export const getVocabularyById = async (vocabularyId) => {
  return get(`/vocabulary/${vocabularyId}`);
};

export const createVocabulary = async (vocabularyData) => {
  return post('/vocabulary', vocabularyData);
};

export const deleteVocabulary = async (vocabularyId) => {
  return del(`/vocabulary/${vocabularyId}`);
};

export default {
  getAllVocabulary,
  getVocabularyById,
  createVocabulary,
  deleteVocabulary
};
