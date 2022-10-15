//Adapted from week 8 lab material index.js

const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config.js");

const db = {
  Op: Sequelize.Op,
};

// Create Sequelize.
db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.DIALECT,
});

//Models
db.user = require("./models/user.js")(db.sequelize, DataTypes);
db.post = require("./models/post.js")(db.sequelize, DataTypes);
db.reaction = require("./models/reaction.js")(db.sequelize, DataTypes);
db.follow = require("./models/follow.js")(db.sequelize, DataTypes);

// Relate tables

db.user.hasMany(db.post, {
  foreignKey: {
    allowNull: true
  }
})

db.user.belongsToMany(db.user, {through: 'follow', as:'following'})


db.post.hasOne(db.post, {
  foreignKey: "replyId"

})

db.post.belongsTo(db.user);

db.post.hasMany(db.reaction, {
  foreignKey: "postId"
})

db.reaction.belongsTo(db.user);



//Sync schema and seed initial data
db.sync = async () => {
  // Sync schema.
  await db.sequelize.sync();

  // force it to sync, will delete everything
  // await db.sequelize.sync({ force: true });

  await seedData();
};

//Seed database with initial data
async function seedData() {

  const userId1 = 837;
  const userId2 = 2843;

  const userCount = await db.user.count();
  const postCount = await db.post.count();

  //Only seed users table when it's empty
  if (userCount === 0) {
    const argon2 = require("argon2");
    let hash = await argon2.hash((Math.random() + Math.random()).toString(), { type: argon2.argon2id });

    await db.user.create({
      id: 1,
      email: "[deleted]",
      password_hash: hash,
      username: "[deleted]",
    });

    hash = await argon2.hash("password1!", { type: argon2.argon2id });
    await db.user.create({
      id: 2,
      email: "testuser@email.com",
      password_hash: hash,
      username: "Test User"
    })

    hash = await argon2.hash("password1!", { type: argon2.argon2id });
    await db.user.create({
      id: userId1,
      email: "first@email.com",
      password_hash: hash,
      username: "First User",
    });

    hash = await argon2.hash("password1!", { type: argon2.argon2id });
    await db.user.create({
      id: userId2,
      email: "second@email.com",
      password_hash: hash,
      username: "Second User",
    });


  }

  //Only seed posts table when it's empty
  if (postCount === 0) {
    await db.post.create({
      content: "this is the first post, <h1>which does not have an image</h1>",
      userId: userId1
    });
    await db.post.create({
      content: "this is the second post, which has an image",
      image:
        "https://media.discordapp.net/attachments/552276917559099418/826662994230116362/53u0wr.jpg",
      userId: userId2
    });
  }
}

module.exports = db;
