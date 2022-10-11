//Controller for calling methods on follow
//Adapted from week 8 Lab post.controller.js

const db = require("../database");

// Select all follows from the database.
exports.all = async (req, res) => {
  const follow = await db.follow.findAll();
  res.json(follow);
};

// Select the ids of every user a specific user is following. (For sorting posts)
exports.allFollowing = async (req, res) => {
  const following = await db.follow.findAll({
    where: {
      follower: req.params.id,
    },
  });
  res.json(following);
};

// Select the ids of every user a specific user is following. (For sorting posts)
exports.allFollowers = async (req, res) => {
  const followers = await db.follow.findAll({
    where: {
      following: req.params.id,
    },
  });
  res.json(followers);
};

// Create a follow relation in the database.
exports.create = async (req, res) => {
  const follow = await db.follow.create({
    following: req.body.following,
    follower: req.body.follower,
  });

  res.json(follow);
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  await db.follow.destroy({ where: { id: id } });
  res.send({
    message: `Deleted follow ${id}`,
  });
};
