//Tests for profile page

import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";

let container;

beforeAll(async () => {
    const utils = render(<App />);
    container = utils.container;
    await Login();
});


test("Change name", async () => {
    var button = screen.getAllByText('Edit');
    fireEvent.click(button[0])

    var input = screen.getByPlaceholderText('First User')
    fireEvent.change(input, { target: { value: "New Name" } });

    var input = screen.getByPlaceholderText('Enter your password here')
    fireEvent.change(input, { target: { value: "password1!" } });

    var button = screen.getByText('Save');
    fireEvent.click(button)

    await delay(3000)
    
    expect(screen.getAllByText("New Name", { exact: false })[0]).toBeInTheDocument();
});


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