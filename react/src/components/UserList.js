import Collapse from "react-bootstrap/Collapse";
import ProfileCard from "./ProfileCard";

function UserList(props) {
  return (
    <div>
      <Collapse appear in>
        {props.profilesToDisplay !== 0 ? (
          <div>
            {" "}
            {props.profilesToDisplay.map((user) => (
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
      </Collapse>
    </div>
  );
}

export default UserList;

// takes a list of users as a prop
// creates and returns a ProfileCard for each user
