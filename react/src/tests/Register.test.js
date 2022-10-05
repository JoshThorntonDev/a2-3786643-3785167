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

//Test registering a valid user
/*test("Register User", async () => {
    let button = screen.getAllByText("Sign Up");

    //Simulate click on sign up button
    fireEvent.click(button[0]);

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

    button = screen.getByText("Create Account");

    //Simulate click on submit button and wait for redirect
    fireEvent.click(button);

    await delay(3000);
    
    //Assert that user was redirected to profile upon successful login
    expect(global.window.location.href).toContain('/profile');

    //Assert that we are on the new user's profile
    expect(screen.getAllByText("Test", { exact: false })[0]).toBeInTheDocument();
    expect(screen.getByText("test@email.com", { exact: false })).toBeInTheDocument();

}); */

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

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}