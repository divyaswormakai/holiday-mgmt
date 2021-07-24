import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';

import globalStyles from '../../styles/globalStyles';
import axios from '../../utils/axios';
import { COLORS, getBorderColor } from '../../utils/constant';
import { vh, vw } from '../../utils/viewport';
import AdminRequestFormModal from './Modals/AdminRequestFormModal';

const AdminRequests = () => {
	const [showStatus, setShowStatus] = useState("PENDING");
	const [requestList, setRequestList] = useState([]);
	const [toShowRequestList, setToShowRequestList] = useState([]);
	const [selectedRequest, setSelectedRequest] = useState({});
	const [showModal, setShowModal] = useState(false);

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
			ToastAndroid.show(
				err?.response?.data?.error || err.message,
				ToastAndroid.SHORT
			);
		}
	};

	const UpdateRequestList = (updatedRequest) => {
		const updatedList = requestList.map((request) => {
			if (request.id === updatedRequest.id) {
				return updatedRequest;
			}
			return request;
		});
		setShowStatus("PENDING");
		setRequestList([...updatedList]);
		setToShowRequestList(
			updatedList.filter((request) => request.decisionStatus === "PENDING")
		);
	};

	return (
		<View style={globalStyles.modalContainer}>
			<Modal
				animationType="slide"
				visible={showModal}
				onRequestClose={() => {
					setShowModal(!showModal);
				}}
			>
				<AdminRequestFormModal
					setShowModal={setShowModal}
					requestDetails={selectedRequest}
					UpdateRequestList={UpdateRequestList}
				/>
			</Modal>
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
						<TouchableOpacity
							style={{
								padding: "5%",
								borderWidth: 2,
								borderColor: getBorderColor(item.decisionStatus),
								marginVertical: 1 * vh,
								flexDirection: "column",
							}}
							onPress={() => {
								setSelectedRequest(item);
								setShowModal(true);
							}}
							activeOpacity={0.3}
						>
							<View style={{ flexDirection: "row" }}>
								<Text
									style={{
										fontWeight: "bold",
										fontFamily: "",
										fontSize: 4 * vw,
									}}
								>
									Date:{" "}
								</Text>
								<Text>
									{item.fromDate.slice(0, 10)} - {item.toDate.slice(0, 10)}
								</Text>
							</View>
							<View style={{ flexDirection: "row", width: "80%" }}>
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
								<View style={{ flexDirection: "column" }}>
									<Text style={{ fontWeight: "bold", fontFamily: "" }}>
										Rejection reason:{" "}
									</Text>
									<Text>{item?.rejectionReason || ""}</Text>
								</View>
							)}
						</TouchableOpacity>
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
