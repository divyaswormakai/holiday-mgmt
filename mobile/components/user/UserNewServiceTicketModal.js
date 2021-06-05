import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constant';
import { vh, vw } from '../../utils/viewport';

const UserNewServiceTicketModal = ({
	setShowAddRequestModal,
	addNewSupportRequest,
	isLoading,
}) => {
	const [reason, setReason] = useState("");

	const submitRequest = () => {
		const body = { reason };
		addNewSupportRequest(body);
	};
	return (
		<View
			style={{
				// alignItems: "center",
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
					textAlign: "center",
				}}
			>
				SUPPORT TICKET FORM
			</Text>
			<View style={globalStyles.divider} />

			<Text style={globalStyles.primaryText}>Reason</Text>
			<TextInput
				value={reason}
				onChangeText={setReason}
				style={{ ...globalStyles.textInput, height: 15 * vh, width: "100%" }}
				placeholder="Write your concern here..."
				multiline={true}
				numberOfLines={5}
			/>

			<TouchableOpacity
				style={globalStyles.activeBtn}
				activeOpacity={0.5}
				onPress={submitRequest}
				disabled={isLoading}
			>
				<Text style={globalStyles.activeBtnTxt}>REQUEST</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={globalStyles.redOutlineBtn}
				onPress={() => setShowAddRequestModal(false)}
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
		</View>
	);
};

export default UserNewServiceTicketModal;
