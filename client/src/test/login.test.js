// Unit Tests for Login Page (using Jest)

import { render, screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import Login from "../pages/Login";
import { BrowserRouter } from "react-router-dom";

jest.mock("axios", () => ({
  post: jest.fn(() => Promise.resolve({ data: { token: "test-token", user: { username: "testuser" } } }))
}));

describe("Login Page", () => {
  test("renders login form and submits data correctly", async () => {
    render(
      <BrowserRouter>
        <Login setLoggedInUser={jest.fn()} />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText("Email address*");
    const passwordInput = screen.getByLabelText("Password*");
    const loginButton = screen.getByText("SIGN IN");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/users/login"),
      expect.objectContaining({ email: "test@example.com", password: "password123" })
    );
  });

  test("shows error message when login fails", async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { message: "Invalid credentials" } } });

    render(
      <BrowserRouter>
        <Login setLoggedInUser={jest.fn()} />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText("Email address*");
    const passwordInput = screen.getByLabelText("Password*");
    const loginButton = screen.getByText("SIGN IN");

    fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(loginButton);

    const errorMessage = await screen.findByText("Invalid credentials");
    expect(errorMessage).toBeInTheDocument();
  });
});