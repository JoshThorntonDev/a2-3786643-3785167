// bootstrap for styling
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Card from "react-bootstrap/Card";
import AnimatedAlert from "./AnimatedAlert";
import { insertUser } from "../data/Repository.js";
import { validate } from "./RegisterValidation.js";

//react components
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";

function Register() {
  const { login } = useContext(UserContext);
  const { NAME_LENGTH } = useContext(UserContext);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    date: "",
    posts: [],
  });
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleSubmit = (e) => {
    setError(false); //clear error
    setMessage(""); //clear message

    e.preventDefault(); //prevent form from submitting automatically

    //Call validate function, store error message as string, give it NAME_LENGTH because we can't use context in it
    let validateMessage = validate(user, NAME_LENGTH);

    //if there's an error message, set Error to true,
    //save the message and return
    if (validateMessage !== "") {
      setError(true);
      setMessage(validateMessage);
      return;
    }

    //Save todays date as a string
    const date = new Date().toDateString();

    //Store user's registration date along with their details
    user.date = date;

    //After passing validation, insert user into local storage
    insertUser(user);

    //Log the user in and redirect them

    setShow(true);
    setTimeout(() => {
      // this timeout is just to pretend that we have to wait for a db response
      login(user.email);
      navigate("/profile", { replace: true });
    }, 1500);
  };

  return (
    <Card>
      <Card.Header>
        <h2 className="mb-1 d-flex justify-content-center">Sign Up</h2>
      </Card.Header>
      <Form className="mb-3 loginForm" onSubmit={handleSubmit}>
        <AnimatedAlert
          variant="danger"
          message={message}
          display={error}
          setDisplay={setError}
        />
        <AnimatedAlert
          variant="success"
          message="Account creation successful!"
          display={show}
          setDisplay={setShow}
        />
        <FloatingLabel label="Name" className="mb-3">
          <Form.Control
            type="text"
            name="name"
            placeholder="name"
            value={user.name}
            onChange={handleInputChange}
            maxLength={NAME_LENGTH}
          />
          <Form.Text muted className="float-end">
            {user.name.trim().length} / {NAME_LENGTH}
            {/* .trim() prevents the counter increasing when the text starts and ends with whitespace */}
          </Form.Text>
        </FloatingLabel>
        <br />
        <FloatingLabel label="Email" className="mb-3">
          <Form.Control
            type="email"
            name="email"
            placeholder="email"
            value={user.email}
            onChange={handleInputChange}
          />
        </FloatingLabel>
        <hr></hr>
        <FloatingLabel label="Password" className="mb-3">
          <Form.Control
            type="password"
            name="password"
            placeholder="password"
            value={user.password}
            onChange={handleInputChange}
          />
        </FloatingLabel>
        <div className="d-flex justify-content-center">
          <Button variant="success" type="submit">
            Create Account
          </Button>
        </div>
      </Form>
    </Card>
  );
}

export default Register;
