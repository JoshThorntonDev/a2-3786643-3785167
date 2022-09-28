import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useRef, useState } from "react";
import { CheckCircleFill } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import AnimatedAlert from "./AnimatedAlert";
import { createPost } from "../data/dbrepository";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// this component can create and edit posts. By default, it will only create, but setting the prop 'editing' to true
// will put it in editing mode
function PostCreator(props) {
  const MAX_LENGTH = 600; // maximum length of posts

  const inputRef = useRef(null);
  const imageRef = useRef(null);

  const getContentLength = () => {
    return props.fields.content.replace(/<(.|\n)*?>/g, "").trim().length;
  };

  const handleInputChange = (event) => {
    props.setFields({
      ...props.fields,
      [event.target.name]: event.target.value,
    });
  };

  const handleContentUpdate = (event) => {
    props.setFields({
      ...props.fields,
      content: event,
    });
  };

  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const attemptSave = async (event) => {
    const imageRegex = new RegExp("(.png|.jpg|.jpeg|.gif|.bmp)$");

    setMessage(""); // clear error message
    setError(false); // reset error state
    event.preventDefault(); // prevent form from submitting

    var imageOK = false;
    if (props.fields.image === "") {
      // no image, so no need to check if its a picture
      imageOK = true;
    } else if (
      props.fields.image !== "" &&
      imageRegex.test(props.fields.image)
    ) {
      // if there is a url, check if it ends with .png, .jpg/jpeg, .gif or .bmp
      // this doesn't absolutely ensure that a url points to an image, but it'll prevent most invalid submissions
      imageOK = true;
    }

    if (
      // ensure content isnt just whitespace, isnt too large, and that the image url is valid
      getContentLength() !== 0 &&
      getContentLength() <= MAX_LENGTH &&
      imageOK
    ) {
      const newPost = {
        content: props.fields.content,
        image: props.fields.image,
        user_id: props.fields.userId,
      };
      await createPost(newPost);

      props.toggle(); // close modal
      setMessage("");
    } else {
      setError(true);
      if (imageOK) {
        inputRef.current.focus(); // focus on post entry field
        setMessage(`Posts must be between 1 and ${MAX_LENGTH} characters`);
      } else {
        imageRef.current.focus(); // focus on image entry field
        setMessage(
          "Sorry, your URL is invalid, supported URLs end with one of the following: .jpg | .jpeg | .png | .gif | .bmp"
        );
      }
    }
  };

  return (
    <Modal show={props.show} onHide={props.toggle}>
      <Modal.Header closeButton>
        <Modal.Title>{props.editing ? "Edit Post" : "New Post"}</Modal.Title>
      </Modal.Header>
      <AnimatedAlert
        variant="danger"
        message={message}
        display={error}
        setDisplay={setError}
      />
      <Form onSubmit={attemptSave}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>
              {props.editing ? "Update your" : "Enter your"} post here
            </Form.Label>

            <ReactQuill
              theme="snow"
              autoFocus
              value={props.fields.content}
              ref={inputRef}
              onChange={handleContentUpdate}
            />
            <Form.Text muted className="float-end">
              {getContentLength()} / {MAX_LENGTH}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image URL (Optional)</Form.Label>
            <Form.Control
              name="image"
              type="text"
              placeholder="example.com/file.jpg"
              value={props.fields.image}
              onChange={handleInputChange}
              ref={imageRef}
            />
            <Form.Text muted className="float-end">
              This must be a direct link to an image.
            </Form.Text>
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

export default PostCreator;
