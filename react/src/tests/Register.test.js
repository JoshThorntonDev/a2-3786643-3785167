//Tests for register component

import {render, screen, fireEvent } from "@testing-library/react";
import Register from "../components/Register";
import UserContext from "../contexts/UserContext";
import { BrowserRouter } from "react-router-dom";
import { validate } from "../components/RegisterValidation.js";

let container;
const NAME_LENGTH = 20;

const login = (id) => {
    localStorage.setItem("currentUser", id);
};

//Render the register component
beforeEach(() => {
    const utils = render(
    <UserContext.Provider value={{ login, NAME_LENGTH }}>
        <BrowserRouter>
            <Register />
        </BrowserRouter>
    </UserContext.Provider>
    );
    container = utils.container;
});

//Test the registration form
//This test checks all the inputs of the registration form, clicks
//the submit button, and ensures that the form was submitted successfully
test("Register Form", () => {
    //Assert that register form has rendered correctly by checking the heading
    expect(screen.getByText("Sign Up")).toBeInTheDocument();

    //Get username, email and password input elements
    const username = screen.getByPlaceholderText("name");
    const email = screen.getByPlaceholderText("email");
    const password = screen.getByPlaceholderText("password");

    //Enter user details
    fireEvent.change(username, { target: { value: "Test" } });
    fireEvent.change(email, { target: { value: "test@email.com" } });
    fireEvent.change(password, { target: { value: "testpass1!" } });

    //Ensure registration fields were updated successfully
    expect(username.value).toBe("Test");
    expect(email.value).toBe("test@email.com");
    expect(password.value).toBe("testpass1!");

    const button = screen.getByText("Create Account");

    //Simulate click on submit button
    fireEvent.click(button);

    //Assert that "Creating" appears, indicating that handleSubmit was called
    expect(screen.getByText("Creating")).toBeInTheDocument();    
});

//Test the validate function used in the registration page
//This test runs the validate function various times, passing a user object
//with invalid details to make sure it picks up on the errors such as 
//missing information or weak password. Finally, it passes in a valid user
//and ensures that no error message is returned, as it has passed validation
test("Validate Function", () => {
    //Create an invalid user (missing name and email, invalid password)
    const user = {
        username: "",
        email: "",
        password: "pass",
    };

    //Assert that validate returns missing name error
    let validateMsg = validate(user, NAME_LENGTH);
    expect(validateMsg).toBe("Name is a required field");
    
    //Give the user a username
    user.username = "Test User";

    //Assert that validate returns missing email error
    validateMsg = validate(user, NAME_LENGTH);
    expect(validateMsg).toBe("Email is a required field");

    //Give the user an email
    user.email = "test@email.com";

    //Assert that validate returns invalid password error
    validateMsg = validate(user, NAME_LENGTH);
    expect(validateMsg).toContain("Password must be at least 8 characters");

    //Give the user a valid password
    user.password = "testpass1!";

    //Expect validate to return no error message as user information is valid
    validateMsg = validate(user, NAME_LENGTH);
    expect(validateMsg).toBe("");
});