import { useRef, useState } from "react";
import {
  HandThumbsDown,
  HandThumbsDownFill,
  HandThumbsUp,
  HandThumbsUpFill,
} from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import "./css/ReactionArea.css";

function ReactionArea(props) {
  const [value, setValue] = useState("");

  const [likes, setLikes] = useState(props.likes);
  const [dislikes, setDislikes] = useState(props.dislikes);

  const likeButton = useRef();
  const dislikeButton = useRef();

  const handleChange = (e) => {
    var x = e.currentTarget.value;
    likeButton.current.blur(); // bootstrap makes the buttons look like they are still selected unless we blur
    dislikeButton.current.blur();

    switch (true) {
      case x === value:
        if (x === "like") {
          setLikes(likes - 1);
        } else {
          setDislikes(dislikes - 1);
        }
        setValue("");
        break;

      case x === "like":
        setLikes(likes + 1);
        setValue(x);
        break;

      case x === "dislike":
        setDislikes(dislikes + 1);
        setValue(x);
        break;

      default:
        // shouldnt ever get here
        console.log("REACTION ERROR");
        break;
    }
  };

  return (
    <span className="reaction-area align-middle">
      <Button
        className="reaction-button"
        onClick={handleChange}
        size="sm"
        variant="outline-success"
        value={"like"}
        active={value === "like"}
        ref={likeButton}
      >
        {value === "like" ? <HandThumbsUpFill /> : <HandThumbsUp />} {likes}
      </Button>
      <Button
        className="reaction-button"
        onClick={handleChange}
        size="sm"
        variant="outline-danger"
        value={"dislike"}
        active={value === "dislike"}
        ref={dislikeButton}
      >
        {value === "dislike" ? <HandThumbsDownFill /> : <HandThumbsDown />}{" "}
        {dislikes}
      </Button>
    </span>
  );
}

export default ReactionArea;
