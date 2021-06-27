import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { ActivityIndicator, StatusBar, Switch, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';

import Title from '../components/Title';
import globalStyles from '../styles/globalStyles';
import axios from '../utils/axios';
import { COLORS, STORAGE_USER_DETAILS_KEY, USER_TYPES } from '../utils/constant';
import { vh, vw } from '../utils/viewport';

const Login = ({ navigation }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isAdmin, setIsAdmin] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const LoginBtnPress = async () => {
		try {
			setIsLoading(true);
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
		setIsLoading(false);
	};
	return isLoading ? (
		<ActivityIndicator color={COLORS.primary} size="large" />
	) : (
		<View style={globalStyles.container}>
			<StatusBar />
			<Title />
			<View style={{ alignItems: "center" }}>
				<TextInput
					value={username}
					onChangeText={setUsername}
					style={globalStyles.textInput}
					placeholder="Username"
					textContentType="username"
					autoCapitalize="none"
				/>
				<TextInput
					value={password}
					onChangeText={setPassword}
					style={globalStyles.textInput}
					placeholder="Password"
					textContentType="password"
					secureTextEntry={true}
				/>
				<View
					style={{
						flexDirection: "row",
						alignSelf: "flex-start",
						marginVertical: 1 * vh,
					}}
				>
					<Text>Are you admin?</Text>
					<Switch
						trackColor={{ false: "#767577", true: COLORS.primary }}
						thumbColor={isAdmin ? COLORS.primary : "#f4f3f4"}
						ios_backgroundColor="#3e3e3e"
						onValueChange={() => setIsAdmin((prevState) => !prevState)}
						value={isAdmin}
					/>
				</View>
				<TouchableOpacity
					onPress={LoginBtnPress}
					style={{
						backgroundColor: COLORS.primary,
						width: 75 * vw,
						alignItems: "center",
						padding: 10,
						marginBottom: 2 * vh,
					}}
				>
					<Text style={{ color: "white" }}>LOGIN</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => navigation.navigate("Register")}
					style={{
						borderWidth: 1,
						borderStyle: "solid",
						borderColor: COLORS.primary,
						width: 75 * vw,
						alignItems: "center",
						padding: 10,
						marginBottom: 2 * vh,
					}}
				>
					<Text style={{ color: COLORS.primary }}>SIGN UP</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default Login;
