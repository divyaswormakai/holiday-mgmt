import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, StatusBar, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';

import UserDashboard from '../components/user/UserDashboard';
import UserHistory from '../components/user/UserHistory';
import UserRequestForm from '../components/user/UserRequestForm';
import UserTimeTable from '../components/user/UserTimeTable';
import UserTopBar from '../components/user/UserTopBar';
import globalStyles from '../styles/globalStyles';
import axios from '../utils/axios';
import { BASEURL, COLORS, STORAGE_USER_DETAILS_KEY } from '../utils/constant';
import { vh, vw } from '../utils/viewport';

const UserHome = ({ navigation }) => {
	const [profileDetails, setProfileDetails] = useState({});
	const [currentScreen, setCurrentScreen] = useState("Dashboard");
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		getUserProfileDetails();
	}, []);

	const getUserProfileDetails = async () => {
		try {
			let userDetails = await AsyncStorage.getItem(STORAGE_USER_DETAILS_KEY);
			userDetails = JSON.parse(userDetails);
			const result = await axios.post(`user/profile/${userDetails.id}`);
			if (result.status !== 200) {
				throw new Error(result);
			}
			await setProfileDetails({
				...result.data,
				profilePicture: BASEURL + result.data.profilePicture.replace("\\", "/"),
			});
		} catch (err) {
			console.log(err.response);
			ToastAndroid.show(
				err?.response?.data?.error || err.message,
				ToastAndroid.SHORT
			);
		}
	};

	return (
		<>
			<View style={globalStyles.homeContainer}>
				<Modal
					animationType="slide"
					visible={showModal}
					onRequestClose={() => {
						setShowModal(!showModal);
					}}
				>
					<UserRequestForm
						setShowModal={setShowModal}
						profileDetails={profileDetails}
					/>
				</Modal>
				<StatusBar />

				<UserTopBar
					navigation={navigation}
					profileDetails={profileDetails}
					setProfileDetails={setProfileDetails}
				/>

				<View style={styles.dummyNavbar}>
					{["Dashboard", "History"].map((item) => (
						<TouchableOpacity
							onPress={() => setCurrentScreen(item)}
							style={
								currentScreen === item
									? styles.activeOptionButton
									: styles.inactiveOptionButton
							}
							activeOpacity={0.5}
							key={`DummyNav-${item}`}
						>
							<Text
								style={
									currentScreen === item
										? styles.activeOptionButtonText
										: styles.inactiveOptionButtonText
								}
							>
								{item}
							</Text>
						</TouchableOpacity>
					))}
				</View>
				{currentScreen === "Dashboard" ? (
					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{ paddingBottom: 25 * vh }}
					>
						<UserTimeTable />
						<UserDashboard profileDetails={profileDetails} />
					</ScrollView>
				) : (
					<UserHistory userID={profileDetails.id} />
				)}
			</View>
			<TouchableOpacity
				style={globalStyles.requestBtn}
				activeOpacity={0.5}
				onPress={() => setShowModal((prev) => !prev)}
			>
				<Text style={globalStyles.requestBtnTxt}>REQUEST HOLIDAY</Text>
			</TouchableOpacity>
		</>
	);
};

const styles = StyleSheet.create({
	dummyNavbar: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginVertical: 2 * vh,
	},
	activeOptionButton: {
		width: 43 * vw,
		backgroundColor: COLORS.primary,
		paddingVertical: 1.5 * vh,
	},
	activeOptionButtonText: {
		color: "white",
		textAlign: "center",
		fontSize: 4 * vw,
	},
	inactiveOptionButton: {
		borderWidth: 2,
		width: 43 * vw,
		borderColor: COLORS.primary,
		paddingVertical: 1.5 * vh,
	},
	inactiveOptionButtonText: {
		color: COLORS.primary,
		textAlign: "center",
	},
});

export default UserHome;
