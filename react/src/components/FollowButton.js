import Button from "react-bootstrap/Button";
import { PersonPlusFill, PersonDashFill } from "react-bootstrap-icons";
import { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";
import { createFollow, deleteFollow } from "../data/dbrepository.js";

function FollowButton(props) {
  const { currentUser } = useContext(UserContext);

  const [following, setFollowing] = useState(props.default);

  const followUser = async () => {
    //Store the id of the user to be followed, and the current user
    const follow = {
      followingId: props.userId,
      userId: currentUser,
    };

    //Call createFollow method which saves the follow details to db
    await createFollow(follow);
  };

  const unfollowUser = async () => {

    const follow = {
      followingId: props.userId,
      userId: currentUser,
    };


    await deleteFollow(follow);

  };


  return (
    <div>
      {following ? (
        <Button variant="outline-danger" type="submit" onClick={unfollowUser}>
          <PersonDashFill size={20} /> Unfollow
        </Button>
      ) : (
        <Button variant="primary" type="submit" onClick={followUser}>
          <PersonPlusFill size={20} /> Follow
        </Button>
      )}
    </div>
  );
}

export default FollowButton;
