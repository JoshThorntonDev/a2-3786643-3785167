//Tests for login page

import {render, screen, fireEvent } from "@testing-library/react";
import Login from "../components/Login.js";
import UserContext from "../contexts/UserContext";
import { BrowserRouter } from "react-router-dom";

let container;

const login = (id) => {
    localStorage.setItem("currentUser", id);
};

beforeEach(() => {
    const utils = render(
        <UserContext.Provider value={{ login }}>
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        </UserContext.Provider>
    );
    container = utils.container;
})

//Test the user login form
test("Login form", () => {

});