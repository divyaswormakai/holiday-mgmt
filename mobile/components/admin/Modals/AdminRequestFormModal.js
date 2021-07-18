import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import React, { useState ,useEffect} from 'react';
import { Image, ScrollView, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';

import globalStyles from '../../../styles/globalStyles';
import axios from '../../../utils/axios';
import { BASEURL, COLORS, getBorderColor, STORAGE_USER_DETAILS_KEY } from '../../../utils/constant';
import { vh, vw } from '../../../utils/viewport';

const AdminRequestFormModal = ({
	requestDetails,
	setShowModal,
	UpdateRequestList,
}) => {
	const [editable, setEditable] = useState(false);
	const [decision, setDecision] = useState(requestDetails.decisionStatus);
	const [rejectionReason, setRejectionReason] = useState(
		requestDetails.rejectionReason || ""
	);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (moment(requestDetails.fromDate).isAfter(new Date())) {
			setEditable(true);
		}
	}, []);

	const RegisterDecision = async () => {
		setIsLoading(true);
		try {
			if (decision === "REJECTED" && rejectionReason.length < 15) {
				throw new Error("Reason should not be less than 15 letters.");
			}
			let adminDetails = await AsyncStorage.getItem(STORAGE_USER_DETAILS_KEY);
			adminDetails = JSON.parse(adminDetails);
			const result = await axios.post(
				`admin/action-request/${requestDetails.id}`,
				{
					decisionStatus: decision,
					rejectionReason,
					decisionBy: adminDetails.id,
				}
			);

			if (result.status !== 200) {
				throw new Error(result);
			}
			await UpdateRequestList(result.data);
			setShowModal(false);
			ToastAndroid.show("Decision saved successfully.", ToastAndroid.SHORT);
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
					REQUEST DETAIL
				</Text>
			</View>
			<View style={globalStyles.editProfileDivider} />

			<ScrollView showsVerticalScrollIndicator={false}>
				<View>
					<Text style={{ ...globalStyles.primaryColorText, fontSize: 5 * vw }}>
						Request By:
					</Text>
					<View style={{ flexDirection: "row", marginVertical: 1 * vh }}>
						<View>
							{requestDetails.employee.profilePhoto ? (
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
								<Text>{requestDetails.employee.fullName}</Text>
							</View>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<Text style={globalStyles.primaryText}>Email: </Text>
								<Text>{requestDetails.employee.email}</Text>
							</View>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<Text style={globalStyles.primaryText}>Username: </Text>
								<Text>{requestDetails.employee.username}</Text>
							</View>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<Text style={globalStyles.primaryText}>Total Holidays: </Text>
								<Text>{requestDetails.employee.totalHolidays}</Text>
							</View>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<Text style={globalStyles.dangerText}>Used Holidays: </Text>
								<Text>{requestDetails.employee.completedHolidays}</Text>
							</View>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<Text style={globalStyles.primaryText}>
									Remaining Holidays:{" "}
								</Text>
								<Text>
									{parseInt(requestDetails.employee.totalHolidays, 10) -
										parseInt(requestDetails.employee.completedHolidays, 10)}
								</Text>
							</View>
						</View>
					</View>
				</View>

				<View style={globalStyles.editProfileDivider} />

				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<Text style={{ ...globalStyles.primaryColorText, fontSize: 4 * vw }}>
						Department:
					</Text>
					<Text style={{ fontSize: 4 * vw }}>{requestDetails.department}</Text>
				</View>

				<View
					style={{
						alignItems: "center",
						flexDirection: "row",
						justifyContent: "space-around",
					}}
				>
					<View style={{ alignItems: "center" }}>
						<Text
							style={{ ...globalStyles.primaryColorText, fontSize: 4 * vw }}
						>
							From:
						</Text>
						<Text style={{ fontSize: 4 * vw }}>
							{requestDetails.fromDate.slice(0, 10)}
						</Text>
					</View>
					<View style={{ alignItems: "center" }}>
						<Text
							style={{ ...globalStyles.primaryColorText, fontSize: 4 * vw }}
						>
							To:
						</Text>
						<Text style={{ fontSize: 4 * vw }}>
							{requestDetails.toDate.slice(0, 10)}
						</Text>
					</View>
				</View>

				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<Text style={{ ...globalStyles.primaryColorText, fontSize: 4 * vw }}>
						Total Working Days:
					</Text>
					<Text style={{ fontSize: 4 * vw }}>
						{requestDetails.totalWorkingDays}
					</Text>
				</View>

				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<Text style={{ ...globalStyles.primaryColorText, fontSize: 4 * vw }}>
						Status:
					</Text>
					<Text
						style={{
							fontSize: 5 * vw,
							color: getBorderColor(requestDetails.decisionStatus),
						}}
					>
						{requestDetails.decisionStatus}
					</Text>
				</View>

				{editable && (
					<View>
						<View style={globalStyles.editProfileDivider} />

						<Text
							style={{ ...globalStyles.primaryColorText, fontSize: 5 * vw }}
						>
							DECISION:
						</Text>

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
								{["ACCEPTED", "REJECTED", "PENDING"].map((item) => (
									<Picker.Item
										label={item}
										value={item}
										key={`AdminRequest-Form-Modal-Picker-${item}`}
									/>
								))}
							</Picker>
						</View>

						{decision === "REJECTED" && (
							<TextInput
								value={rejectionReason}
								onChangeText={setRejectionReason}
								style={{
									borderColor: COLORS.primary,
									borderWidth: 2,
									padding: 2 * vw,
									marginVertical: 1 * vh,
									textAlignVertical: "top",
								}}
								placeholder="Rejection Reason"
								multiline={true}
								numberOfLines={7}
							/>
						)}

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
					</View>
				)}
			</ScrollView>
		</View>
	);
};

export default AdminRequestFormModal;
