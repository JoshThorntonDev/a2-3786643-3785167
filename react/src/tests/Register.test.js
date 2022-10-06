//Tests for register page

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
test("Register Form", () => {
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

    //Simulate click on submit button and wait for redirect
    fireEvent.click(button);

    //Assert that "Creating" appears in the document after form is submitted
    expect(screen.getByText("Creating")).toBeInTheDocument();    
});

//Test the validate function used in the registration page
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

    //Expect validate to return no error message as user is valid
    validateMsg = validate(user, NAME_LENGTH);
    expect(validateMsg).toBe("");
});