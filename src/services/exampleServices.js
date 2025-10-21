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

export const createExample = async (exampleData) => {
  return post('/examples', exampleData);
};

export default {
  getAllExamples,
  getExampleById,
  createExample
};
