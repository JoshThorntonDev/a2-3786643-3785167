import { useState } from "react";
import { HandThumbsDown, HandThumbsUp } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import "./css/ReactionArea.css";

function ReactionArea(props) {
  const [value, setValue] = useState("");

  const [likes, setLikes] = useState(props.likes);
  const [dislikes, setDislikes] = useState(props.dislikes);

  const handleChange = (e) => {
    var x = e.currentTarget.value;

    // =====like=====
    if (x === "like") {
      if (value === "dislike") {
        // decrease value of dislike if this user had disliked
        setDislikes(dislikes - 1);
      }

      // if it isnt already liked, add to the counter
      if (value !== "like") {
        setLikes(likes + 1);
      }
    }

    // =====dislike=====
    if (x === "dislike") {
      if (value === "like") {
        // decrease value of like if this user had liked
        setLikes(likes - 1);
      }

      // if it isnt already disliked, add to the counter
      if (value !== "dislike") {
        setDislikes(dislikes + 1);
      }
    }

    setValue(e.currentTarget.value);
  };

  return (
    <span className="align-middle">
      <Button
        className="reaction-button"
        onClick={handleChange}
        size="sm"
        variant="outline-success"
        value={"like"}
        active={value === "like"}
      >
        <HandThumbsUp /> {likes}
      </Button>
      <Button
        className="reaction-button"
        onClick={handleChange}
        size="sm"
        variant="outline-danger"
        value={"dislike"}
        active={value === "dislike"}
      >
        <HandThumbsDown /> {dislikes}
      </Button>
    </span>
  );
}

export default ReactionArea;
