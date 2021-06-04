import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

import { vh } from "../../utils/viewport";
import UserEditProfileModal from "./UserEditProfileModal";

const UserTopBar = ({ navigation, profileDetails, setProfileDetails }) => {
	const [showModal, setShowModal] = useState(false);
	return (
		<View
			style={{
				backgroundColor: "green",
				height: 8 * vh,
				alignItems: "center",
				flexDirection: "row",
				justifyContent: "space-between",
			}}
		>
			<Modal
				animationType="slide"
				visible={showModal}
				onRequestClose={() => {
					setShowModal(!showModal);
				}}
			>
				<UserEditProfileModal
					navigation={navigation}
					profileDetails={profileDetails}
					setProfileDetails={setProfileDetails}
				/>
			</Modal>

			<Text>This is where the image will be</Text>
			<TouchableOpacity onPress={() => setShowModal((prevState) => !prevState)}>
				<Text>Settings Icon</Text>
			</TouchableOpacity>
		</View>
	);
};

export default UserTopBar;
