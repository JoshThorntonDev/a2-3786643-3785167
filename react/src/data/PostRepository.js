//Code adapted from Week 5 Practical Activity 1 'repository.js'

// this file includes functions that read and write to posts in storage

import { assignPostToUser, getUser } from "./Repository";

const POSTS_KEY = "posts";

function initPosts() {
  if (localStorage.getItem(POSTS_KEY) !== null) return;

  //Create empty Posts object if it doesn't already exist
  setPosts({});
}

function getPosts() {
  //Retrieve all Posts from LocalStorage
  return JSON.parse(localStorage.getItem(POSTS_KEY));
}

function setPosts(posts) {
  //Set all Posts to localStorage
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

function insertPost(post, currentUser) {
  //Retrieve Posts, add new Posts to the list, and call setPosts

  if (post.content !== "") {
    let currentDate = new Date();

    post.date = currentDate.toLocaleString().split(",")[0]; // 0 makes it only the date
    post.time = currentDate.toLocaleString().split(", ")[1]; // 1 makes it only the time, the space prevents it ending up in the time string

    const posts = getPosts();
    if(!post.postId) { // if post doesnt have an id, generate one
      var id = getNewID();
      post.postId = id; // store id inside post so we can safely store them in arrays without losing their id

      assignPostToUser(currentUser, id); // store id inside the user as well
      posts[id] = post; // target the position assigned to the new post

    } else { // if it does have an id, it means we're editing an existing one, so put it back in storage
      posts[post.postId] = post; // target posts original position
    }

    setPosts(posts); // save

  }
}


function getPost(id) {
  //return a single post
  const posts = getPosts();
  return posts[id];
}

function deletePost(id) {
  // doesnt actually delete the post, just changes the content and poster to [deleted]

  const posts = getPosts();

  posts[id].content = "[deleted]";
  posts[id].userId = "[deleted]";

  if (posts[id].image) { // if the post had an image, mark it as deleted, otherwise do nothing
    posts[id].image = "[deleted]";
  }


  setPosts(posts);
}

function getAllPostsByUser(userid) {
  // returns all posts made by userid, except ones that have been marked as deleted
  var postids = getUser(userid).posts;
  var posts = [];

  postids.forEach((i) => {
    var post = getPost(i);
    if (post.userId !== "[deleted]") {
      // when a post is deleted, the user's account still keeps the id stored in case its needed, (eg for reporting)
      // so we check if the post has been "deleted" before sending it back
      posts.push(post);
    }
  });

  return posts;
}

function getNewID() { // just generate a random string of characters
  return crypto.randomUUID();
}

export {
  initPosts,
  getPosts,
  insertPost,
  deletePost,
  getPost,
  getAllPostsByUser,
};
