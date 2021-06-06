import React, { useEffect, useState } from 'react';
import { Text, ToastAndroid, View } from 'react-native';

import globalStyles from '../../styles/globalStyles';
import axios from '../../utils/axios';

const AdminRequests = () => {
	const [showStatus, setShowStatus] = useState("PENDING");
	const [requestList, setRequestList] = useState([]);

	useEffect(() => {
		GetRequestList();
	}, []);

	const GetRequestList = async () => {
		try {
			const result = await axios.post(`admin/list-request`);
			if (result.status !== 200) {
				throw new Error(result);
			}
			setRequestList([...result.data]);
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
			<Text>This is where the requests will be </Text>
		</View>
	);
};

export default AdminRequests;
