import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../utils/constant";
import { vw } from "../../utils/viewport";
import moment from "moment";

const UserTimeTable = () => {
	const [currTime, setCurrTime] = useState("");
	const [currDate, setCurrDate] = useState("");
	useEffect(() => {
		setTimeout(() => {
			setCurrDate(moment().format("YYYY/MM/DD"));
			setCurrTime(moment().format("hh:mm A"));
		}, 1000);
	}, []);
	return (
		<View style={styles.dateTimeContainer}>
			<View style={styles.dateContainer}>
				<Text style={styles.boldText}>Date</Text>
				<Text style={styles.mainText}>{currDate}</Text>
			</View>
			<View style={styles.timeContainer}>
				<Text style={styles.boldText}>Time</Text>
				<Text style={styles.mainText}>{currTime}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	dateTimeContainer: { flexDirection: "row", justifyContent: "space-between" },
	dateContainer: {
		width: 45 * vw,
		borderWidth: 2,
		borderColor: COLORS.primary,
		paddingHorizontal: "5%",
		paddingVertical: "3%",
		alignItems: "flex-start",
		justifyContent: "space-between",
		borderRightWidth: 1,
	},
	boldText: { fontWeight: "bold", fontFamily: "", fontSize: 4.5 * vw },
	timeContainer: {
		width: 45 * vw,
		borderWidth: 2,
		borderColor: COLORS.primary,
		paddingHorizontal: "5%",
		paddingVertical: "3%",
		justifyContent: "space-between",
		alignItems: "flex-end",
		borderLeftWidth: 1,
	},
	mainText: { fontSize: 4 * vw },
});

export default UserTimeTable;
