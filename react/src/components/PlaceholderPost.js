import Placeholder from "react-bootstrap/Placeholder";
import Card from "react-bootstrap/Card";


function PlaceholderPost() {

    return (
        <Card style={{ width: "70vw"}}>
              <Card.Body>
                <Placeholder as={Card.Title} animation="glow">
                  <Placeholder xs={6} />
                </Placeholder>
                <Placeholder as={Card.Text} animation="glow">
                  <Placeholder xs={7} /> <Placeholder xs={4} />{" "}
                  <Placeholder xs={4} /> <Placeholder xs={6} />{" "}
                  <Placeholder xs={8} />
                </Placeholder>
              </Card.Body>
              <Card.Footer>
                <Placeholder className="d-flex justify-content-between" as={Card.Text} animation="glow">
                  <Placeholder xs={2} /><Placeholder xs={1} />
                </Placeholder>
              </Card.Footer>
            </Card>
    )
}

export default PlaceholderPost