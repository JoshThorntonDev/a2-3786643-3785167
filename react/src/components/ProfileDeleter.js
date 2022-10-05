import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useContext, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import AnimatedAlert from "./AnimatedAlert";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import { deleteUser, verifyUser } from "../data/dbrepository";

//renders a modal that allows the user to delete their account
// similar to the ProfileEditor function, but only takes an input of confirmation password
//and deletes the user, rather than updating information

// required props are:
// show (boolean)
// toggle (function, preferably one that clears `fields` and changes `show`)
// fields (containing email, name, date and password)
// setFields
function ProfileDeleter(props) {
  const { logout } = useContext(UserContext);
  // get users and current user so we dont have to have ugly things like props.users[props.currentUser].password

  const passwordRef = useRef(null);

  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    props.setFields({
      ...props.fields,
      [event.target.name]: event.target.value,
    });
  };

  const attemptSave = async (event) => {
    setMessage(""); // clear error message
    setError(false); // reset error state
    event.preventDefault(); // prevent form from submitting

    const deleteTarget = await verifyUser(
      props.user.email,
      props.fields.password
    );

    if (deleteTarget === null) {
      setMessage("Sorry, your password was incorrect");
      setError(true);
      passwordRef.current.focus(); // focus on password field
    } else {
      //show confirmation message before redirecting
      setShow(true);
      deleteUser(deleteTarget);
      setMessage("Account deleted successfully");

      setTimeout(() => {
        logout();
        navigate("/", { replace: true });
      }, 1500);
    }
  };

  return (
    <Modal show={props.show} onHide={props.toggle}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Profile</Modal.Title>
      </Modal.Header>
      <AnimatedAlert
        variant="success"
        message={message}
        display={show}
        setDisplay={setShow}
      />
      <AnimatedAlert
        variant="danger"
        message={message}
        display={error}
        setDisplay={setError}
      />
      <Form onSubmit={attemptSave}>
        <Modal.Body>
          <p>Are you sure you wish to delete this account?</p>
          <Form.Group className="mb-3">
            <Form.Label>Confirmation Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              placeholder="Enter your password here"
              value={props.fields.password}
              onChange={handleInputChange}
              required
              ref={passwordRef}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.toggle}>
            Close
          </Button>
          <Button onClick={attemptSave} variant="danger" type="submit">
            Delete
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
export default ProfileDeleter;
