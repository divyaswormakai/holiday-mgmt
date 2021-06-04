import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Text, ToastAndroid, View } from 'react-native';

import axios from '../../utils/axios';
import { STORAGE_USER_DETAILS_KEY } from '../../utils/constant';

const UserEditProfileModal = ({ showModal, setShowModal }) => {
	const [isInEditMode, setIsInEditMode] = useState(false);
	const [profileDetails, setProfileDetails] = useState({});
	useEffect(() => {
		getUserProfileDetails();
	}, []);

	const getUserProfileDetails = async () => {
		try {
			let userDetails = await AsyncStorage.getItem(STORAGE_USER_DETAILS_KEY);
			userDetails = JSON.parse(userDetails);
			const result = await axios.post(`user/profile/${userDetails.id}`);
			if (result.status !== 200) {
				throw new Error(result);
			}
			setProfileDetails({ ...result.data });
		} catch (err) {
			ToastAndroid.show(err?.response?.data?.error, ToastAndroid.SHORT);
		}
	};
	return (
		<View>
			<Text>This is where the profile will be seen and edited</Text>
		</View>
	);
};

export default UserEditProfileModal;
