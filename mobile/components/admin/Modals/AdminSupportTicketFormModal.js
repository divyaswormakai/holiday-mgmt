import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';

import globalStyles from '../../../styles/globalStyles';
import axios from '../../../utils/axios';
import { BASEURL, COLORS } from '../../../utils/constant';
import { vh, vw } from '../../../utils/viewport';

const AdminSupportTicketFormModal = ({
	ticketDetails,
	setShowModal,
	UpdateTicketList,
}) => {
	const [decision, setDecision] = useState(ticketDetails.status);
	const [adminResponse, setAdminResponse] = useState(
		ticketDetails.adminResponse || ""
	);

	const [isLoading, setIsLoading] = useState(false);

	const RegisterDecision = async () => {
		setIsLoading(true);
		try {
			if (decision === "RESOLVED" && adminResponse.length < 15) {
				throw new Error("Response should not be less than 15 letters.");
			}

			const result = await axios.post(
				`admin/update-support-ticket/${ticketDetails.id}`,
				{
					status: decision,
					adminResponse,
				}
			);

			if (result.status !== 200) {
				throw new Error(result);
			}
			await UpdateTicketList(result.data);
			setShowModal(false);
			ToastAndroid.show(
				"Support ticket updated successfully.",
				ToastAndroid.SHORT
			);
		} catch (err) {
			ToastAndroid.show(
				err?.response?.data?.error || err?.message || "Error",
				ToastAndroid.SHORT
			);
		}
		setIsLoading(false);
	};

	return (
		<View style={globalStyles.modalContainer}>
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<TouchableOpacity onPress={() => setShowModal((prev) => !prev)}>
					<Ionicons
						name="ios-chevron-back"
						size={4.5 * vh}
						color={COLORS.primary}
					/>
				</TouchableOpacity>
				<Text style={{ ...globalStyles.primaryColorText, fontSize: 4.5 * vw }}>
					TICKET DETAIL
				</Text>
			</View>
			<View style={globalStyles.editProfileDivider} />

			<ScrollView showsVerticalScrollIndicator={false}>
				<View>
					<Text style={{ ...globalStyles.primaryColorText, fontSize: 5 * vw }}>
						Created By:
					</Text>
					<View style={{ flexDirection: "row", marginVertical: 1 * vh }}>
						<View>
							{ticketDetails.employee.profilePhoto ? (
								<Image
									source={{
										uri: `${BASEURL}${item?.profilePicture?.replace(
											"\\",
											"/"
										)}`,
									}}
									style={{ height: 10 * vh, width: 10 * vh, borderRadius: 200 }}
								/>
							) : (
								<Ionicons
									name="person-circle-outline"
									color={COLORS.primary}
									size={10 * vh}
								/>
							)}
						</View>
						<View style={{ justifyContent: "center", paddingLeft: 3 * vw }}>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<Text style={globalStyles.primaryText}>Name: </Text>
								<Text>{ticketDetails.employee.fullName}</Text>
							</View>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<Text style={globalStyles.primaryText}>Email: </Text>
								<Text>{ticketDetails.employee.email}</Text>
							</View>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<Text style={globalStyles.primaryText}>Username: </Text>
								<Text>{ticketDetails.employee.username}</Text>
							</View>
						</View>
					</View>
				</View>

				<View style={globalStyles.editProfileDivider} />

				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<Text style={{ ...globalStyles.primaryColorText, fontSize: 4 * vw }}>
						Created At:{" "}
					</Text>
					<Text style={{ fontSize: 4 * vw }}>
						{ticketDetails.creationDate.slice(0, 10)}
					</Text>
				</View>

				<View>
					<Text style={{ ...globalStyles.primaryColorText, fontSize: 4 * vw }}>
						Reason:
					</Text>
					<Text style={{ fontSize: 3 * vw }}>{ticketDetails.reason}</Text>
				</View>

				<View
					style={{
						borderColor: COLORS.primary,
						borderWidth: 2,
						marginTop: 2 * vw,
					}}
				>
					<Picker
						selectedValue={decision}
						onValueChange={(itemValue, itemIndex) => setDecision(itemValue)}
						mode="dropdown"
						dropdownIconColor={COLORS.primary}
					>
						{["RESOLVED", "PENDING"].map((item) => (
							<Picker.Item
								label={item}
								value={item}
								key={`AdminSupport-Form-Modal-Picker-${item}`}
							/>
						))}
					</Picker>
				</View>

				<TextInput
					value={adminResponse}
					onChangeText={setAdminResponse}
					style={{
						borderColor: COLORS.primary,
						borderWidth: 2,
						padding: 2 * vw,
						marginVertical: 1 * vh,
						textAlignVertical: "top",
					}}
					placeholder="Admin Response"
					multiline={true}
					numberOfLines={7}
				/>

				<TouchableOpacity
					onPress={RegisterDecision}
					style={{
						backgroundColor: COLORS.primary,
						alignItems: "center",
						padding: 2 * vh,
						marginVertical: 1 * vh,
					}}
					disabled={isLoading}
				>
					<Text style={{ color: "white" }}>CONFIRM</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{ ...globalStyles.redOutlineBtn }}
					onPress={() => setShowModal(false)}
				>
					<Text style={globalStyles.dangerColorText}>CANCEL</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
};

export default AdminSupportTicketFormModal;
