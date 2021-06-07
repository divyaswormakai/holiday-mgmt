import { StyleSheet } from 'react-native';

import { COLORS } from '../utils/constant';
import { vh, vw } from '../utils/viewport';

const globalStyles = StyleSheet.create({
	container: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		textAlign: "center",
		height: "100%",
		marginHorizontal: "5%",
	},
	textInput: {
		height: 5 * vh,
		borderColor: COLORS.primary,
		borderWidth: 2,
		width: 75 * vw,
		paddingHorizontal: 2 * vw,
		marginVertical: 1 * vh,
	},
	textInputDisabled: {
		height: 5 * vh,
		borderColor: COLORS.primary,
		borderWidth: 2,
		width: 75 * vw,
		paddingHorizontal: 2 * vw,
		marginVertical: 1 * vh,
		backgroundColor: COLORS.gray,
	},
	textInputDate: {
		height: 5 * vh,
		borderColor: COLORS.primary,
		borderWidth: 2,
		width: 75 * vw,
		paddingHorizontal: 2 * vw,
		marginVertical: 1 * vh,
		justifyContent: "center",
	},
	homeContainer: {
		display: "flex",
		marginHorizontal: "5%",
		flexGrow: 1,
		paddingBottom: 10 * vh,
	},
	modalContainer: {
		margin: "5%",
		paddingBottom: "5%",
		// alignItems: "center",
	},
	requestBtnTxt: {
		color: "white",
		fontSize: 5 * vw,
		fontWeight: "bold",
		fontFamily: "",
		paddingVertical: 2 * vh,
		width: "100%",
		textAlign: "center",
	},
	requestBtn: {
		backgroundColor: COLORS.primary,
		width: "100%",
		position: "absolute",
		zIndex: 1,
		bottom: 1 * vh,
		alignItems: "center",
		justifyContent: "center",
	},
	activeBtn: {
		backgroundColor: COLORS.primary,
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	activeBtnTxt: {
		color: "white",
		fontSize: 4 * vw,
		fontWeight: "bold",
		fontFamily: "",
		paddingVertical: 2 * vh,
		width: "100%",
		textAlign: "center",
	},
	redOutlineBtn: {
		width: "100%",
		borderColor: COLORS.red,
		borderWidth: 2,
		padding: "3%",
		alignItems: "center",
		marginVertical: 1 * vh,
	},
	divider: {
		height: 2,
		backgroundColor: COLORS.primary,
		width: "100%",
		marginBottom: 3 * vh,
	},
	primaryColorText: {
		color: COLORS.primary,
	},
	dangerColorText: {
		color: COLORS.red,
	},
	primaryText: { color: COLORS.primary, fontSize: 3.5 * vw },
	dangerText: { color: COLORS.red, fontSize: 3.5 * vw },
	editProfileDivider: {
		height: 2,
		backgroundColor: "black",
		marginVertical: 1 * vh,
	},
	adminTitleText: { fontSize: 7 * vw, color: COLORS.primary },
});

export default globalStyles;
