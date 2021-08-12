import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';

import globalStyles from '../../styles/globalStyles';
import axios from '../../utils/axios';
import { COLORS } from '../../utils/constant';
import { vh, vw } from '../../utils/viewport';

const UserRequestForm = ({
	setShowModal,
	setCurrentScreen,
	profileDetails,
	...props
}) => {
	const [year, setYear] = useState(moment().format("YYYY"));
	const [department, setDepartment] = useState("");
	const [totalDays, setTotalDays] = useState("");
	const [reason, setReason] = useState("");
	const [showDatePicker, setShowDatePicker] = useState(null);
	const [fromDate, setFromDate] = useState(new Date());
	const [toDate, setToDate] = useState(new Date());
	const [loading, setIsLoading] = useState(false);

	const dateChangeHandler = (ev, selectedDate) => {
		if (showDatePicker === "From") {
			setFromDate(selectedDate || fromDate);
		} else {
			setToDate(selectedDate || toDate);
		}
		setShowDatePicker(null);
	};

	const getDateText = (type) => {
		const currDate = type === "From" ? fromDate : toDate;
		return moment(currDate).format("YYYY-MM-DD");
	};

	const SubmitHolidayRequest = async () => {
		try {
			setIsLoading(true);
			const duration = moment.duration(moment(toDate).diff(moment(fromDate)));

			if (duration.asDays() < 0) {
				throw new Error("Please enter valid duration date");
			}
			if (parseInt(totalDays, 10) >= parseInt(duration.asDays() + 1, 10) + 1) {
				throw new Error(
					"Working days should be equal or less than difference of holiday request date"
				);
			}

			if (reason.length < 15) {
				throw new Error(
					"Please write a valid reason in words no less thatn 15 letters."
				);
			}

			const body = {
				userID: profileDetails.id,
				year,
				department,
				fromDate: getDateText("From"),
				toDate: getDateText("To"),
				totalWorkingDays: totalDays,
				reason,
			};

			const result = await axios.post("user/add-request", body);
			if (result.status !== 200) {
				throw new Error(result);
			}
			ToastAndroid.show(
				"Successfully created your holiday request. You can see the status in your history.",
				ToastAndroid.LONG
			);
			setCurrentScreen("Dashboard");
			setShowModal(false);
		} catch (err) {
			ToastAndroid.show(
				err?.response?.data?.error || err.message,
				ToastAndroid.SHORT
			);
		}

		setIsLoading(false);
	};

	return (
		<View
			style={{
				alignItems: "center",
				marginTop: 5 * vh,
				marginHorizontal: 5 * vw,
			}}
		>
			<Text
				style={{
					color: COLORS.primary,
					fontSize: 3 * vh,
					fontWeight: "bold",
					fontFamily: "",
				}}
			>
				HOLIDAY REQUEST FORM
			</Text>
			<View style={globalStyles.divider} />
			{profileDetails && (
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: 10 * vh }}
				>
					<Text style={globalStyles.primaryText}>Employee Name</Text>
					<TextInput
						value={profileDetails.fullName}
						style={globalStyles.textInputDisabled}
						editable={false}
						testID="username"
					/>

					<Text style={globalStyles.primaryText}>Year</Text>
					<TextInput
						{...props}
						value={year}
						onChangeText={setYear}
						style={globalStyles.textInput}
						placeholder="Year"
						autoCapitalize="none"
						keyboardType="numeric"
						testID="form.Year"
					/>

					<Text style={globalStyles.primaryText}>Department</Text>
					<TextInput
						value={department}
						onChangeText={setDepartment}
						style={globalStyles.textInput}
						placeholder="Department"
					/>

					{["From", "To"].map((item) => (
						<View key={`REquestFormDate-${item}`}>
							<Text style={globalStyles.primaryText}>{item} Date</Text>

							<TouchableOpacity
								style={globalStyles.textInputDate}
								onPress={() => {
									setShowDatePicker(item);
								}}
							>
								<Text>{getDateText(item)}</Text>
							</TouchableOpacity>
						</View>
					))}
					{showDatePicker && (
						<DateTimePicker
							testID="DateTimePicker"
							value={showDatePicker === "From" ? fromDate : toDate}
							mode={"date"}
							is24Hour={false}
							display="default"
							onChange={dateChangeHandler}
						/>
					)}

					<Text style={globalStyles.primaryText}>Total Working Days</Text>
					<TextInput
						value={totalDays}
						onChangeText={setTotalDays}
						style={globalStyles.textInput}
						placeholder="Total Working Days"
						keyboardType="numeric"
					/>

					<Text style={globalStyles.primaryText}>Reason</Text>
					<TextInput
						value={reason}
						onChangeText={setReason}
						style={{ ...globalStyles.textInput, height: 15 * vh }}
						placeholder="Reason for Holiday Request"
						multiline={true}
						numberOfLines={5}
					/>

					<TouchableOpacity
						style={globalStyles.activeBtn}
						activeOpacity={0.5}
						onPress={SubmitHolidayRequest}
						disabled={loading}
					>
						<Text style={globalStyles.activeBtnTxt}>REQUEST</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={globalStyles.redOutlineBtn}
						onPress={() => setShowModal(false)}
					>
						<Text
							style={{
								color: COLORS.red,
								fontSize: 4 * vw,
								fontWeight: "bold",
								fontFamily: "",
								paddingVertical: 0.5 * vh,
							}}
						>
							CANCEL
						</Text>
					</TouchableOpacity>
				</ScrollView>
			)}
		</View>
	);
};

export default UserRequestForm;
