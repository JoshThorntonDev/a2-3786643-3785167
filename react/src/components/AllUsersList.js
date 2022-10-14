import { useEffect, useState, useContext } from "react";
import Spinner from "react-bootstrap/Spinner";
import { findFollowedUsers, findUser, getUsers } from "../data/dbrepository";
import PlaceholderPost from "./PlaceholderPost";
import UserList from "./UserList";
import UserContext from "../contexts/UserContext";
import "./css/Profile.css";
import Form from "react-bootstrap/Form";
import ReactPaginate from "react-paginate";

function AllUsersList() {
  const [allUsers, setAllUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useContext(UserContext);
  const [showType, setShowType] = useState("all"); // show type can be 'all' or 'following'

  const changeShowType = (type) => {
    setShowType(type);
    setIsLoading(true);
  };

  useEffect(() => {
    async function getAllUsers() {
      const users = await getUsers();

      if (users !== null) {
        var usersToSet = users.filter((user) => user.id > 100);
        // dont display users with id under 100, reserved for admin use and special cases

        // dont display the currently logged in user
        usersToSet = usersToSet.filter(
          (user) => user.id !== Number(currentUser)
        );

        setAllUsers(usersToSet);
      }

      setIsLoading(false);
    }

    async function getFollowedUsers() {
      const users = await findFollowedUsers(Number(currentUser));

      var usersToSet = [];

      if (users !== null) {
        users.forEach(async (user) => {
          const temp = await findUser(user.followingId);
          usersToSet.push(temp);
        });
        setAllUsers(usersToSet);
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }

    if (showType === "all") {
      getAllUsers();
    }

    if (showType === "following") {
      getFollowedUsers();
    }
  }, [showType, currentUser]);

  const [page, setPage] = useState(0);

  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  const pageSize = 6; // number of profiles to display per page
  const pageCount = Math.ceil(allUsers.length / pageSize); // finds the number of pages needed to fit all profiles
  const offset = page * pageSize; // keeps track of where the first profile of each page is
  const profilesToDisplay = allUsers.slice(offset, offset + pageSize); // selects only the profiles on the current page

  return (
    <div>
      <h1>Users</h1>
      <p>
        Here, you can find new users to follow, or see who you're currently
        following.
      </p>{" "}
      <div className="d-flex justify-content-between">
        <ReactPaginate
          onPageChange={handlePageClick}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          previousLabel="Previous"
          nextLabel="Next"
          breakLabel="..."
          containerClassName="pagination"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousLinkClassName="page-link"
          nextLinkClassName="page-link"
          breakClassName="page-link"
          activeClassName="active"
        />

        <Form>
          <Form.Group>
            <Form.Label>
              <strong>Show:</strong>
            </Form.Label>
            <Form.Select onChange={(e) => changeShowType(e.target.value)}>
              <option value="all">All Users</option>
              <option value="following">Followed Users</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </div>
      <div>
        {isLoading ? (
          <div className="fade-in d-flex justify-content-center">
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
          <UserList profilesToDisplay={profilesToDisplay}></UserList>
        )}
      </div>
    </div>
  );
}

export default AllUsersList;
