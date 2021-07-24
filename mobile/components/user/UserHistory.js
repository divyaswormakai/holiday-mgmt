import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Animated, FlatList, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import axios from '../../utils/axios';
import { getBorderColor } from '../../utils/constant';
import { vh, vw } from '../../utils/viewport';

const SwipeableView = ({ item, deleteRequest }) => {
	const rightSwap = (progress, dragX) => {
		const scale = dragX.interpolate({
			inputRange: [0, 100],
			outputRange: [0, 1],
			extrapolate: "clamp",
		});

		return (
			<TouchableOpacity
				onPress={() => {
					deleteRequest(item);
				}}
				activeOpacity={0.5}
			>
				<View
					style={{
						backgroundColor: "#FBC9D0",
						width: 20 * vw,
						height: "100%",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Animated.Text
						style={{
							transform: [{ scale: scale }],
						}}
					>
						<Ionicons
							name="close-circle-outline"
							color="white"
							size={15 * vw}
						/>
					</Animated.Text>
				</View>
			</TouchableOpacity>
		);
	};
	return (
		<Swipeable
			renderLeftActions={rightSwap}
			containerStyle={{ marginVertical: 1 * vh }}
		>
			<View
				style={{
					padding: "5%",
					// height: 65 * vh,
					borderWidth: 2,
					borderColor: getBorderColor(item.decisionStatus),
					// marginVertical: 2 * vh,
					flexDirection: "column",
				}}
			>
				<View
					style={{
						flexDirection: "row",
						width: "100%",
						flex: 1,
						flexWrap: "wrap",
					}}
				>
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
				<View
					style={{
						flexDirection: "row",
						width: "100%",
						flex: 1,
						flexWrap: "wrap",
					}}
				>
					<Text style={{ fontWeight: "bold", fontFamily: "" }}>Reason: </Text>
					<Text>{item?.reason || ""}</Text>
				</View>
				<View style={{ flexDirection: "row", width: "100%", flex: 1 }}>
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
					<View style={{ flexDirection: "row" }}>
						<Text style={{ fontWeight: "bold", fontFamily: "" }}>
							Rejection reason:{" "}
						</Text>
						<Text>{item?.rejectionReason || ""}</Text>
					</View>
				)}
			</View>
		</Swipeable>
	);
};

const UserHistory = ({ userID }) => {
	const [requestHistoryList, setRequestHistoryList] = useState([]);

	useEffect(() => {
		getRequestHistoryList();
	}, []);

	const getRequestHistoryList = async () => {
		try {
			const result = await axios.post(`user/request-history/${userID}`);
			if (result.status !== 200) {
				throw new Error(result);
			}
			setRequestHistoryList([...result.data]);
		} catch (err) {
			ToastAndroid.show(
				err?.response?.data?.error || err?.message || "Error",
				ToastAndroid.SHORT
			);
		}
	};

	const deleteRequest = async (request) => {
		try {
			const result = await axios.delete(`user/delete-request/${request.id}`);
			if (result.status !== 200) {
				throw new Error(result);
			}
			setRequestHistoryList(
				requestHistoryList.filter((item) => item.id !== request.id)
			);
		} catch (err) {
			ToastAndroid.show(
				err?.response?.data?.error || err?.message || "Error",
				ToastAndroid.SHORT
			);
		}
	};

	return (
		<View style={{ height: 65 * vh }}>
			<FlatList
				data={requestHistoryList}
				keyExtractor={(item) => `Request-History-${item.id}`}
				showsVerticalScrollIndicator={false}
				renderItem={({ item }) => (
					<SwipeableView item={item} deleteRequest={deleteRequest} />
				)}
			/>
		</View>
	);
};

export default UserHistory;
