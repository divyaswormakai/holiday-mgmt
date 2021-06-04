import { StyleSheet } from 'react-native';

import { COLORS } from '../utils/constant';
import { vh, vw } from '../utils/viewport';

const globalStyles = StyleSheet.create({
	container: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
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
	homeContainer: {
		height: "100%",
		marginHorizontal: "5%",
	},
});

export default globalStyles;
