import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useContext, useRef, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import AnimatedAlert from "./AnimatedAlert";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import { deleteUser, verifyUser } from "../data/dbrepository";
import { Trash } from "react-bootstrap-icons";
import Spinner from "react-bootstrap/Spinner";

//renders a modal that allows the user to delete their account
// similar to the ProfileEditor function, but only takes an input of confirmation password
//and deletes the user, rather than updating information

// required props are:
// show (boolean)
// toggle (function, preferably one that clears `fields` and changes `show`)
// user, with an email field

function ProfileDeleter(props) {
  const { logout } = useContext(UserContext);

  const [fields, setFields] = useState({
    password: "",
  });

  const passwordRef = useRef(null);

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);

  const handleInputChange = (event) => {
    setFields({
      ...fields,
      [event.target.name]: event.target.value,
    });
  };

  const attemptSave = async (event) => {
    setSaving(true);
    setMessage(""); // clear error message
    setError(false); // reset error state
    event.preventDefault(); // prevent form from submitting

    //verify details of user being deleted
    const deleteTarget = await verifyUser(props.user.email, fields.password);

    //if password is incorrect
    if (deleteTarget === null) {
      setMessage("Sorry, your password was incorrect");
      setError(true);
      passwordRef.current.focus(); // focus on password field
      setSaving(false);
    } else {
      //show confirmation message before redirecting
      setSuccess(true);
      deleteUser(deleteTarget);
      setMessage("Account deleted successfully");

      setTimeout(() => {
        logout();

        navigate("/", { replace: true });
      }, 1500);
    }
  };

  useEffect(() => {
    // clear everything if the modal is closed
    if (!props.show) {
      setFields({
        password: "",
      });
      setError(false);
      setSuccess(false);
      setMessage("");

    }
  }, [props.show]);

  return (
    <Modal show={props.show} onHide={props.toggle}>
      <Modal.Header closeButton>
        <Modal.Title>Deleting {props.user.username}'s Profile</Modal.Title>
      </Modal.Header>
      <AnimatedAlert
        variant="success"
        message={message}
        display={success}
        setDisplay={setSuccess}
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
          <p><strong>This cannot be undone!</strong></p>
          <hr></hr>
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
            <Button className="saveButton" onClick={attemptSave} variant="danger" type="submit" disabled>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              Deleting
            </Button>
          ) : (
            <Button className="saveButton" onClick={attemptSave} variant="danger" type="submit">
              <Trash></Trash> Delete
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
export default ProfileDeleter;