import "./css/Login.css";

// bootstrap for styling
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import AnimatedAlert from "./AnimatedAlert";

import { verifyUser } from "../data/dbrepository";

// react components for functionality
import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { login } = useContext(UserContext);

  const emailRef = useRef(null);

  const attemptLogin = async (e) => {
    setLoading(true);
    setError(false); // clear error in case user has set it already
    e.preventDefault(); // prevent form from submitting automatically

    //Check for user in db with submitted email and password
    const user = await verifyUser(email, password);

    if (user === null) {
      //Invalid details, set error to true and return
      setError(true);
      setLoading(false)
      emailRef.current.focus()
      return;
    }


    //If login is valid
    //Show welcome message
    setShow(true);
    setUsername(user.username);

    //Redirect user and set them as logged in
    setTimeout(() => {
      login(user.id); // user successfully logged in
      navigate(`/profile/${user.id}`, { replace: true });
    }, 1500);
  };

  return (
    <Card>
      <Card.Header><h2 className="mb-1 d-flex justify-content-center">Sign In</h2></Card.Header>
      <Form className="mb-3 loginForm" onSubmit={attemptLogin}>


        <AnimatedAlert
          variant="danger"
          message="Sorry, your email and/or password did not match our records"
          display={error}
          setDisplay={setError}
        />

        <AnimatedAlert
          variant="success"
          message={"Welcome, " + username + "! We're redirecting you now"}
          display={show}
          setDisplay={setShow}
        />

        <FloatingLabel label="Email address" className="mb-3">
          <Form.Control
            type="email"
            name="email"
            placeholder="email@example.com"
            value={email}
            ref={emailRef}
            required
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </FloatingLabel>

        <FloatingLabel label="Password" className="mb-3">
          <Form.Control
            type="password"
            name="password"
            placeholder="Password here"
            value={password}
            required
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </FloatingLabel>

        <div className="d-flex justify-content-center">
          {loading ? (<div><Button variant="primary" disabled>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />{" "}Loading
          </Button></div>) : (<Button variant="primary" type="submit">
            Login
          </Button>)}

        </div>
      </Form>
    </Card>
  );
}

export default Login;
