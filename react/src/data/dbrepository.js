//Methods to call the DB api from front end
//Code adapted from week 8 lab repository.js

import axios from "axios";

const API_HOST = "http://localhost:4000/api";
const USER_KEY = "users";
const POST_KEY = "posts";

// --- User Methods ---------------------------------------------------------------------------------------
async function verifyUser(email, password) {
  const response = await axios.get(API_HOST + `/${USER_KEY}/login`, {
    params: { email, password },
  });
  const user = response.data;

  return user;
}

async function findUser(id) {
  const response = await axios.get(API_HOST + `/${USER_KEY}/select/${id}`);

  return response.data;
}

async function createUser(user) {
  const response = await axios.post(API_HOST + `/${USER_KEY}`, user);

  return response.data;
}

async function findUserByEmail(email) {
  const response = await axios.get(
    API_HOST + `/${USER_KEY}/selectemail/${email}`
  );

  return response.data;
}

async function deleteUser(user) {
  const response = await axios.delete(API_HOST + `/${USER_KEY}/${user.id}`);

  return response.data;
}

async function editUser(user) {
  const response = await axios.put(API_HOST + `/${USER_KEY}`, user);

  return response.data;
}

// --- Post Methods ---------------------------------------------------------------------------------------
async function createPost(post) {
  const response = await axios.post(API_HOST + `/${POST_KEY}`, post);
  return response.data;
}

async function getPosts() {
  const response = await axios.get(API_HOST + `/${POST_KEY}`);

  return response.data;
}

async function updatePost(post) {
  const response = await axios.put(API_HOST + `/${POST_KEY}/`, post);

  return response;
}

async function deletePost(postToDelete) {
  // doesnt actually delete, updates content and image to [deleted], preserving any replies the post had

  const post = postToDelete;
  post.content = "[deleted]"
  
  const response = await axios.put(API_HOST + `/${POST_KEY}/`, post);

  return response;
}

async function getRepliesTo(postId) {
  const response = await axios.get(API_HOST + `/${POST_KEY}/replies/${postId}`);
  return response.data;
}

async function getPostsByUser(id) {
  const response = await axios.get(API_HOST + `/${POST_KEY}/user/${id}`);

  return response.data;
}

export {
  verifyUser,
  findUser,
  createUser,
  findUserByEmail,
  deleteUser,
  editUser,
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getRepliesTo,
  getPostsByUser,
};
