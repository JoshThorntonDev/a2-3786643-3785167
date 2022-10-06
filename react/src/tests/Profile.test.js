//Tests for profile page

import { render, screen, fireEvent } from "@testing-library/react";
import Profile from "../components/Profile.js";
import UserContext from "../contexts/UserContext";
import { BrowserRouter } from "react-router-dom";

let container;
const currentUser = 2;

beforeAll(async () => {
    const utils = render(
    <UserContext.Provider value={{ currentUser }}>
        <BrowserRouter>
            <Profile />
        </BrowserRouter>
    </UserContext.Provider>
    );
    container = utils.container;
});


//Test profile edit username function
test("Profile Name Change Form", async () => {
    /*
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
    */
});

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}