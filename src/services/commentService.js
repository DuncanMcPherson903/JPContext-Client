import { get, post, put, del } from './apiService';

export const getCommentsByVocabularyId = async (vocabularyId) => {
  return get(`/vocabulary/${vocabularyId}/comments`);
}

export const createComment = async (commentData) => {
  return post('/comment', commentData);
};

export const updateComment = async (commentId, commentData) => {
  return put(`/comment/${commentId}`, commentData);
};

export const deleteComment = async (commentId) => {
  return del(`/comment/${commentId}`);
};
