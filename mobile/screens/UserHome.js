import React from "react";
import { StatusBar, Text, View } from "react-native";

import UserTopBar from "../components/user/UserTopBar";
import UserTimeTable from "../components/user/UserTimeTable";
import globalStyles from "../styles/globalStyles";

const UserHome = ({ navigation }) => {
	return (
		<View style={globalStyles.homeContainer}>
			<StatusBar />
			<UserTopBar navigation={navigation} />
			<UserTimeTable />
			<Text>This is the user home screen</Text>
		</View>
	);
};

export default UserHome;
