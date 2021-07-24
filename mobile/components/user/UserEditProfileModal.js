import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
} from 'react-native';

import globalStyles from '../../styles/globalStyles';
import axios from '../../utils/axios';
import { BASEURL, COLORS, STORAGE_USER_DETAILS_KEY } from '../../utils/constant';
import { vh, vw } from '../../utils/viewport';

const UserEditProfileModal = ({
	setShowModal,
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
			} else {
				setisInPhotoEditMode(false);
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
			ToastAndroid.show(
				err?.response?.data?.error || err.message,
				ToastAndroid.SHORT
			);
		}
		setisInPhotoEditMode(false);
		setProfileDetailsLoaded(true);
	};

	const CancelPhotoUpdate = () => {
		setImage(null);
		setisInPhotoEditMode(false);
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
			<View style={styles.profileModalContainer}>
				<TouchableOpacity onPress={() => setShowModal((prev) => !prev)}>
					<Ionicons
						name="ios-chevron-back"
						size={5 * vh}
						color={COLORS.primary}
					/>
				</TouchableOpacity>
				<Text style={globalStyles.primaryColorText}>USER PROFILE</Text>
			</View>
			<View style={globalStyles.editProfileDivider} />
			{profileDetailsLoaded ? (
				<>
					<View style={styles.profileModalContainerContent}>
						<View>
							{/* TODO: Maybe add a profile icon here as well */}
							<Image
								source={{
									uri: image || profileDetails.profilePicture,
								}}
								style={styles.imageStyle}
							/>
							<TouchableOpacity onPress={pickImage} style={styles.imageEditBtn}>
								<MaterialCommunityIcons
									name="pencil-box-multiple"
									size={4 * vh}
									color={COLORS.primary}
								/>
							</TouchableOpacity>
						</View>

						{isInPhotoEditMode && (
							<View style={styles.imageEditModeView}>
								<TouchableOpacity
									onPress={ChangeProfilePicture}
									style={styles.okBtn}
								>
									<Text style={{ color: "white" }}>Upload</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={CancelPhotoUpdate}
									style={styles.cancelBtn}
								>
									<Text style={{ color: COLORS.red }}>Cancel</Text>
								</TouchableOpacity>
							</View>
						)}
					</View>
					<View style={styles.detailRow}>
						<Text style={styles.detailRowTitle}>Username:</Text>
						<Text style={globalStyles.primaryColorText}>
							{profileDetails.username}
						</Text>
					</View>
					<View style={styles.detailRow}>
						<Text style={styles.detailRowTitle}>Email:</Text>
						<Text style={globalStyles.primaryColorText}>
							{profileDetails.email}
						</Text>
					</View>
					<View style={styles.detailRow}>
						<Text style={styles.detailRowTitle}>Full Name:</Text>
						<Text style={globalStyles.primaryColorText}>
							{profileDetails.fullName}
						</Text>
					</View>
					<View style={styles.detailRow}>
						<Text style={styles.detailRowTitle}>Joined from:</Text>
						<Text style={globalStyles.primaryColorText}>
							{profileDetails.createdAt.slice(0, 10)}
						</Text>
					</View>
					{isInPasswordEditMode ? (
						<View style={styles.paddingBottomPWEdit}>
							<Text style={styles.changePWText}>Change your password</Text>
							<TextInput
								value={password}
								onChangeText={setPassword}
								style={styles.textInputEditPW}
								placeholder="Password"
								textContentType="password"
								secureTextEntry={true}
							/>
							<TextInput
								value={confirmPassword}
								onChangeText={setConfirmPassword}
								style={styles.textInputEditPW}
								placeholder=" Confirm Password"
								textContentType="password"
								secureTextEntry={true}
							/>
							<View style={styles.imageEditModeView}>
								<TouchableOpacity onPress={ChangePassword} style={styles.okBtn}>
									<Text style={{ color: "white" }}>Update</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => setIsInPasswordEditMode((prev) => !prev)}
									style={styles.cancelBtn}
								>
									<Text style={{ color: COLORS.red }}>Cancel</Text>
								</TouchableOpacity>
							</View>
						</View>
					) : (
						<>
							<TouchableOpacity
								style={styles.changePasswordBtn}
								onPress={() => setIsInPasswordEditMode((prev) => !prev)}
							>
								<Text style={globalStyles.primaryColorText}>
									Change Password
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={globalStyles.redOutlineBtn}
								onPress={Logout}
							>
								<Text style={globalStyles.dangerColorText}>Logout</Text>
							</TouchableOpacity>
						</>
					)}
				</>
			) : (
				<ActivityIndicator color={COLORS.primary} size="large" />
			)}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	profileModalContainer: { flexDirection: "row", alignItems: "center" },

	profileModalContainerContent: {
		alignSelf: "center",
		marginTop: 2 * vh,
		alignItems: "center",
	},
	imageStyle: {
		height: 50 * vw,
		width: 50 * vw,
		alignSelf: "center",
		borderRadius: 100,
		position: "relative",
		marginBottom: 5,
	},
	imageEditBtn: {
		position: "absolute",
		right: 0,
		backgroundColor: "white",
		padding: 5,
		borderRadius: 50,
	},
	imageEditModeView: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		width: "100%",
	},
	okBtn: {
		backgroundColor: COLORS.primary,
		width: 40 * vw,
		padding: "5%",
		alignItems: "center",
		borderColor: COLORS.primary,
		borderWidth: 2,
	},
	cancelBtn: {
		borderColor: COLORS.red,
		borderWidth: 2,
		width: 40 * vw,
		padding: "5%",
		alignItems: "center",
	},
	detailRow: {
		marginVertical: 1 * vh,
	},
	detailRowTitle: {
		fontSize: 5 * vw,
	},
	changePasswordBtn: {
		width: "100%",
		borderColor: COLORS.primary,
		borderWidth: 2,
		padding: "3%",
		alignItems: "center",
		marginVertical: 1 * vh,
	},

	textInputEditPW: {
		height: 5 * vh,
		borderColor: COLORS.primary,
		borderWidth: 2,
		width: "100%",
		paddingHorizontal: 2 * vw,
		marginVertical: 1 * vh,
	},
	changePWText: {
		textAlign: "center",
		color: COLORS.primary,
		fontWeight: "bold",
		fontFamily: "",
	},
	paddingBottomPWEdit: {
		paddingBottom: 2 * vh,
	},
});

export default UserEditProfileModal;
