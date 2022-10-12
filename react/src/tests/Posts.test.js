//Tests for Posts page

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Posts from "../components/Posts.js";
import PostCreator from "../components/PostCreator.js";
import PostDeleter from "../components/PostDeleter.js";
import UserContext from "../contexts/UserContext.js";
import { EnvelopeExclamation } from "react-bootstrap-icons";

let container;
const currentUser = 2;

//Tests the form of the PostDeleter component
test("Test Post Deleter form", async () => {
    //Render the PostDeleter component
    const utils = render(
        <UserContext.Provider value={currentUser}>
            <PostDeleter
            show={true}
            />
        </UserContext.Provider>
    );
    container = utils.container;
    
    //Assert that the Post Deleter form has rendered by checking the heading
    expect(screen.getByText("Delete Post")).toBeInTheDocument();

    //Get the password verification input element and enter the user's password
    const pass = screen.getByPlaceholderText("Enter your password here");
    fireEvent.change(pass, { target: {value: "password1!" } });

    //Assert that the password field has been updated successfully
    expect(pass.value).toBe("password1!");
    
    //Get submit button and simulate a click on it
    const submit = screen.getByText("Delete");
    fireEvent.click(submit);

    //Assert that the "Deleting" message appears, indicating succesful form submission
    expect(screen.getByText("Deleting")).toBeInTheDocument();
});