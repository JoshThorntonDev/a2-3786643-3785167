import Button from "react-bootstrap/Button";
import { PersonPlusFill } from "react-bootstrap-icons";


function FollowButton() {
  return (
    <Button variant="primary" type="submit">
      <PersonPlusFill size={20} /> Follow
    </Button>
  );
}

export default FollowButton;
