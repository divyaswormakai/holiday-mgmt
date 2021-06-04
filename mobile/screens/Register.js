import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
	Button,
	Image,
	StatusBar,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	ToastAndroid,
} from "react-native";

import Title from "../components/Title";
import globalStyles from "../styles/globalStyles";
import axios from "../utils/axios";

const Register = ({ navigation }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [email, setEmail] = useState("");
	const [fullName, setFullName] = useState("");
	const [image, setImage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		(async () => {
			if (Platform.OS !== "web") {
				const { status } =
					await ImagePicker.requestMediaLibraryPermissionsAsync();
				if (status !== "granted") {
					alert("Sorry, we need camera roll permissions to make this work!");
				}
			}
		})();
	}, []);

	const pickImage = async () => {
		console.log("Picking image");
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [3, 3],
			quality: 1,
		});

		console.log(result);

		if (!result.cancelled) {
			setImage(result.uri);
		}
	};

	// TODO: Simple validation for registration and api integration
	const RegisterBtnPress = async () => {
		try {
			setIsLoading(true);
			if (password.length < 6) {
				throw new Error("Error: Password length should not be less than 6.");
			}
			if (password !== confirmPassword) {
				setPassword("");
				setConfirmPassword("");
				throw new Error("Password do not match");
			}
			if (!image) {
				throw new Error("Image not selected. Please select profile photo");
			}

			let uriParts = image.split(".");
			let fileType = uriParts[uriParts.length - 1];

			const formData = new FormData();
			formData.append("username", username);
			formData.append("password", password);
			formData.append("email", email);
			formData.append("fullName", fullName);
			formData.append("image", {
				uri: image,
				name: `${username}.${fileType}`,
				type: `image/${fileType}`,
			});

			const result = await axios.post(`login/new-user`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			if (result.status !== 200) {
				throw new Error(result);
			}
			console.log("Register successful. Please login with the credentials");
			navigation.navigate("Login");
		} catch (err) {
			console.log(err.message);
			ToastAndroid.show(
				err?.response?.data?.error || err?.message || "Error",
				ToastAndroid.SHORT
			);
		}
		setIsLoading(false);
	};
	return isLoading ? (
		<Text>Loading</Text>
	) : (
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
					autoCapitalize="none"
				/>
				<TextInput
					value={email}
					onChangeText={setEmail}
					style={globalStyles.textInput}
					placeholder="Email-address"
					textContentType="emailAddress"
					keyboardType="email-address"
				/>
				<TextInput
					value={fullName}
					onChangeText={setFullName}
					style={globalStyles.textInput}
					placeholder="Full Name"
					textContentType="name"
				/>
				<TextInput
					value={password}
					onChangeText={setPassword}
					style={globalStyles.textInput}
					placeholder="Password"
					textContentType="password"
					secureTextEntry={true}
				/>
				<TextInput
					value={confirmPassword}
					onChangeText={setConfirmPassword}
					style={globalStyles.textInput}
					placeholder="Confirm Password"
					textContentType="password"
					secureTextEntry={true}
				/>
				<View>
					<Button title="Pick an image from camera roll" onPress={pickImage} />
					{image && (
						<Image
							source={{ uri: image }}
							style={{ width: 200, height: 200 }}
						/>
					)}
				</View>
				<Button onPress={RegisterBtnPress} title="Register" />
				<Text>
					Already have an account,{" "}
					<TouchableOpacity onPress={() => navigation.navigate("Login")}>
						<Text>SIGN IN HERE.</Text>
					</TouchableOpacity>
				</Text>
			</View>
		</View>
	);
};

export default Register;
