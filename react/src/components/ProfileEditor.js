import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useContext, useEffect, useRef, useState } from "react";
import { CheckCircleFill } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import AnimatedAlert from "./AnimatedAlert";
import UserContext from "../contexts/UserContext";
import { editUser, verifyUser, findUserByName } from "../data/dbrepository";
import Spinner from "react-bootstrap/Spinner";

// this function renders a modal containing a form that can edit user information
// currently, it supports changing the name, and can be updated to also edit email and password if required

// required props are:
// show (boolean)
// toggle (function, preferably one that clears `fields` and changes `show`)
// user, with name and email fields

function ProfileEditor(props) {
  const { NAME_LENGTH } = useContext(UserContext);


  const [saving, setSaving] = useState(false);

  const [fields, setFields] = useState({
    // a field storing all possible user data, currently only name is editable
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (event) => {
    setFields({
      ...fields,
      [event.target.name]: event.target.value,
    });
  };

  const passwordRef = useRef(null);
  const nameRef = useRef(null);

  const [error, setError] = useState(false); // shows red alert
  const [success, setSuccess] = useState(false); // shows green alert
  const [message, setMessage] = useState(""); // message in alert

  useEffect(() => { // clear everything if the modal is closed
    if (!props.show) {
      setFields({
        name: "",
        email: "",
        password: "",
      });
      setError(false);
      setSuccess(false)
      setMessage("")
      setSaving(false)
    }
  }, [props.show]);

  const attemptSave = async (event) => {
    setSaving(true);
    setMessage(""); // clear error message
    setError(false); // reset error state
    event.preventDefault(); // prevent form from submitting

    if (fields.name === "") {
      setMessage("Sorry, blank names are not permitted");
      setError(true);
      nameRef.current.focus();
      setSaving(false);
      return;
    }

    //Ensure username is unique
    if ((await findUserByName(fields.name)) !== null) {
      setMessage("Sorry, that username is already in use");
      setError(true);
      nameRef.current.focus();
      setSaving(false);
      return;
    }

    const editTarget = await verifyUser(
      // get the user that we're editing
      props.user.email,
      fields.password
    );

    if (editTarget === null) {
      setMessage("Sorry, your password was incorrect");
      setError(true);
      passwordRef.current.focus(); // focus on password field
      setSaving(false);
    } else {
      //show confirmation message before redirecting

      editTarget.username = fields.name; // set the new name

      const updatedUser = await editUser(editTarget); // save user
      setMessage("Profile update successful");
      setSuccess(true);

      setTimeout(() => {

        props.toggle(); // close modal
        props.setUser(updatedUser); // tell Profile it was updated and needs to rerender

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
        display={success}
        setDisplay={setSuccess}
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
              value={fields.name}
              onChange={handleInputChange}
              required
              ref={nameRef}
            />
            <Form.Text muted className="float-end">
              {fields.name.trim().length} / {NAME_LENGTH}
              {/* .trim() prevents the counter increasing when the post starts and ends with whitespace */}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirmation Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              placeholder="Enter your password here"
              value={fields.password}
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
          {saving ? (
            <Button className="saveButton" onClick={attemptSave} variant="success" type="submit" disabled>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              Saving
            </Button>
          ) : (
            <Button className="saveButton" onClick={attemptSave} variant="success" type="submit">
              <CheckCircleFill></CheckCircleFill> Save
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
export default ProfileEditor;