import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { getUsers } from "../data/dbrepository";
import PlaceholderPost from "./PlaceholderPost";
import UserList from "./UserList";

function FollowedUserList() {

  const [followedUsers, setFollowedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getFollowedUsers() {

      setTimeout(() => {
        // in case the db responds extremely quickly, prevent loading animation from looking bad
        setIsLoading(false);
      }, 300);
    }

    getFollowedUsers();
  }, []);

  return (
    <div>
      <h1>Following</h1>
      <p>
        &nbsp;
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
        ) : followedUsers.length === 0 ? (
          <span className="text-muted">No accounts have been followed</span>
        ) : (
          <UserList users={followedUsers}></UserList>
        )}
      </div>
    </div>
  );
}

export default FollowedUserList;
