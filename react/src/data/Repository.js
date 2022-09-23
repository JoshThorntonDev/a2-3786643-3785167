//Code adapted from Week 5 Practical Activity 1 'repository.js'

// this file includes functions that read and write to users in storage

import { deletePost } from "./PostRepository";

const USERS_KEY = "users";

function initUsers() {
  if (localStorage.getItem(USERS_KEY) !== null) return;

  //Create empty users object if it doesn't already exist
  setUsers({});
}

function getUsers() {
  //Retrieve all users from LocalStorage
  return JSON.parse(localStorage.getItem(USERS_KEY));
}

function getUser(id) {
  // return a single user based on its unique id
  // it returns it in a way that it can be accessed using something
  // like getUser(id).name if you want
  var user = JSON.parse(localStorage.getItem(USERS_KEY));
  return user[id];
}

function setUsers(users) {
  //Set all users to localStorage
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function insertUser(user) {
  //Retrieve users, add new users to the list, and call setUsers
  const users = getUsers();
  user = trimSpaces(user);

  users[user.email] = user; // currently, email is primary key, could be a uuid
   
  

  setUsers(users);
}

function updateUser(user) {
  const users = getUsers();
  user = trimSpaces(user);
  user.posts = users[user.email].posts // copy post ids to new user

  users[user.email] = user;

  setUsers(users);
}

function assignPostToUser(user, postId) {
  const users = getUsers();

  users[user].posts.push(postId); // put id of a post in the posts list in the specified user

  setUsers(users);
}

function removeUser(key) {
  //Takes key (email) as a parameter, retrieves list of users
  //and deletes a single user based on the key/email provided
  const users = getUsers();

  for (let i = 0; i < users[key].posts.length; i++) {
    // mark all posts by the user as deleted
    deletePost(users[key].posts[i]);
  }

  delete users[key];

  //Set users again after user has been removed
  setUsers(users);
}


function trimSpaces(user) {
  user.name = user.name.trim()
  user.email = user.email.trim()
  return user
}

export {
  initUsers,
  getUsers,
  getUser,
  insertUser,
  updateUser,
  removeUser,
  assignPostToUser,
};
