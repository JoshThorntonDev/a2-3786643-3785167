import { useEffect, useState, useContext } from "react";
import Spinner from "react-bootstrap/Spinner";
import {
  findFollowedUsers,
  findUser,
  getFollows,
  getUsers,
} from "../data/dbrepository";
import PlaceholderPost from "./PlaceholderPost";
import UserList from "./UserList";
import UserContext from "../contexts/UserContext";

function AllUsersList() {
  const [allUsers, setAllUsers] = useState([]);
  const [allFollows, setAllFollows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useContext(UserContext);
  const [showType, setShowType] = useState("all"); // show type can be 'all' or 'following'

  const changeShowType = (type) => {
    setShowType(type);
  };

  useEffect(() => {
    setIsLoading(true)
    async function getAllUsers() {
      const users = await getUsers();
      const follows = await getFollows();

      if (users !== null) {
        var usersToSet = users.filter((user) => user.id > 100);
        // dont display users with id under 100, reserved for admin use and special cases

        setAllUsers(usersToSet);
      }

      if (follows !== null) {
        var followsToSet = follows.filter(
          (follow) => follow.userId === Number(currentUser)
        );

        setAllFollows(followsToSet);
      }

      setTimeout(() => {
        // in case the db responds extremely quickly, prevent loading animation from looking bad
        setIsLoading(false);
      }, 300);
    }

    async function getFollowedUsers() {
      const users = await findFollowedUsers(Number(currentUser));

      var usersToSet = [];

      if (users !== null) {
        users.forEach(async (user) => {
          const temp = await findUser(user.followingId);
          usersToSet.push(temp);
        });
      }

      setAllUsers(usersToSet);

      if (users !== null) {
        var followsToSet = users.filter(
          (user) => user.userId === Number(currentUser)
        );

        setAllFollows(followsToSet);
      }

      setTimeout(() => {
        // in case the db responds extremely quickly, prevent loading animation from looking bad
        setIsLoading(false);
      }, 300);
    }

    if (showType === "all") {
      getAllUsers();
    }

    if (showType === "following") {
      getFollowedUsers();
    }
  }, [showType]);

  return (
    <div>
      <h1>Users</h1>
      <p>
        Here, you can find new users to follow, or see who you're currently
        following.
      </p>

      <div>
        {isLoading ? (
          <div className="d-flex justify-content-center">
            <div>
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>{" "}
              Loading user profiles
              <br></br>
              <PlaceholderPost />
              <br></br>
              <PlaceholderPost />
              <br></br>
              <PlaceholderPost />
            </div>
          </div>
        ) : (
          <UserList showType={showType} change={changeShowType} users={allUsers}></UserList>
        )}
      </div>
    </div>
  );
}

export default AllUsersList;
