//Methods to call the DB api from front end
//Code adapted from week 8 lab repository.js

//NOTE: kept the existing repository.js for now
//to not break the app, but can replace
//it with this one once we've fully moved from
//local storage to db
import axios from "axios";

const API_HOST = "http://localhost:4000/api";
const USER_KEY = "user";

// --- User Methods ---------------------------------------------------------------------------------------
async function verifyUser(email, password) {
    const response = await axios.get(API_HOST + "/users/login", { params: { email, password } });
    const user = response.data;
    
    // NOTE: In this example the login is also persistent as it is stored in local storage.
    //if(user !== null)
      //setUser(user);
  
    return user;
}

async function findUser(id) {
    const response = await axios.get(API_HOST + `/users/select/${id}`);
  
    return response.data;
}
  
async function createUser(user) {
    const response = await axios.post(API_HOST + "/users", user);
  
    return response.data;
}

export {
    verifyUser, findUser, createUser
  }