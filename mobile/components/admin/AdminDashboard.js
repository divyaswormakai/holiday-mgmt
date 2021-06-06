import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Text, ToastAndroid, TouchableOpacity, View } from 'react-native';

import globalStyles from '../../styles/globalStyles';
import axios from '../../utils/axios';
import { COLORS, STORAGE_USER_DETAILS_KEY } from '../../utils/constant';
import { vw } from '../../utils/viewport';

const AdminDashboard = () => {
	const [profileDetails, setProfileDetails] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	useEffect(() => {
		GetAdminProfileDetails();
	}, []);

	const GetAdminProfileDetails = async () => {
		try {
			let adminDetail = await AsyncStorage.getItem(STORAGE_USER_DETAILS_KEY);
			adminDetail = JSON.parse(adminDetail);
			const result = await axios.post(`admin/profile/${adminDetail.id}`);
			if (result.status !== 200) {
				throw new Error(result);
			}
			setProfileDetails({ ...result.data });
		} catch (err) {
			console.log(err.response);
			ToastAndroid.show(
				err?.response?.data?.error || err.message,
				ToastAndroid.SHORT
			);
		}
		setIsLoaded(true);
	};

	const Logout = async () => {
		try {
			await AsyncStorage.removeItem(STORAGE_USER_DETAILS_KEY);
			navigation.navigate("Login");
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
			<Text style={globalStyles.adminTitleText}>Admin Details</Text>

			<View style={globalStyles.divider} />
			{isLoaded && profileDetails && (
				<View>
					<Text style={{ color: COLORS.primary, fontSize: 4.5 * vw }}>
						Full Name
					</Text>
					<Text style={{ fontSize: 4 * vw }}>
						{profileDetails.fullName || ""}
					</Text>

					<Text style={{ color: COLORS.primary, fontSize: 4.5 * vw }}>
						Username
					</Text>
					<Text style={{ fontSize: 4 * vw }}>{profileDetails.username}</Text>

					<Text style={{ color: COLORS.primary, fontSize: 4.5 * vw }}>
						Email
					</Text>
					<Text style={{ fontSize: 4 * vw }}>{profileDetails.email}</Text>

					<Text style={{ color: COLORS.primary, fontSize: 4.5 * vw }}>
						Joined Date:
					</Text>
					<Text style={{ fontSize: 4 * vw }}>
						{profileDetails.createdAt.slice(0, 10)}
					</Text>

					<View style={{ height: 5 * vw }} />

					<TouchableOpacity style={globalStyles.redOutlineBtn} onPress={Logout}>
						<Text style={globalStyles.dangerColorText}>Logout</Text>
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
};

export default AdminDashboard;
