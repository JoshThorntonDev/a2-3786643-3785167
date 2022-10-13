import "./css/Header.css";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../contexts/UserContext";
import { DoorClosed, PeopleFill, PersonVideo2, ViewList } from "react-bootstrap-icons";

function Header() {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(UserContext);

  return (
    <Navbar className="headerNav" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand
          className="headerLogo"
          onClick={() => {
            navigate("/");
          }}
        >
          Loop Agile Now
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          {currentUser && (
            <div>

              <Button
                variant="success"
                onClick={() => {
                  navigate("/posts", {
                    replace: false,
                  });
                }}
              >
                <ViewList size={20}/> Feed
              </Button>
              <Button
                variant="light"
                onClick={() => {
                  navigate("/profiles", {
                    replace: false,
                  });
                }}
              >
                <PeopleFill size={20} /> Users
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  navigate(`/profile/${currentUser}`, {
                    replace: false,
                  });
                }}
              >
                <PersonVideo2 size={20}/> My Profile
              </Button>
            </div>
          )}

          {currentUser ? (
            <Button
              variant="secondary"
              onClick={() => {
                logout();
                navigate("/", {
                  replace: true,
                });
              }}
            >
              <DoorClosed size={20}/> Logout
            </Button>
          ) : (
            <div>
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/login", {
                    replace: false,
                  });
                }}
              >
                Login
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/register", {
                    replace: false,
                  });
                }}
              >
                Sign Up
              </Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
