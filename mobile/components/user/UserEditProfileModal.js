import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
	Button,
	Image,
	ScrollView,
	Text,
	TextInput,
	ToastAndroid,
	TouchableOpacity,
	View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import axios from "../../utils/axios";
import { BASEURL, STORAGE_USER_DETAILS_KEY } from "../../utils/constant";
import globalStyles from "../../styles/globalStyles";
import { vw } from "../../utils/viewport";

const UserEditProfileModal = ({
	navigation,
	profileDetails,
	setProfileDetails,
}) => {
	const [isInPasswordEditMode, setIsInPasswordEditMode] = useState(false);
	const [isInPhotoEditMode, setisInPhotoEditMode] = useState();
	const [profileDetailsLoaded, setProfileDetailsLoaded] = useState(true);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [image, setImage] = useState(null);

	const pickImage = async () => {
		try {
			setisInPhotoEditMode(true);
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.All,
				allowsEditing: true,
				aspect: [3, 3],
				quality: 1,
			});

			if (!result.cancelled) {
				setImage(result.uri);
			}
		} catch (err) {
			ToastAndroid.show(
				err?.response?.data?.error || err.message,
				ToastAndroid.SHORT
			);
		}
		setProfileDetailsLoaded(true);
	};

	const ChangeProfilePicture = async () => {
		try {
			setProfileDetailsLoaded(false);
			let uriParts = image.split(".");
			let fileType = uriParts[uriParts.length - 1];
			const formData = new FormData();
			formData.append("image", {
				uri: image,
				name: `${profileDetails.username}.${fileType}`,
				type: `image/${fileType}`,
			});

			const result = await axios.put(
				`user/update-profile-photo/${profileDetails.id}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			if (result.status !== 200) {
				throw new Error(result);
			}
			setProfileDetails({
				...result.data,
				profilePicture: BASEURL + result.data.profilePicture.replace("\\", "/"),
			});
			ToastAndroid.show("Photo updated successfully", ToastAndroid.SHORT);
		} catch (err) {
			console.log(err.response);
			ToastAndroid.show(
				err?.response?.data?.error || err.message,
				ToastAndroid.SHORT
			);
		}
		setisInPhotoEditMode(false);
		setProfileDetailsLoaded(true);
	};

	const ChangePassword = async () => {
		try {
			setProfileDetailsLoaded(false);
			if (password.length < 6) {
				throw new Error("Error: Password length should not be less than 6.");
			}
			if (password !== confirmPassword) {
				setPassword("");
				setConfirmPassword("");
				throw new Error("Password do not match");
			}

			const result = await axios.put(
				`user/update-password/${profileDetails.id}`,
				{ password }
			);
			if (result.status !== 200) {
				throw new Error(result);
			}
			ToastAndroid.show(
				"Password has been reset successfully",
				ToastAndroid.SHORT
			);
			setIsInPasswordEditMode(false);
		} catch (err) {
			ToastAndroid.show(
				err?.response?.data?.error || err.message,
				ToastAndroid.SHORT
			);
		}
		setProfileDetailsLoaded(true);
	};

	const Logout = async () => {
		try {
			await AsyncStorage.removeItem(STORAGE_USER_DETAILS_KEY);
			navigation.navigate("Login");
		} catch (err) {
			console.log(err.response);
			ToastAndroid.show(
				err?.response?.data?.error || err.message,
				ToastAndroid.SHORT
			);
		}
	};

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={globalStyles.modalContainer}
		>
			{profileDetailsLoaded ? (
				<>
					<View>
						<Image
							source={{
								uri: image || profileDetails.profilePicture,
							}}
							style={{ height: 20 * vw, width: 20 * vw }}
						/>

						{isInPhotoEditMode ? (
							<>
								<TouchableOpacity onPress={ChangeProfilePicture}>
									<Text>Update my Photo</Text>
								</TouchableOpacity>
								<TouchableOpacity onPress={() => setisInPhotoEditMode(false)}>
									<Text>Cancel</Text>
								</TouchableOpacity>
							</>
						) : (
							<TouchableOpacity onPress={pickImage}>
								<Text>Select Image Icon</Text>
							</TouchableOpacity>
						)}
					</View>
					<View>
						<Text>Username:</Text>
						<Text>{profileDetails.username}</Text>
					</View>
					<View>
						<Text>Email:</Text>
						<Text>{profileDetails.email}</Text>
					</View>
					<View>
						<Text>Full Name:</Text>
						<Text>{profileDetails.fullName}</Text>
					</View>
					<View>
						<Text>Joined from:</Text>
						<Text>{profileDetails.createdAt.slice(0, 10)}</Text>
					</View>
					{isInPasswordEditMode ? (
						<>
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
								placeholder=" Confirm Password"
								textContentType="password"
								secureTextEntry={true}
							/>
							<Button title="Save Password" onPress={ChangePassword} />
							<Button
								title="Cancel"
								onPress={() => setIsInPasswordEditMode((prev) => !prev)}
							/>
						</>
					) : (
						<>
							<Button
								title="Change Password"
								onPress={() => setIsInPasswordEditMode((prev) => !prev)}
							/>
							<Button title="Logout" onPress={Logout} />
						</>
					)}
				</>
			) : (
				<Text>Loading Profile...</Text>
			)}
		</ScrollView>
	);
};

export default UserEditProfileModal;
