import ProfileCard from "./ProfileCard";
import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";

function UserList(props) {
  const [page, setPage] = useState(0);

  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  const pageSize = 6; // number of profiles to display per page
  const pageCount = Math.ceil(props.users.length / pageSize); // finds the number of pages needed to fit all profiles
  const offset = page * pageSize; // keeps track of where the first profile of each page is
  const profilesToDisplay = props.users.slice(offset, offset + pageSize); // selects only the profiles on the current page

  useEffect(() => {
    console.log(props)
  })

  return (
    <div>
      <div className="d-flex justify-content-between">
        {profilesToDisplay.length !== 0 ? (
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
        ) : (
          <span></span>
        )}

        <Form>
          <Form.Group>
            <Form.Label>
              <strong>Show:</strong>
            </Form.Label>
            <Form.Select
              defaultValue={props.showType}
              onChange={(e) => props.change(e.target.value)}
            >
              <option value="all">All Users</option>
              <option value="following">Followed Users</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </div>
      {props.users.length !== 0 ? (
        <div>
          {" "}
          {profilesToDisplay.map((user) => (
            <div key={user.id}>
              <ProfileCard user={user} listed={true} />
            </div>
          ))}
        </div>
      ) : (
        <div className="fade-in text-muted text-center">
          <h4>No user profiles were found</h4>
        </div>
      )}
    </div>
  );
}

export default UserList;

// takes a list of users as a prop
// creates and returns a ProfileCard for each user
