import React, { useEffect, useState } from 'react';
import { FlatList, Text, ToastAndroid, View } from 'react-native';

import axios from '../../utils/axios';
import { COLORS } from '../../utils/constant';
import { vh, vw } from '../../utils/viewport';

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
			console.log(err.message);
			ToastAndroid.show(
				err?.response?.data?.error || err?.message || "Error",
				ToastAndroid.SHORT
			);
		}
	};

	const getBorderColor = (decisionStatus) => {
		switch (decisionStatus) {
			case "REJECTED": {
				return COLORS.red;
			}
			case "ACCEPTED": {
				return COLORS.primary;
			}
			default: {
				return COLORS.gray;
			}
		}
	};

	return (
		<View style={{ height: 65 * vh }}>
			<FlatList
				data={requestHistoryList}
				keyExtractor={(item) => `Request-History-${item.id}`}
				showsVerticalScrollIndicator={false}
				renderItem={({ item }) => (
					<View
						style={{
							padding: "5%",
							// height: 65 * vh,
							borderWidth: 2,
							borderColor: getBorderColor(item.decisionStatus),
							marginVertical: 2 * vh,
							flexDirection: "column",
						}}
					>
						<View style={{ flexDirection: "row" }}>
							<Text
								style={{ fontWeight: "bold", fontFamily: "", fontSize: 3 * vw }}
							>
								Date:{" "}
							</Text>
							<Text>
								{item.fromDate.slice(0, 10)} - {item.toDate.slice(0, 10)}
							</Text>
						</View>
						<View style={{ flexDirection: "row" }}>
							<Text style={{ fontWeight: "bold", fontFamily: "" }}>
								Reason:{" "}
							</Text>
							<Text>{item?.reason || ""}</Text>
						</View>
						<View style={{ flexDirection: "row" }}>
							<Text
								style={{ fontWeight: "bold", fontFamily: "", fontSize: 4 * vw }}
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
				)}
			/>
		</View>
	);
};

export default UserHistory;
