import React, { useState, useEffect } from "react";
import {
	ScrollView,
	StatusBar,
	Text,
	View,
	ToastAndroid,
	TouchableOpacity,
	Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import UserTopBar from "../components/user/UserTopBar";
import UserTimeTable from "../components/user/UserTimeTable";
import UserRequestForm from "../components/user/UserRequestForm";

import globalStyles from "../styles/globalStyles";
import { STORAGE_USER_DETAILS_KEY, BASEURL, COLORS } from "../utils/constant";
import axios from "../utils/axios";
import { vw, vh } from "../utils/viewport";

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
			console.log(err.message);
			ToastAndroid.show(
				err?.response?.data?.error || err.message,
				ToastAndroid.SHORT
			);
		}
	};
	return (
		<ScrollView
			contentContainerStyle={globalStyles.homeContainer}
			showsVerticalScrollIndicator={false}
		>
			<Modal
				animationType="slide"
				visible={showModal}
				onRequestClose={() => {
					setShowModal(!showModal);
				}}
			>
				<UserRequestForm />
			</Modal>
			<StatusBar />

			<UserTopBar
				navigation={navigation}
				profileDetails={profileDetails}
				setProfileDetails={setProfileDetails}
			/>
			<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
				<View>
					<Text>Date</Text>
					<Text>Current date</Text>
				</View>
				<View>
					<Text>Time</Text>
					<Text>current time</Text>
				</View>
			</View>
			{currentScreen === "Dashboard" ? (
				<>
					<UserTimeTable />
				</>
			) : (
				<Text>This is the user home screen</Text>
			)}
			<TouchableOpacity
				style={{
					backgroundColor: COLORS.primary,
					width: "100%",
					position: "absolute",
					zIndex: 10,
					bottom: 1 * vh,
					alignItems: "center",
					justifyContent: "center",
				}}
				activeOpacity={0.5}
				onPress={() => setShowModal((prev) => !prev)}
			>
				<Text
					style={{
						color: "white",
						fontSize: 5 * vw,
						fontWeight: "bold",
						fontFamily: "",
						paddingVertical: 2 * vh,
					}}
				>
					REQUEST HOLIDAY
				</Text>
			</TouchableOpacity>
		</ScrollView>
	);
};

export default UserHome;
