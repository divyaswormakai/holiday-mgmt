import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constant';
import { vh } from '../../utils/viewport';

const UserDashboard = ({ profileDetails }) => {
	return profileDetails ? (
		<View style={styles.dashboardContainer}>
			<Text style={styles.dashboardTitle}>Status Report</Text>

			<View style={globalStyles.divider}></View>

			<View style={styles.greenTextContainer}>
				<Text style={styles.textContainerTitle}>Total Holidays:</Text>
				<Text style={styles.greenTextContainerText}>
					{profileDetails.totalHolidays}
				</Text>
			</View>
			<View style={styles.redTextContainer}>
				<Text style={styles.textContainerTitle}>Remaining: </Text>
				<Text style={styles.redTextContainerText}>
					{profileDetails.completedHolidays}
				</Text>
			</View>

			<View style={styles.greenTextContainer}>
				<Text style={styles.textContainerTitle}>Remaining: </Text>
				<Text style={styles.greenTextContainerText}>
					{profileDetails.totalHolidays - profileDetails.completedHolidays ||
						""}
				</Text>
			</View>
		</View>
	) : (
		<ActivityIndicator color={COLORS.primary} size="large" />
	);
};

const styles = StyleSheet.create({
	dashboardContainer: {
		alignItems: "center",
		marginTop: 2 * vh,
	},
	dashboardTitle: { fontSize: 2.75 * vh, fontFamily: "", fontWeight: "bold" },

	greenTextContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		borderColor: COLORS.primary,
		borderWidth: 2,
		width: "100%",
		paddingVertical: "5%",
		marginVertical: 1 * vh,
	},
	redTextContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		borderColor: COLORS.red,
		borderWidth: 2,
		width: "100%",
		paddingVertical: "5%",
		marginVertical: 1 * vh,
	},
	textContainerTitle: {
		fontSize: 3 * vh,
		width: "65%",
		paddingLeft: "10%",
	},
	greenTextContainerText: {
		fontSize: 5 * vh,
		width: "35%",
		color: COLORS.primary,
		fontWeight: "bold",
		fontFamily: "",
	},
	redTextContainerText: {
		fontSize: 5 * vh,
		width: "35%",
		color: COLORS.red,
		fontWeight: "bold",
		fontFamily: "",
	},
});
export default UserDashboard;
