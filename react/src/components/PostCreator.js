import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useRef, useState } from "react";
import { CheckCircleFill } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import AnimatedAlert from "./AnimatedAlert";
import { createPost, updatePost } from "../data/dbrepository";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Spinner from "react-bootstrap/Spinner";

// props:
// type - valid values, null, EDIT, REPLY - null is for normal post creation
// update: a setter for a post's child, it given the newPost after saving if type is REPLY, allows new reply to be rendered without querying db
// updater: a setter with fields content and image. Used to update the content and image fields of a post

// this component can create and edit posts. By default, it will only create, but setting type to "EDIT" will put it in editing mode
function PostCreator(props) {
  const MAX_LENGTH = 600; // maximum length of posts
  const MIN_SAVE_TIME = 500; // minimum save time so the save animation can play, should always be less than 1000, and greater than 300

  const inputRef = useRef(null);
  const imageRef = useRef(null);

  const getContentLength = () => {
    return props.fields.content.replace(/<(.|\n)*?>/g, "").trim().length;
  };

  var title;

  switch (props.type) {
    case "REPLY":
      title = "Replying";
      break;

    case "EDIT":
      title = "Editing";
      break;

    default:
      title = "New Post";
  }

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
  const [saving, setSaving] = useState(false);

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
      var depth = 0;

      if (props.type === "REPLY") {
        depth = props.fields.depth + 1;
      }

      const newPost = {
        content: props.fields.content,
        image: props.fields.image,
        userId: props.fields.userId,
        depth: depth,
        replyId: props.fields.replyId,
        updatedAt: new Date(), // ensure a valid date is ALWAYS set
      };

      setSaving(true); // changes save button to show save animation

      var storedPost;

      if (props.type === "EDIT") {
        newPost.id = props.fields.id;

        storedPost = await updatePost(newPost);
      } else {
        storedPost = await createPost(newPost);
      }

      setTimeout(() => {
        // force saving to always take a minimum amount of time to let user see saving animation

        props.toggle();
        setTimeout(() => {
          if (props.type === "REPLY") {
            props.update(storedPost); // give the reply to the parent post so it can be rerendered without using the db
          } else if (props.type === "EDIT") {
            props.updater({ content: newPost.content, image: newPost.image });
          }

          setSaving(false);
        }, MIN_SAVE_TIME - 300); // this prevents the button changing back to normal while still visible
      }, MIN_SAVE_TIME);

      setMessage("");
    } else {
      // checks failed
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
        <Modal.Title>{title}</Modal.Title>
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
              {props.type === "EDIT" ? "Update your" : "Enter your"} post here
            </Form.Label>

            <ReactQuill
              theme="snow"
              autoFocus
              value={props.fields.content}
              ref={inputRef}
              onChange={handleContentUpdate}
            />

            {getContentLength() <= MAX_LENGTH ? ( // change indicator text to red when exceeded
              <Form.Text muted className="float-end">
                {getContentLength()} / {MAX_LENGTH}
              </Form.Text>
            ) : (
              <Form.Text muted className="float-end">
                <span className="fw-bold">{getContentLength()}</span> /{" "}
                {MAX_LENGTH}
              </Form.Text>
            )}
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
          <Button
            className="saveButton"
            onClick={attemptSave}
            variant="success"
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
                Saving
              </div>
            ) : (
              <div>
                <CheckCircleFill></CheckCircleFill> Save
              </div>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default PostCreator;
