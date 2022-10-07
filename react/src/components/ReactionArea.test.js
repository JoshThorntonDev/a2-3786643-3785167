import { render, screen, fireEvent } from "@testing-library/react";
import ReactionArea from "./ReactionArea";

let container;


let likeCount;
let dislikeCount;
let defaultValue; // sets whether post should immediately be set as liked or disliked, accepts 'like' and 'dislike'
let otherValue;

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

test("Like starts active when set with default prop", () => {
  const likeButton = screen.getByRole(defaultValue);

  expect(likeButton).toHaveClass("active");
});

test("Like loses active when it is clicked", () => {
  const likeButton = screen.getByRole(defaultValue);
  fireEvent.click(likeButton);

  expect(likeButton).not.toHaveClass("active");
});

test("Like loses active when dislike is clicked", () => {
  const likeButton = screen.getByRole(defaultValue);
  const dislikeButton = screen.getByRole(otherValue);

  fireEvent.click(dislikeButton);
  expect(likeButton).not.toHaveClass("active");
});

test("Like and dislike should be set correctly", () => {
  const likeButton = screen.getByRole(defaultValue);
  const dislikeButton = screen.getByRole(otherValue);

  expect(likeButton).toHaveTextContent(likeCount);
  expect(dislikeButton).toHaveTextContent(dislikeCount);
});

test("Clicking like decreases number, as its already active", () => {
  const likeButton = screen.getByRole(defaultValue);

  expect(likeButton).toHaveTextContent(likeCount);

  fireEvent.click(likeButton);
  expect(likeButton).toHaveTextContent(likeCount - 1);
});

test("Clicking dislike decreases like, and increases dislike", () => {
  const likeButton = screen.getByRole(defaultValue);
  const dislikeButton = screen.getByRole(otherValue);

  fireEvent.click(dislikeButton);

  expect(likeButton).toHaveTextContent(likeCount - 1);
  expect(dislikeButton).toHaveTextContent(dislikeCount + 1);
});

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


