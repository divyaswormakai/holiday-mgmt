import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { Button, StatusBar, Switch, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';

import Title from '../components/Title';
import globalStyles from '../styles/globalStyles';
import axios from '../utils/axios';
import { STORAGE_USER_DETAILS_KEY, USER_TYPES } from '../utils/constant';

const Login = ({ navigation }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isAdmin, setIsAdmin] = useState(false);

	const LoginBtnPress = async () => {
		try {
			const loginType = isAdmin ? USER_TYPES.ADMIN : USER_TYPES.USER;
			const result = await axios.post(`login/${loginType}`, {
				username,
				password,
			});
			if (result.status !== 200) {
				throw new Error(result);
			}
			await AsyncStorage.setItem(
				STORAGE_USER_DETAILS_KEY,
				JSON.stringify({ ...result?.data, userType: loginType })
			);

			const homePage = isAdmin ? "AdminHome" : "UserHome";
			navigation.navigate(homePage);
		} catch (err) {
			console.log(err);
			ToastAndroid.show(
				`Error: ${err?.response?.data?.error}`,
				ToastAndroid.SHORT
			);
		}
	};
	return (
		<View style={globalStyles.container}>
			<StatusBar />
			<Title />
			<View>
				<TextInput
					value={username}
					onChangeText={setUsername}
					style={globalStyles.textInput}
					placeholder="Username"
					textContentType="username"
				/>
				<TextInput
					value={password}
					onChangeText={setPassword}
					style={globalStyles.textInput}
					placeholder="Password"
					textContentType="password"
					secureTextEntry={true}
				/>
				<View style={{ flexDirection: "row" }}>
					<Text>Are you admin?</Text>
					<Switch
						trackColor={{ false: "#767577", true: "#81b0ff" }}
						thumbColor={isAdmin ? "#f5dd4b" : "#f4f3f4"}
						ios_backgroundColor="#3e3e3e"
						onValueChange={() => setIsAdmin((prevState) => !prevState)}
						value={isAdmin}
					/>
				</View>
				<Button onPress={LoginBtnPress} title="Login" />
				<Text>
					If you don't have an account,{" "}
					<TouchableOpacity onPress={() => navigation.navigate("Register")}>
						<Text>REGISTER HERE.</Text>
					</TouchableOpacity>
				</Text>
			</View>
		</View>
	);
};

export default Login;
