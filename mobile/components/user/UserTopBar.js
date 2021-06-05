import { AntDesign, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '../../utils/constant';
import { vh, vw } from '../../utils/viewport';
import UserEditProfileModal from './UserEditProfileModal';
import UserServiceTicketModal from './UserServiceTicketModal';

const UserTopBar = ({ navigation, profileDetails, setProfileDetails }) => {
	const [showModal, setShowModal] = useState(false);
	const [showServiceModal, setShowServiceModal] = useState(false);
	return (
		<View
			style={{
				height: 8 * vh,
				marginVertical: 2 * vh,
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
					setShowModal={setShowModal}
					navigation={navigation}
					profileDetails={profileDetails}
					setProfileDetails={setProfileDetails}
				/>
			</Modal>

			<Modal
				animationType="slide"
				visible={showServiceModal}
				onRequestClose={() => {
					setShowServiceModal(!showServiceModal);
				}}
			>
				<UserServiceTicketModal
					setShowServiceModal={setShowServiceModal}
					profileDetails={profileDetails}
				/>
			</Modal>

			<View
				style={{
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{profileDetails.profilePicture ? (
					<Image
						source={{ uri: profileDetails.profilePicture }}
						style={{
							height: 7 * vh,
							width: 7 * vh,
							borderRadius: 100,
							backgroundColor: COLORS.primary,
						}}
					/>
				) : (
					<Ionicons
						name="person-circle-outline"
						size={7 * vh}
						color={COLORS.primary}
					/>
				)}
				<Text
					style={{
						marginLeft: 2 * vw,
						fontSize: 4 * vw,
						color: "black",
					}}
				>
					{profileDetails.username}
				</Text>
			</View>
			<View style={{ flexDirection: "row" }}>
				<TouchableOpacity
					onPress={() => setShowServiceModal((prevState) => !prevState)}
				>
					<AntDesign
						name="customerservice"
						size={3.5 * vh}
						color={COLORS.primary}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => setShowModal((prevState) => !prevState)}
					style={{ marginLeft: 10 }}
				>
					<Ionicons
						name="settings-outline"
						size={3.5 * vh}
						color={COLORS.primary}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default UserTopBar;
