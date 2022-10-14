import { useEffect, useState, useContext } from "react";
import Spinner from "react-bootstrap/Spinner";
import { getFollows, getUsers } from "../data/dbrepository";
import PlaceholderPost from "./PlaceholderPost";
import UserList from "./UserList";
import UserContext from "../contexts/UserContext";

function AllUsersList() {
  const [allUsers, setAllUsers] = useState([]);
  const [allFollows, setAllFollows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {

    async function getAllUsers() {
      const users = await getUsers();
      const follows = await getFollows()

      if (users !== null) {
        var usersToSet = users.filter((user) => user.id > 100); 
        // dont display users with id under 100, reserved for admin use and special cases

        setAllUsers(usersToSet);
      }

      if (follows !== null) {
        var followsToSet = follows.filter((follow) => follow.userId === Number(currentUser)); 


        setAllFollows(followsToSet);
      }

      setTimeout(() => {
        // in case the db responds extremely quickly, prevent loading animation from looking bad
        setIsLoading(false);
      }, 300);
    }

    getAllUsers();
  }, []);

  return (
    <div>
      <h1>All Users</h1>
      <p>
        Here, you can find new users to follow and see their posts in your feed.
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
        ) : allUsers.length === 0 ? (
          <span className="text-muted">No user profiles were found</span>
        ) : (
          <UserList users={allUsers}></UserList>
        )}
      </div>
    </div>
  );
}

export default AllUsersList;
