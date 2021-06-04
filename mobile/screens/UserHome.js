import React from 'react';
import { StatusBar, Text, View } from 'react-native';

import UserTopBar from '../components/user/UserTopBar';
import globalStyles from '../styles/globalStyles';

const UserHome = () => {
	return (
		<View style={globalStyles.homeContainer}>
			<StatusBar />
			<UserTopBar />
			<Text>This is the user home screen</Text>
		</View>
	);
};

export default UserHome;
