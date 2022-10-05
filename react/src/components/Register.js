// bootstrap for styling
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Card from "react-bootstrap/Card";
import AnimatedAlert from "./AnimatedAlert";
import { findUserByEmail, createUser } from "../data/dbrepository.js";
import { validate } from "./RegisterValidation.js";

//react components
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";

function Register() {
  const { login } = useContext(UserContext);
  const { NAME_LENGTH } = useContext(UserContext);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    setLoading(true)
    setError(false); //clear error
    setMessage(""); //clear message
    console.log("handleSubmit called");

    e.preventDefault(); //prevent form from submitting automatically


    //Call validate function, store error message as string, give it NAME_LENGTH because we can't use context in it
    let validateMessage = validate(user, NAME_LENGTH);

    //if there's an error message, set Error to true,
    //save the message and return
    if (validateMessage !== "") {
      setError(true);
      setMessage(validateMessage);
      setLoading(false)
      return;
    }

    //Ensure email is unique, after checking it exists to prevent uneeded api calls
    if (await findUserByEmail(user.email) !== null) {
      setError(true);
      setMessage("Sorry, that email is already in use");
      setLoading(false)
      return;
    }

    //Add user to db
    const newUser = await createUser(user);

    //Show welcome message
    setShow(true);

    //Redirect user and set them as logged in
    setTimeout(() => {
      login(newUser.id);
      //TODO: change navigate to profile when its working again
      navigate(`/profile/${newUser.id}`, { replace: true });
    }, 1500);
    setLoading(false)
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
            name="username"
            placeholder="name"
            value={user.username}
            onChange={handleInputChange}
            maxLength={NAME_LENGTH}
          />
          <Form.Text muted className="float-end">
            {user.username.trim().length} / {NAME_LENGTH}
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
          {loading ? (<div><Button variant="success" disabled>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />{" "}Creating
          </Button></div>) : (<Button variant="success" type="submit">
            Create Account
          </Button>)}
        </div>
      </Form>
    </Card>
  );
}

export default Register;
