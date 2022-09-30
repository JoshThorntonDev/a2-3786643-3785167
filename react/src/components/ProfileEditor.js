import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useContext, useRef, useState } from "react";
import { CheckCircleFill } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import AnimatedAlert from "./AnimatedAlert";
import UserContext from "../contexts/UserContext";
import { editUser, verifyUser } from "../data/dbrepository";

// this function renders a modal containing a form that can edit user information
// currently, it supports changing the name, and can be updated to also edit email and password if required

// required props are:
// show (boolean)
// toggle (function, preferably one that clears `fields` and changes `show`)
// fields (containing email, name and password)
// setFields
function ProfileEditor(props) {
  const { NAME_LENGTH } = useContext(UserContext);
  // get users and current users so we dont have to have ugly things like props.users[props.currentUser].password

  const handleInputChange = (event) => {
    props.setFields({
      ...props.fields,
      [event.target.name]: event.target.value,
    });
  };

  const passwordRef = useRef(null);
  const nameRef = useRef(null);

  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  const attemptSave = async (event) => {
    setMessage(""); // clear error message
    setError(false); // reset error state
    event.preventDefault(); // prevent form from submitting

    if (props.fields.name === "") {
      setMessage("Sorry, blank names are not permitted");
      setError(true);
      nameRef.current.focus();
      return;
    }

    const editTarget = await verifyUser(
      props.user.email,
      props.fields.password
    );

    if (editTarget === null) {
      setMessage("Sorry, your password was incorrect");
      setError(true);
      passwordRef.current.focus(); // focus on password field
    } else {
      //show confirmation message before redirecting

      editTarget.username = props.fields.name;

      editUser(editTarget);
      setMessage("Profile update successful");
      setShow(true);

      setTimeout(() => {
        setShow(false);
        props.toggle();
      }, 800);
    }
  };

  return (
    <Modal show={props.show} onHide={props.toggle}>
      <Modal.Header closeButton>
        <Modal.Title>Profile Editor</Modal.Title>
      </Modal.Header>
      <AnimatedAlert
        variant="danger"
        message={message}
        display={error}
        setDisplay={setError}
      />
      <AnimatedAlert
        variant="success"
        message={message}
        display={show}
        setDisplay={setShow}
      />
      <Form onSubmit={attemptSave}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>New Username</Form.Label>
            <Form.Control
              name="name"
              type="text"
              placeholder={props.user.username}
              autoFocus
              maxLength={NAME_LENGTH}
              value={props.fields.name}
              onChange={handleInputChange}
              required
              ref={nameRef}
            />
            <Form.Text muted className="float-end">
              {props.fields.name.trim().length} / {NAME_LENGTH}
              {/* .trim() prevents the counter increasing when the post starts and ends with whitespace */}
            </Form.Text>
          </Form.Group>
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
          <Button onClick={attemptSave} variant="success" type="submit">
            <CheckCircleFill></CheckCircleFill> Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
export default ProfileEditor;
