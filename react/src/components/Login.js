import "./css/Login.css";

// bootstrap for styling
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Card from "react-bootstrap/Card";

import AnimatedAlert from "./AnimatedAlert";

import { getUsers } from "../data/Repository";

// react components for functionality
import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const users = getUsers();

  const { login } = useContext(UserContext);

  const passwordRef = useRef(null);
  const emailRef = useRef(null);

  const attemptLogin = (e) => {
    setError(false); // clear error in case user has set it already
    e.preventDefault(); // prevent form from submitting automatically

    if (email in users) {
      if (password === users[email]["password"]) {
        setShow(true);

        setTimeout(() => {
          navigate("/profile", { replace: true });
          login(email); // user successfully logged in
        }, 1500);
      } else {
        setError(true); // password is wrong
        passwordRef.current.focus(); // focus on password input
      }
    } else {
      setError(true); // email is wrong/doesnt exist
      emailRef.current.focus(); // focus on email input
    }
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
        message="Welcome back! We're redirecting you now"
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
          ref={passwordRef}
          required
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
      </FloatingLabel>

      <div className="d-flex justify-content-center">
        <Button variant="primary" type="submit">
          Login
        </Button>
      </div>
    </Form>
    </Card>
  );
}

export default Login;
