//Controller for calling methods on users
//Adapted from week 8 Lab post.controller.js

const db = require("../database");

// Select all posts from the database.
exports.all = async (req, res) => {
  const posts = await db.post.findAll();
  res.json(posts);
};

// Create a post in the database.
exports.create = async (req, res) => {
  const post = await db.post.create({
    content: req.body.content,
    image: req.body.image,
    user_id: req.body.user_id // set foreign key
  });

  res.json(post);
};