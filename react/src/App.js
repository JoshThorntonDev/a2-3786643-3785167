import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import Landing from "./components/Landing.js";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Posts from "./components/Posts";
import UserContext from "./contexts/UserContext";
import ReactionContext from "./contexts/ReactionContext";

import { useState } from "react";
import { getReactions } from "./data/dbrepository";

function App() {
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem("currentUser")
  );

  const login = (id) => {
    setCurrentUser(id.toString());
    localStorage.setItem("currentUser", id);
  };
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };
  const NAME_LENGTH = 20; // max length for user names

  const [reactions, setReactions] = useState([]);

  const checkForReactions = async () => {
    const temp = await getReactions();
    setReactions(temp);
  };

  return (
    <div className="contain">
      <UserContext.Provider value={{ currentUser, login, logout, NAME_LENGTH }}>
        <ReactionContext.Provider value={{ reactions, checkForReactions }}>
          <BrowserRouter>
            <Header />
            <div className="content">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/posts" element={<Posts />} />

                <Route path="*" element={<Landing />} />
              </Routes>
            </div>
            <Footer />
          </BrowserRouter>
        </ReactionContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
