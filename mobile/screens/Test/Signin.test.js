import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Login from "../Login";
import UserRequestForm from "../../components/user/UserRequestForm";

test("renders default elements", () => {
	const { getAllByPlaceholderText, getByPlaceholderText } = render(<Login />);

	expect(getAllByPlaceholderText("Username").length).toBe(1);
	getByPlaceholderText("Password");
	getByPlaceholderText("Username");
});

it("shows invalid inputs messages", () => {
	const { getByTestId } = render(<Login />);
	fireEvent.press(getByTestId("LoginButton"));
});

it("shows invalid username error message", () => {
	const { getByTestId, getByText, getByPlaceholderText } = render(<Login />);

	fireEvent.changeText(getByTestId("Login.usernameInput"), "username");
	fireEvent.press(getByTestId("LoginButton"));
});

it("shows invalid password error message", () => {
	const { getByTestId, getByText, queryByText } = render(<Login />);
	fireEvent.changeText(getByTestId("Login.passwordInput"), "wrong");
	fireEvent.press(getByTestId("LoginButton"));
});

//register

//holiday request form
it("for normal naming conventions", async () => {
	const { queryByText, getByTestId, queryByTestId } = render(
		<UserRequestForm />
	);
	queryByText("Employee Name");
	queryByText("Year");
	queryByText("Department");
	queryByText("From Date");
	queryByText("To Date");
	queryByText("Total Working Days");
	queryByText("Reason");
	!expect(queryByText("Year")).toBeNull();
	// const username = getByTestId("username");

	// fireEvent.changeText(username, "wrong");
});
