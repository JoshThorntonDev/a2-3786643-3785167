import { useEffect, useRef, useState } from "react";
import {
  HandThumbsDown,
  HandThumbsDownFill,
  HandThumbsUp,
  HandThumbsUpFill,
} from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import { createReaction, deleteReaction } from "../data/dbrepository";
import "./css/ReactionArea.css";

function ReactionArea(props) {
  const [value, setValue] = useState(props.default);
  const [currentId, setCurrentId] = useState(props.defaultId);
  const [likes, setLikes] = useState(props.likes);
  const [dislikes, setDislikes] = useState(props.dislikes);

  const likeButton = useRef();
  const dislikeButton = useRef();

  useEffect(() => { // ensures post updates its reactions if we're still waiting for the db to respond
    setLikes(props.likes);
    setDislikes(props.dislikes);
    setValue(props.default);
    setCurrentId(props.defaultId);
  }, [props]);

  const handleChange = async (e) => {
    var type = e.currentTarget.value;

    const reaction = {
      // create a reaction object, ensure ids arent strings
      userId: Number(props.userId),
      postId: Number(props.postId),
      type: type,
      id: Number(currentId), // the reaction's id for if it is already in the db
    };

    likeButton.current.blur(); // bootstrap makes the buttons look like they are still selected unless we blur
    dislikeButton.current.blur();

    switch (true) {
      case type === value: // when its already selected, remove the reaction
        if (type === "like") {
          setLikes(likes - 1);
          deleteReaction(reaction);
        } else {
          setDislikes(dislikes - 1);
          deleteReaction(reaction);
        }
        setValue("");

        break;

      case type === "like":
        if (value === "dislike") {
          // if the other reaction type is selected, remove it
          setDislikes(dislikes - 1);
          deleteReaction(reaction);
        }

        setLikes(likes + 1);
        setValue(type);

        var res = await createReaction(reaction);
        setCurrentId(res.id);

        break;

      case type === "dislike":
        if (value === "like") {
          // if the other reaction type is selected, remove it
          setLikes(likes - 1);
          deleteReaction(reaction);
        }

        setDislikes(dislikes + 1);
        setValue(type);

        var res = await createReaction(reaction);
        setCurrentId(res.id); // store id of new reaction in state in case user want to remove it

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
