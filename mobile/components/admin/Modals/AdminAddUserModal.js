import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Image, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';

import globalStyles from '../../../styles/globalStyles';
import axios from '../../../utils/axios';
import { COLORS } from '../../../utils/constant';
import { vh, vw } from '../../../utils/viewport';

const AdminAddUserModal = ({
	setShowAddUserModal,
	updateAfterUserAddition,
}) => {
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
			updateAfterUserAddition(result.data);
			setShowAddUserModal(false);
		} catch (err) {
			console.log(err.message);
			ToastAndroid.show(
				err?.response?.data?.error || err?.message || "Error",
				ToastAndroid.SHORT
			);
		}
		setIsLoading(false);
	};
	return (
		<View style={globalStyles.container}>
			<View style={{ alignItems: "center" }}>
				<Text
					style={{
						fontSize: 5 * vw,
						color: COLORS.primary,
						fontFamily: "",
						fontWeight: "bold",
					}}
				>
					ADD A NEW USER
				</Text>
				<View style={globalStyles.editProfileDivider} />
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
					<TouchableOpacity
						onPress={pickImage}
						style={{
							borderColor: COLORS.primary,
							width: 75 * vw,
							alignItems: "center",
							padding: 10,
							borderWidth: 1,
							marginBottom: 2 * vh,
						}}
					>
						{image ? (
							<Image
								source={{ uri: image }}
								style={{ width: 10 * vh, height: 10 * vh }}
							/>
						) : (
							<Ionicons
								name="person-circle-outline"
								color={COLORS.primary}
								size={8 * vh}
							/>
						)}
						<Text style={{ color: COLORS.primary }}>Select your photo</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity
					onPress={RegisterBtnPress}
					style={{
						backgroundColor: COLORS.primary,
						width: 75 * vw,
						alignItems: "center",
						padding: 2 * vh,
						marginBottom: 2 * vh,
					}}
					disabled={isLoading}
				>
					<Text style={{ color: "white" }}>ADD USER</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{ ...globalStyles.redOutlineBtn, width: 75 * vw }}
					onPress={() => setShowAddUserModal(false)}
				>
					<Text style={globalStyles.dangerColorText}>Cancel</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default AdminAddUserModal;
