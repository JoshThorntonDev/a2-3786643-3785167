import Carousel from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";
import "./css/Landing.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import Button from "react-bootstrap/Button";
import UserContext from "../contexts/UserContext";

function Landing() {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  return (
    <div>
      <div className="landing d-flex justify-content-center">
        <Carousel fade="true">
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://images.unsplash.com/photo-1558959355-d9922ff0b767?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt="Person using computer"
            />
            <Carousel.Caption>
              <h3>Welcome to Loop Agile Now!</h3>
              <p>The place to get things done at Loop Agile</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt="Team meeting"
            />

            <Carousel.Caption>
              <h3>Collaborate better than ever!</h3>
              <p>Loop Agile Now is built to perform</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt="Large office"
            />

            <Carousel.Caption>
              <h3>Sign in to get started!</h3>
              <p>We're ready, are you?</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
      <Card className="text-center">
        <Card.Header>
          <h3>About Loop Agile Now</h3>
        </Card.Header>
        <Card.Body>
          Loop Agile Now is a new collaboration platform built specifically to
          suit the needs of the Loop Agile team.
          <hr />
          Built with <a href="https://reactjs.org/">React</a>, Loop Agile Now
          delivers impressive performance that allows you to focus on your
          passion for creativity. <br /> Now what are you waiting for? Click below to get started!
        </Card.Body>
        <Card.Body className="landingButton">
          {currentUser ? (
            <div>
              <Button
                variant="success"
                onClick={() => {
                  navigate("/posts", {
                    replace: false,
                  });
                }}
              >
                Feed
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/profile", {
                    replace: false,
                  });
                }}
              >
                My Profile
              </Button>
            </div>
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
        </Card.Body>
      </Card>
    </div>
  );
}

export default Landing;
