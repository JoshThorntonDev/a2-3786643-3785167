//Tests for ProfileEditor component

import { render, screen, fireEvent } from "@testing-library/react";
import ProfileEditor from "../components/ProfileEditor.js";
import UserContext from "../contexts/UserContext";

let container;
const NAME_LENGTH = 20;
const user = {
    username: "Test User",
    email: "testuser@email.com",
}

//Render the ProfileEditor component
beforeAll( () => {
    const utils = render(
    <UserContext.Provider value={{ NAME_LENGTH }}>
        <ProfileEditor
            show={true}
            user={user}
        />
    </UserContext.Provider>
    );
    container = utils.container;
});

//Test ProfileEditor form
//This test checks all the inputs of the Edit Profile form, ensures that the values
//are updated correctly, and ensures that the form can be submitted once form has been filled out
test("Profile Name Change Form", () => {
    //Get username edit field and update it
    const name = screen.getByPlaceholderText('Test User')
    fireEvent.change(name, { target: { value: "New Name" } });

    //Get password verification field and update it
    const password = screen.getByPlaceholderText('Enter your password here')
    fireEvent.change(password, { target: { value: "password1!" } });

    //Ensure name and password field values are correct
    expect(name.value).toBe("New Name");
    expect(password.value).toBe("password1!");

    //Get submit button and simulate a click
    const button = screen.getByText('Save');
    fireEvent.click(button);

    //Expect "Saving" button to appear after submit, indicating that attemptSave method has been called
    expect(screen.getByText("Saving")).toBeInTheDocument();
});