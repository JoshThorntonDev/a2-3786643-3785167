//Tests for login component

import {render, screen, fireEvent } from "@testing-library/react";
import Login from "../components/Login.js";
import UserContext from "../contexts/UserContext";
import { BrowserRouter } from "react-router-dom";

let container;

const login = (id) => {
    localStorage.setItem("currentUser", id);
};

//Render the Login component
beforeEach(() => {
    const utils = render(
        <UserContext.Provider value={{ login }}>
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        </UserContext.Provider>
    );
    container = utils.container;
});

//Test the user login form
//This test checks all the input elements of the login component, and then
//clicks the submit button and makes sure the form was submitted successfully
test("Login form", () => {
    //Get email and password form input elements
    const email = screen.getByPlaceholderText("email@example.com");
    const password = screen.getByPlaceholderText("Password here");

    //Enter user details
    fireEvent.change(email, { target: { value: "first@email.com" } });
    fireEvent.change(password, { target: { value: "password1!" } });

    //Expect input values to have been updated successfully
    expect(email.value).toBe("first@email.com");
    expect(password.value).toBe("password1!");

    const button = screen.getByText("Login");

    //Simulate click on submit button
    fireEvent.click(button);

    //Assert that "Loading" message appears, indicating the attemptLogin function was called
    expect(screen.getByText("Loading")).toBeInTheDocument(); 
});