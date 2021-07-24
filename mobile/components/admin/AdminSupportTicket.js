import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';

import globalStyles from '../../styles/globalStyles';
import axios from '../../utils/axios';
import { COLORS } from '../../utils/constant';
import { vh, vw } from '../../utils/viewport';
import AdminSupportTicketFormModal from './Modals/AdminSupportTicketFormModal';

const AdminSupportTicket = () => {
	const [showStatus, setShowStatus] = useState("PENDING");
	const [ticketList, setTicketList] = useState([]);
	const [toShowTicketList, setToShowTicketList] = useState([]);

	const [selectedTicket, setSelectedTicket] = useState({});
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		GetTicketList();
	}, []);

	useEffect(() => {
		setToShowTicketList(
			showStatus === "PENDING"
				? ticketList.filter((request) => request.status === "PENDING")
				: [...ticketList]
		);
	}, [showStatus]);

	const GetTicketList = async () => {
		try {
			const result = await axios.post("admin/list-support-ticket");
			if (result.status !== 200) {
				throw new Error(result);
			}
			setTicketList([...result.data].reverse());
			setToShowTicketList(
				result.data.reverse().filter((request) => request.status === "PENDING")
			);
		} catch (err) {
			ToastAndroid.show(
				err?.response?.data?.error || err.message,
				ToastAndroid.SHORT
			);
		}
	};

	const UpdateTicketList = (updatedTicket) => {
		const updatedList = ticketList.map((ticket) => {
			if (ticket.id === updatedTicket.id) {
				return updatedTicket;
			}
			return ticket;
		});
		setShowStatus("PENDING");

		setTicketList([...updatedList]);
		setToShowTicketList(
			updatedList.filter((ticket) => ticket.status === "PENDING")
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
				<AdminSupportTicketFormModal
					setShowModal={setShowModal}
					ticketDetails={selectedTicket}
					UpdateTicketList={UpdateTicketList}
				/>
			</Modal>
			<Text style={globalStyles.adminTitleText}>Support Tickets</Text>

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
					data={toShowTicketList}
					keyExtractor={(item) => `Admin-Requestlist-${item.id}`}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={{
								padding: "5%",
								borderWidth: 2,
								borderColor:
									item.status === "PENDING" ? COLORS.gray : COLORS.primary,
								marginVertical: 1 * vh,
							}}
							onPress={() => {
								setSelectedTicket(item);
								setShowModal(true);
							}}
							activeOpacity={0.5}
						>
							<View style={{ flexDirection: "row" }}>
								<Text style={{ fontWeight: "bold", fontFamily: "" }}>
									Created At:{" "}
								</Text>
								<Text>{item.creationDate.slice(0, 10)}</Text>
							</View>

							<View style={{ flexDirection: "row", width: "80%" }}>
								<Text style={{ fontWeight: "bold", fontFamily: "" }}>
									Reason:{" "}
								</Text>
								<Text>{item.reason || ""}</Text>
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
										color:
											item.status === "PENDING" ? COLORS.gray : COLORS.primary,
									}}
								>
									{item.status}
								</Text>
							</View>

							{item.adminResponse ? (
								<View style={{ flexDirection: "column" }}>
									<Text style={{ fontWeight: "bold", fontFamily: "" }}>
										Comment:{" "}
									</Text>
									<Text>{item?.adminResponse || ""}</Text>
								</View>
							) : null}
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

export default AdminSupportTicket;
