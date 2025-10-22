import { get, post, put, del } from './apiService';

export const getCommentsByVocabularyId = async (vocabularyId) => {
  return get(`/vocabulary/${vocabularyId}/comments`);
}

export const createComment = async (exampleData) => {
  return post('/comment', exampleData);
};

export const deleteComment = async (exampleId) => {
  return del(`/comment/${exampleId}`);
};

export default {
  getCommentsByVocabularyId,
  createComment,
  deleteComment
};
