import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
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

import globalStyles from '../../../styles/globalStyles';
import axios from '../../../utils/axios';
import { BASEURL, COLORS } from '../../../utils/constant';
import { vh, vw } from '../../../utils/viewport';

const AdminEditUserModal = ({
	setShowModal,
	profileDetails,
	updateAfterUserEdit,
}) => {
	const [isInPasswordEditMode, setIsInPasswordEditMode] = useState(false);
	const [isInPhotoEditMode, setisInPhotoEditMode] = useState();
	const [profileDetailsLoaded, setProfileDetailsLoaded] = useState(true);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [image, setImage] = useState(null);

	const [totalHolidays, setTotalHolidays] = useState(
		profileDetails.totalHolidays?.toString()
	);
	const [completedHolidays, setCompletedHolidays] = useState(
		profileDetails.completedHolidays?.toString()
	);
	const [isInHolidayEditMode, setIsInHolidayEditMode] = useState(false);

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
			updateAfterUserEdit(result.data);
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

	const UpdateUserHoliday = async () => {
		try {
			setProfileDetailsLoaded(false);
			if (parseInt(totalHolidays, 10) < parseInt(completedHolidays, 10)) {
				throw new Error(
					"Error: Total holidays cannot be greated than the copmleted holidays."
				);
			}

			const result = await axios.post(
				`admin/edit-user-holiday/${profileDetails.id}`,
				{ totalHolidays, completedHolidays }
			);
			if (result.status !== 200) {
				throw new Error(result);
			}
			ToastAndroid.show(
				"Holiday has been reset succesfully.",
				ToastAndroid.SHORT
			);
			updateAfterUserEdit(result.data);
			setIsInHolidayEditMode(false);
		} catch (err) {
			ToastAndroid.show(
				err?.response?.data?.error || err.message,
				ToastAndroid.SHORT
			);
		}
		setProfileDetailsLoaded(true);
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
									uri:
										image ||
										`${BASEURL}${profileDetails?.profilePicture?.replace(
											"\\",
											"/"
										)}`,
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

					{/* Changing number of holidays */}
					{isInHolidayEditMode ? (
						<View style={styles.paddingBottomPWEdit}>
							<Text style={styles.changePWText}>Change your password</Text>
							<TextInput
								value={totalHolidays}
								onChangeText={setTotalHolidays}
								style={styles.textInputEditPW}
								placeholder="Total Holidays"
								keyboardType="number-pad"
							/>
							<TextInput
								value={completedHolidays}
								onChangeText={setCompletedHolidays}
								style={styles.textInputEditPW}
								placeholder=" Completed Holidays"
								keyboardType="number-pad"
							/>
							<View style={styles.imageEditModeView}>
								<TouchableOpacity
									onPress={UpdateUserHoliday}
									style={styles.okBtn}
								>
									<Text style={{ color: "white" }}>Update</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => setIsInHolidayEditMode((prev) => !prev)}
									style={styles.cancelBtn}
								>
									<Text style={{ color: COLORS.red }}>Cancel</Text>
								</TouchableOpacity>
							</View>
						</View>
					) : (
						<>
							<View
								style={{
									...styles.detailRow,
									flexDirection: "row",
									justifyContent: "space-around",
								}}
							>
								<View
									style={{
										width: "50%",
										alignItems: "center",
									}}
								>
									<Text style={styles.detailRowTitle}>Total Holidays:</Text>
									<Text
										style={{
											...globalStyles.primaryColorText,
											fontSize: 5 * vw,
										}}
									>
										{totalHolidays}
									</Text>
								</View>
								<View
									style={{
										width: "50%",
										alignItems: "center",
									}}
								>
									<Text style={styles.detailRowTitle}>Used Holidays:</Text>
									<Text
										style={{
											...globalStyles.primaryColorText,
											fontSize: 5 * vw,
										}}
									>
										{completedHolidays}
									</Text>
								</View>
							</View>
							<TouchableOpacity
								style={styles.changePasswordBtn}
								onPress={() => setIsInHolidayEditMode((prev) => !prev)}
							>
								<Text style={globalStyles.primaryColorText}>
									Edit User Holidays
								</Text>
							</TouchableOpacity>
						</>
					)}

					{/* For changing password */}
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

export default AdminEditUserModal;
