//Controller for calling methods on users
//Adapted from week 8 Lab user.controller.js

const db = require("../database");
const argon2 = require("argon2");

//Select all users from the database.
exports.all = async (req, res) => {
  const users = await db.user.findAll();

  res.json(users);
};

//Select one user from the database.
exports.one = async (req, res) => {
  const user = await db.user.findByPk(req.params.id);

  res.json(user);
};

exports.findByEmail = async (req, res) => {
  const user = await db.user.findOne({ where: {email: req.params.email } });

  res.json(user);
}

exports.findByName = async (req, res) => {
  const user = await db.user.findOne({ where: {username: req.params.username } });

  res.json(user);
}

//Select one user from the database if username and password are a match.
exports.login = async (req, res) => {
  const user = await db.user.findOne({ where: {email: req.query.email } });

  if(user === null || await argon2.verify(user.password_hash, req.query.password) === false)
    // Login failed.
    res.json(null);
  else
    res.json(user);
};

//Create a user in the database.
exports.create = async (req, res) => {
  const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });
  
  const user = await db.user.create({
    email: req.body.email,
    password_hash: hash,
    username: req.body.username
  });

  res.json(user);
};

// delete a user
exports.delete = async (req, res) => {
  const id = req.params.id;
  
  await db.user.destroy({where: {id: id}})
  res.send({
    message: `Deleted user ${id}`
  });
}

//update details of a user
exports.update = async (req, res) => {
  // adapted from lec 9 ex 1

  const user = await db.user.findByPk(req.body.id)
  
  user.username = req.body.username;
  user.email = req.body.email;

  await user.save();
  res.json(user)
}
