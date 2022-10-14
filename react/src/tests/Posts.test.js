//Tests for Posts page

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PostCreator from "../components/PostCreator.js";
import PostDeleter from "../components/PostDeleter.js";
import UserContext from "../contexts/UserContext.js";

let container;
const currentUser = 2;

//Test for the form of the PostCreator component
//This test checks the PostCreator form has rendered properly and can be submitted
//after filling out the fields
test("Test Post Creator form", () => {
    //Render the PostCreator component
    //NOTE: passes in a prop "default" to provide the PostCreator a default
    //value for the ReactQuill content field. this is because we cannot
    //access and write in react quill elements during tests, so we
    //instead provide the test value through a prop
    const utils = render(
        <PostCreator
            show={true}
            user={currentUser}
            default={"Test Value"}
        />
    );
    container = utils.container;
    
    //Assert that post Creator form has rendered by checking the heading
    expect(screen.getByText("New Post")).toBeInTheDocument();
    
    //Get the image url input field and write in it
    const img = screen.getByPlaceholderText("example.com/file.jpg");
    fireEvent.change(img, { target: {value: "test.com/testimg.jpg" } });
    
    //Assert that the image field value has updated successfully
    expect(img.value).toBe("test.com/testimg.jpg");

    //Get submit button and simulate a click on it
    const submit = screen.getByText("Save");
    fireEvent.click(submit);

    //Assert that the "Saving" message appears, indicating the attemptSave function was called
    expect(screen.getByText("Saving")).toBeInTheDocument();
});

//Tests the form of the PostDeleter component
//This test checks the password verification form when deleting a post, ensuring
//that password can be entered correctly and that the form can be submitted
test("Test Post Deleter form", () => {
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

    //Assert that the "Deleting" message appears, indicating the attemptSave function was called
    expect(screen.getByText("Deleting")).toBeInTheDocument();
});