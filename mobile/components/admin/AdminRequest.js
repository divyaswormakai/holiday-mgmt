import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';

import globalStyles from '../../styles/globalStyles';
import axios from '../../utils/axios';
import { COLORS, getBorderColor } from '../../utils/constant';
import { vh, vw } from '../../utils/viewport';

const AdminRequests = () => {
	const [showStatus, setShowStatus] = useState("PENDING");
	const [requestList, setRequestList] = useState([]);
	const [toShowRequestList, setToShowRequestList] = useState([]);

	useEffect(() => {
		GetRequestList();
	}, []);

	useEffect(() => {
		setToShowRequestList(
			showStatus === "PENDING"
				? requestList.filter((request) => request.decisionStatus === "PENDING")
				: [...requestList]
		);
	}, [showStatus]);

	const GetRequestList = async () => {
		try {
			const result = await axios.post("admin/list-request");
			if (result.status !== 200) {
				throw new Error(result);
			}
			setRequestList([...result.data].reverse());
			setToShowRequestList(
				result.data
					.reverse()
					.filter((request) => request.decisionStatus === "PENDING")
			);
		} catch (err) {
			console.log(err.response);
			ToastAndroid.show(
				err?.response?.data?.error || err.message,
				ToastAndroid.SHORT
			);
		}
	};

	return (
		<View style={globalStyles.modalContainer}>
			<Text style={globalStyles.adminTitleText}>Holiday Requests</Text>

			<View style={globalStyles.divider} />

			<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
				{["PENDING", "ALL"].map((item) => (
					<TouchableOpacity
						key={`Admin-Requestlist-Tab-${item}`}
						style={
							item === showStatus
								? styles.activeTextContainer
								: styles.inactiveTextContainer
						}
						onPress={() => setShowStatus(item)}
						activeOpacity={0.75}
					>
						<Text
							style={
								item === showStatus
									? styles.activeTextContainerText
									: styles.inactiveTextContainerText
							}
						>
							{item}
						</Text>
					</TouchableOpacity>
				))}
			</View>

			<View style={{ paddingTop: 1 * vh, marginBottom: 20 * vh }}>
				<FlatList
					data={toShowRequestList}
					keyExtractor={(item) => `Admin-Requestlist-${item.id}`}
					renderItem={({ item }) => (
						<View
							style={{
								padding: "5%",
								// height: 65 * vh,
								borderWidth: 2,
								borderColor: getBorderColor(item.decisionStatus),
								marginVertical: 1 * vh,
								flexDirection: "column",
							}}
						>
							<View style={{ flexDirection: "row" }}>
								<Text
									style={{
										fontWeight: "bold",
										fontFamily: "",
										fontSize: 3 * vw,
									}}
								>
									Date:{" "}
								</Text>
								<Text>
									{item.fromDate.slice(0, 10)} - {item.toDate.slice(0, 10)}
								</Text>
							</View>
							<View style={{ flexDirection: "row" }}>
								<Text style={{ fontWeight: "bold", fontFamily: "" }}>
									Reason:{" "}
								</Text>
								<Text>{item?.reason || ""}</Text>
							</View>
							<View style={{ flexDirection: "row" }}>
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
										color: getBorderColor(item.decisionStatus),
									}}
								>
									{item.decisionStatus}
								</Text>
							</View>
							{item.rejectionReason && (
								<View style={{ flexDirection: "row" }}>
									<Text style={{ fontWeight: "bold", fontFamily: "" }}>
										Rejection reason:{" "}
									</Text>
									<Text>{item?.rejectionReason || ""}</Text>
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
	activeTextContainer: {
		backgroundColor: COLORS.primary,
		width: "48%",
	},
	inactiveTextContainer: {
		borderColor: COLORS.primary,
		borderWidth: 2,
		width: "48%",
	},
	activeTextContainerText: {
		color: "white",
		textAlign: "center",
		padding: "5%",
	},
	inactiveTextContainerText: {
		color: COLORS.primary,
		textAlign: "center",
		padding: "5%",
	},
});

export default AdminRequests;
