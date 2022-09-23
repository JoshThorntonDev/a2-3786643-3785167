import Alert from "react-bootstrap/Alert";
import Collapse from "react-bootstrap/Collapse";

function AnimatedAlert(props) {
  return (
    <Collapse in={props.display}>
      <div>
        <Alert
          variant={props.variant}
          onClose={() => props.setDisplay(false)}
          dismissible
        >
          {props.message}
        </Alert>
      </div>
    </Collapse>
  );
}

export default AnimatedAlert;

// valid values for variant:

// 'primary'
// 'secondary'
// 'success'
// 'danger'
// 'warning'
// 'info'
// 'light'
// 'dark'
// from https://react-bootstrap.github.io/components/alerts/
