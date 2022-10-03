//Tests for profile page

import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";

let container;

beforeAll(async () => {
    const utils = render(<App />);
    container = utils.container;
    await Login();
});


//Test profile edit username function
test("Change name", async () => {
    //Get edit button and simulate click on it
    var button = screen.getAllByText('Edit');
    fireEvent.click(button[0])

    //Get username edit field and update it
    var input = screen.getByPlaceholderText('First User')
    fireEvent.change(input, { target: { value: "New Name" } });

    //Get verification password field and fill it in
    var input = screen.getByPlaceholderText('Enter your password here')
    fireEvent.change(input, { target: { value: "password1!" } });

    var button = screen.getByText('Save');

    //Simulate a click on submit button and wait for profile to update
    fireEvent.click(button)
    await delay(3000)
    
    //Assert that the new name is in the profile
    expect(screen.getAllByText("New Name", { exact: false })[0]).toBeInTheDocument();
});


//Function to log the user in before the test
async function Login() {
    let button = screen.getAllByText("Login");

    // Simulate click.
    fireEvent.click(button[0]);

    const email = screen.getByPlaceholderText('email@example.com');
    fireEvent.change(email, { target: { value: "first@email.com" } });

    const password = screen.getByPlaceholderText('Password here')
    fireEvent.change(password, { target: { value: "password1!" } });


    button = screen.getAllByText("Login");
    
    fireEvent.click(button[1])
    await delay(3000)

    expect(global.window.location.href).toContain('/profile/837')
}

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}