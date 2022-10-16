// these tests are intended to ensure that the user cannot cause the client-side
// version of the reaction area to desync from the information in the database. eg, having too many likes or a button being
// visually selected when it shouldnt be 

// when a button is selected, it is given the class 'active' because it is a bootstrap button.
// this is how we determine which button is currently selected

// every button also has a role that dictates what it will do when clicked; like/dislike
// this role is how we find and click on either the like or dislike button

import { render, screen, fireEvent } from "@testing-library/react";
import ReactionArea from "../components/ReactionArea";

let container;


let likeCount;
let dislikeCount;
let defaultValue; // sets whether post should immediately be set as liked or disliked, accepts 'like' and 'dislike'
let otherValue; // this variable is only used in the test, and is set to the value that isnt in defaultValue

beforeEach(() => {
  likeCount = 10;
  dislikeCount = 1;

  defaultValue = "like";
  otherValue = "dislike";

  const utils = render(
    <ReactionArea
      likes={likeCount}
      dislikes={dislikeCount}
      default={defaultValue}
    />
  );
  container = utils.container;
});

test("Render reaction area", () => {
  expect(container).toBeInTheDocument();
});

// ensure 'default' works correctly
test("Like starts active when set with 'default' prop", () => {
  const likeButton = screen.getByRole(defaultValue);

  expect(likeButton).toHaveClass("active");
});

// ensure that the button becomes inactive when clicked when already active
test("Like loses active when it is clicked", () => {
  const likeButton = screen.getByRole(defaultValue);
  fireEvent.click(likeButton);

  expect(likeButton).not.toHaveClass("active");
});

// ensure that clicking dislike when like is active doesnt leave both buttons appearing active
test("Like loses active when dislike is clicked", () => {
  const likeButton = screen.getByRole(defaultValue);
  const dislikeButton = screen.getByRole(otherValue);

  fireEvent.click(dislikeButton);
  expect(likeButton).not.toHaveClass("active");
});

// ensure that setting the default numbers in the buttons works correctly
test("Like and dislike should be set correctly", () => {
  const likeButton = screen.getByRole(defaultValue);
  const dislikeButton = screen.getByRole(otherValue);

  expect(likeButton).toHaveTextContent(likeCount);
  expect(dislikeButton).toHaveTextContent(dislikeCount);
});

// ensure that because the button is already active, clicking it decreases like count, rather than increasing
test("Clicking like decreases number, as its already active", () => {
  const likeButton = screen.getByRole(defaultValue);

  expect(likeButton).toHaveTextContent(likeCount);

  fireEvent.click(likeButton);
  expect(likeButton).toHaveTextContent(likeCount - 1);
});

// ensure that the values shown match when is expected
test("Clicking dislike decreases like, and increases dislike", () => {
  const likeButton = screen.getByRole(defaultValue);
  const dislikeButton = screen.getByRole(otherValue);

  fireEvent.click(dislikeButton);

  expect(likeButton).toHaveTextContent(likeCount - 1);
  expect(dislikeButton).toHaveTextContent(dislikeCount + 1);
});

// ensure that a user continually clicking a button doesnt allow them to like a post multiple times
test("Clicking like twice should leave value unchanged", () => {
  const likeButton = screen.getByRole(defaultValue);


  fireEvent.click(likeButton);
  fireEvent.click(likeButton);

  expect(likeButton).toHaveTextContent(likeCount);

});

test("Clicking dislike twice should leave dislike value unchanged and decrease like by 1", () => {
  const likeButton = screen.getByRole(defaultValue);
  const dislikeButton = screen.getByRole(otherValue);


  fireEvent.click(dislikeButton);
  fireEvent.click(dislikeButton);

  expect(likeButton).toHaveTextContent(likeCount-1);
  expect(dislikeButton).toHaveTextContent(dislikeCount);
});


