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
import { useState } from "react";

function App() {
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem("currentUser")
  );

  const login = (id) => {
    setCurrentUser(id);
    localStorage.setItem("currentUser", id);
  };
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };
  const NAME_LENGTH = 20; // max length for user names

  return (
    <div className="contain">
      <UserContext.Provider value={{ currentUser, login, logout, NAME_LENGTH }}>
        <BrowserRouter>
          <Header />
          <div className="content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="*" element={<Landing />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
