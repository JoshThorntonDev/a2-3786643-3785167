//Adapted from week 8 lab material index.js

const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config.js");

const db = {
    Op: Sequelize.Op
  };
  
  // Create Sequelize.
  db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.DIALECT
  });

  //Models
  db.user = require("./models/user.js")(db.sequelize, DataTypes);
  db.post = require("./models/post.js")(db.sequelize, DataTypes);


// Relate post and user.
//Commented out for now until posts are integrated
//db.post.belongsTo(db.user, { foreignKey: { name: "username", allowNull: false } });

//Sync schema and seed initial data
db.sync = async () => {
    // Sync schema.
    await db.sequelize.sync();
  
    await seedData();
};

//Seed database with initial users
async function seedData() {
    const count = await db.user.count();
    const postCount = await db.post.count();
    //Return if database isn't empty
    if(count > 0)
      return;
  
    const argon2 = require("argon2");
  
    let hash = await argon2.hash("password1!", { type: argon2.argon2id });
    await db.user.create({ id: 1, email: "first@email.com", password_hash: hash, username: "First User" });
  
    hash = await argon2.hash("password1!", { type: argon2.argon2id });
    await db.user.create({ id: 2, email: "second@email.com", password_hash: hash, username: "Second User" });




    //Return if database isn't empty
    if(postCount > 0)
      return;
    
    await db.post.create({ content: "this is the first post, which does not have an image" });
    await db.post.create({ content: "this is the second post, which has an image" , image: "https://media.discordapp.net/attachments/552276917559099418/826662994230116362/53u0wr.jpg"});
    

}
  
  module.exports = db;