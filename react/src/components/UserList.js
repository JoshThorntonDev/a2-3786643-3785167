import ProfileCard from "./ProfileCard";
import ReactPaginate from "react-paginate";
import { useContext, useState } from "react";
import UserContext from "../contexts/UserContext";

function UserList(props) {
  const { currentUser } = useContext(UserContext);

  const [page, setPage] = useState(0);

  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  const pageSize = 6; // number of profiles to display per page
  const pageCount = Math.ceil(props.users.length / pageSize); // finds the number of pages needed to fit all profiles
  const offset = page * pageSize; // keeps track of where the first profile of each page is
  const profilesToDisplay = props.users.slice(offset, offset + pageSize); // selects only the profiles on the current page

  return (
    <div>
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
      {profilesToDisplay.map((user) => (
        <div>
          {user.id !== Number(currentUser) ? ( // dont list current user
            <div key={user.id}>
              <ProfileCard user={user} listed={true} />
            </div>
          ) : (
            <div></div>
          )}
        </div>
      ))}
    </div>
  );
}

export default UserList;

// takes a list of users as a prop
// creates and returns a ProfileCard for each user
