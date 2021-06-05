import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ToastAndroid } from "react-native";
import AdminHome from "./screens/AdminHome";
import Login from "./screens/Login";
import Register from "./screens/Register";
import UserHome from "./screens/UserHome";
import { COLORS, STORAGE_USER_DETAILS_KEY, USER_TYPES } from "./utils/constant";

const Stack = createStackNavigator();

export default function App() {
	const [initalRouteName, setInitalRouteName] = useState("Login");
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		getLoggedInUserType();
	}, []);

	const getLoggedInUserType = async () => {
		try {
			let userDetails = await AsyncStorage.getItem(STORAGE_USER_DETAILS_KEY);
			if (!userDetails) {
				throw new Error("Could not find stored user. Please login.");
			} else {
				userDetails = JSON.parse(userDetails);
				if (userDetails.userType === USER_TYPES.ADMIN) {
					setInitalRouteName("AdminHome");
				} else if (userDetails.userType === USER_TYPES.USER) {
					setInitalRouteName("UserHome");
				}
			}
		} catch (err) {
			ToastAndroid.show(err.message, ToastAndroid.SHORT);
		}
		setIsLoaded(true);
	};

	return (
		<>
			{isLoaded ? (
				<NavigationContainer>
					<Stack.Navigator initialRouteName={initalRouteName} headerMode="none">
						<Stack.Screen name="Login" component={Login} />
						<Stack.Screen name="Register" component={Register} />
						<Stack.Screen name="AdminHome" component={AdminHome} />
						<Stack.Screen name="UserHome" component={UserHome} />
					</Stack.Navigator>
				</NavigationContainer>
			) : (
				<ActivityIndicator color={COLORS.primary} size="large" />
			)}
		</>
	);
}
