//Tests for register page

import {render, screen, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import App from "../App.js";

let container;

beforeEach(() => {
    const utils = render(<App />);
    container = utils.container;
});

//Test registering a valid user
test("Register User", async () => {
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

});

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}