//Tests for ProfileDelter component

import { render, screen, fireEvent } from "@testing-library/react";
import ProfileDeleter from "../components/ProfileDeleter.js";
import UserContext from "../contexts/UserContext";
import {BrowserRouter} from "react-router-dom";

let container;
const NAME_LENGTH = 20;
const user = {
    username: "Test User",
    email: "testuser@email.com",
}

beforeAll(async () => {
    const utils = render(
    <UserContext.Provider value={{ NAME_LENGTH }}>
        <BrowserRouter>
            <ProfileDeleter
                show={true}
                user={user}
            />
        </BrowserRouter>
    </UserContext.Provider>
    );
    container = utils.container;
});
//Test ProfileDelter form
test("Delete User", () => {
    //Get password verification field and fill it in
    const password = screen.getByPlaceholderText('Enter your password here')
    fireEvent.change(password, { target: { value: "password1!" } });

    //Expect password value to be updated correctly
    expect(password.value).toBe("password1!");

    const button = screen.getAllByText('Delete')[0];

    //Simulate a click on delete button
    fireEvent.click(button)

    //Expect "Deleting" button to appear after submitting
    expect(screen.getByText("Deleting")).toBeInTheDocument();
});