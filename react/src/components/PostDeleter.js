import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useContext, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import AnimatedAlert from "./AnimatedAlert";
import UserContext from "../contexts/UserContext";
import { deletePost, findUser, verifyUser } from "../data/dbrepository";
import Spinner from "react-bootstrap/Spinner";
import { Trash } from "react-bootstrap-icons";
import PostContext from "../contexts/PostContext";

//renders a modal that allows the user to delete their post
// similar to the ProfileEditor function, but only takes an input of confirmation password

// required props are:
// show (boolean)
// toggle (function, preferably one that clears `fields` and changes `show`)
// fields (containing email, name, date and password)
// setFields
function PostDeleter(props) {
  const { currentUser } = useContext(UserContext);


  const {checkForPosts} = useContext(PostContext)

  const passwordRef = useRef(null);

  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  const [saving, setSaving] = useState(false);

  const [fields, setFields] = useState({
    password: "",
  });

  const handleInputChange = (event) => {
    setFields({
      ...fields,
      [event.target.name]: event.target.value,
    });
  };

  const attemptSave = async (event) => {
    event.preventDefault(); // prevent form from submitting

    setSaving(true);
    const current = await findUser(currentUser);
    const verifiedUser = await verifyUser(current.email, fields.password);

    setMessage(""); // clear error message
    setError(false); // reset error state

    if (verifiedUser === null) {
      setMessage("Sorry, your password was incorrect");
      setError(true);
      passwordRef.current.focus(); // focus on password field
      setSaving(false);
    } else {
      //delete post and show confirmation message
      setShow(true);

      await deletePost(props.post);
      setMessage("Post deleted successfully");

      setTimeout(() => {
        props.toggle();
        setShow(false);
        setMessage("");

        checkForPosts()


        setSaving(false);
      }, 1000);
    }
  };

  return (
    <Modal show={props.show} onHide={props.toggle}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Post</Modal.Title>
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
          <p>Are you sure you wish to delete this post?</p>
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
          <Button
            className="saveButton"
            onClick={attemptSave}
            variant="danger"
            type="submit"
          >
            {saving ? (
              <div>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Deleting
              </div>
            ) : (
              <div>
                <Trash /> Delete
              </div>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
export default PostDeleter;
