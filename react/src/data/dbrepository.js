//Methods to call the DB api from front end
//Code adapted from week 8 lab repository.js

import axios from "axios";

const API_HOST = "http://localhost:4000/api";
const USER_KEY = "users";
const POST_KEY = "posts";
const REACTION_KEY = "reactions";
const FOLLOW_KEY = "follows";

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
  var posts = await getPostsByUser(user.id);

  posts.forEach((post) => {
    // keep posts made by user that is being deleted, otherwise replies will break
    deletePost(post);
  });

  deleteUserReactions(user.id);
  const response = await axios.delete(API_HOST + `/${USER_KEY}/${user.id}`);

  return response.data;
}

async function editUser(user) {
  const response = await axios.put(API_HOST + `/${USER_KEY}`, user);

  return response.data;
}

async function getUsers() {
  const response = await axios.get(API_HOST + `/${USER_KEY}`);

  return response.data;
}

// --- Follow Methods -----------------------------------------------------------------------------------

async function getFollows() {
  const response = await axios.get(API_HOST + `/${FOLLOW_KEY}`);

  return response.data;
}

// Select the ids of every user a specific user is following. (For sorting posts)
async function findFollowedUsers(id) {
  const response = await axios.get(API_HOST + `/${FOLLOW_KEY}/user/${id}`);

  return response.data;
}

// Select the ids of every user that is following the specified user (For seeing who is following you)
async function findFollowingUsers(id) {
  const response = await axios.get(
    API_HOST + `/${FOLLOW_KEY}/user/followers/${id}`
  );

  return response.data;
}

async function createFollow(follow) {
  const response = await axios.post(API_HOST + `/${FOLLOW_KEY}`, follow);
  return response.data;
}

async function deleteFollow(id) {
  const response = await axios.delete(API_HOST + `/${FOLLOW_KEY}/${id}`);

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
  post.content = "[deleted]";
  post.image = "";
  post.userId = 1;
  // id 1 is a special user that holds ALL deleted posts, this makes it much easier to render deleted posts,
  // as the code that displays user name can remain unchanged

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

// --- Reaction Methods -----------------------------------------------------------------------------------

async function getReactions() {
  const response = await axios.get(API_HOST + `/${REACTION_KEY}`);
  return response.data;
}

async function createReaction(reaction) {
  reaction.id = null;
  const response = await axios.post(API_HOST + `/${REACTION_KEY}`, reaction);
  return response.data;
}

async function updateReaction(reaction) {
  const response = await axios.put(API_HOST + `/${REACTION_KEY}/`, reaction);

  return response;
}

async function deleteReaction(reaction) {
  const response = await axios.delete(
    API_HOST + `/${REACTION_KEY}/${reaction.id}`
  );

  return response;
}

async function deleteUserReactions(id) {
  const response = await axios.delete(API_HOST + `/${REACTION_KEY}/user/${id}`);

  return response;
}

export {
  verifyUser,
  findUser,
  createUser,
  findUserByEmail,
  deleteUser,
  editUser,
  getUsers,
  getFollows,
  findFollowedUsers,
  findFollowingUsers,
  createFollow,
  deleteFollow,
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getRepliesTo,
  getPostsByUser,
  getReactions,
  createReaction,
  updateReaction,
  deleteReaction,
};
