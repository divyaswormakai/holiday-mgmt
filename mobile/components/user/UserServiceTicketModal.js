import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';

import globalStyles from '../../styles/globalStyles';
import axios from '../../utils/axios';
import { COLORS } from '../../utils/constant';
import { vh, vw } from '../../utils/viewport';
import UserNewServiceTicketModal from './UserNewServiceTicketModal';

const UserServiceTicketModal = ({ setShowServiceModal, profileDetails }) => {
	const [requestList, setRequestList] = useState(null);
	const [showAddRequestModal, setShowAddRequestModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	useEffect(() => {
		GetUserRequestList();
	}, []);

	const GetUserRequestList = async () => {
		try {
			const result = await axios.post(
				`user/list-support-ticket/${profileDetails.id}`
			);
			if (result.status !== 200) {
				throw new Error(result);
			}
			setRequestList([...result.data]);
		} catch (err) {
			ToastAndroid.show(
				err?.response?.data?.error || err.message,
				ToastAndroid.SHORT
			);
		}
	};

	const addNewSupportRequest = async (body) => {
		try {
			setIsLoading(true);
			const result = await axios.post(`user/add-support-ticket`, {
				...body,
				userID: profileDetails.id,
			});
			if (result.status !== 200) {
				throw new Error(result);
			}
			ToastAndroid.show(
				"Created a support ticket, an admin will be there to support you on the issue.",
				ToastAndroid.SHORT
			);
			await GetUserRequestList();
			setShowAddRequestModal(false);
		} catch (err) {
			ToastAndroid.show(
				err?.response?.data?.error || err.message,
				ToastAndroid.SHORT
			);
		}
		setIsLoading(false);
	};

	return (
		<View style={globalStyles.modalContainer}>
			<Modal
				animationType="slide"
				visible={showAddRequestModal}
				onRequestClose={() => {
					setShowAddRequestModal(false);
				}}
			>
				<UserNewServiceTicketModal
					setShowAddRequestModal={setShowAddRequestModal}
					addNewSupportRequest={addNewSupportRequest}
					isLoading={isLoading}
				/>
			</Modal>
			<View style={styles.profileModalContainer}>
				<TouchableOpacity onPress={() => setShowServiceModal((prev) => !prev)}>
					<Ionicons
						name="ios-chevron-back"
						size={5 * vh}
						color={COLORS.primary}
					/>
				</TouchableOpacity>
				<Text style={globalStyles.primaryText}>YOUR SERVICE REQUESTS</Text>
			</View>
			<View style={globalStyles.editProfileDivider} />
			<TouchableOpacity
				style={globalStyles.activeBtn}
				activeOpacity={0.5}
				onPress={() => setShowAddRequestModal((prev) => !prev)}
			>
				<Text style={globalStyles.activeBtnTxt}>OPEN A TICKET</Text>
			</TouchableOpacity>
			<View style={{ paddingBottom: 25 * vh }}>
				<FlatList
					data={requestList}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<View
							style={{
								padding: "5%",
								borderWidth: 2,
								borderColor:
									item.status === "PENDING" ? COLORS.gray : COLORS.primary,
								marginVertical: 1 * vh,
							}}
						>
							<View style={{ flexDirection: "row", flex: 1, flexWrap: "wrap" }}>
								<Text
									style={{
										fontWeight: "bold",
										fontFamily: "",
										fontSize: 4 * vw,
									}}
								>
									Created At:{" "}
								</Text>
								<Text>{item.creationDate.slice(0, 10)}</Text>
							</View>

							<View style={{ flexDirection: "row", flex: 1, flexWrap: "wrap" }}>
								<Text
									style={{
										fontWeight: "bold",
										fontFamily: "",
										fontSize: 4 * vw,
									}}
								>
									Reason:{" "}
								</Text>
								<Text>{item.reason || ""}</Text>
							</View>

							<View style={{ flexDirection: "row", flex: 1, flexWrap: "wrap" }}>
								<Text
									style={{
										fontWeight: "bold",
										fontFamily: "",
										fontSize: 4 * vw,
									}}
								>
									Status:{" "}
								</Text>
								<Text
									style={{
										fontWeight: "bold",
										fontFamily: "",
										fontSize: 4 * vw,
										color:
											item.status === "PENDING" ? COLORS.gray : COLORS.primary,
									}}
								>
									{item.status}
								</Text>
							</View>

							{item.adminResponse && (
								<View
									style={{ flexDirection: "row", flex: 1, flexWrap: "wrap" }}
								>
									<Text style={{ fontWeight: "bold", fontFamily: "" }}>
										Comment:{" "}
									</Text>
									<Text>{item?.adminResponse || ""}</Text>
								</View>
							)}
						</View>
					)}
				/>
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	profileModalContainer: { flexDirection: "row", alignItems: "center" },
});
export default UserServiceTicketModal;
