import Button from "react-bootstrap/Button";
import { PersonPlusFill } from "react-bootstrap-icons";
import { useContext } from "react";
import UserContext from "../contexts/UserContext";
import { createFollow } from "../data/dbrepository.js";

function FollowButton(props) {

  const { currentUser } = useContext(UserContext);

  const followUser = async () => {
    console.log(currentUser + " followed " + props.userId);

    const follow = {
      followingId: props.userId,
      userId: currentUser
    };
    console.log(follow);

    await createFollow(follow);
  };

  return (
    <Button variant="primary" type="submit" onClick={followUser}>
      <PersonPlusFill size={20} /> Follow
    </Button>
  );
}

export default FollowButton;
