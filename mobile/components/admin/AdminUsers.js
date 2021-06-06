import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Modal, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';

import globalStyles from '../../styles/globalStyles';
import axios from '../../utils/axios';
import { BASEURL, COLORS } from '../../utils/constant';
import { vh, vw } from '../../utils/viewport';
import AdminAddUserModal from './Modals/AdminAddUserModal';
import AdminEditUserModal from './Modals/AdminEditUserModal';

const AdminUsers = ({ navigation }) => {
	const [userList, setUserList] = useState([]);
	const [activeUserList, setActiveUserList] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [showAddUserModal, setShowAddUserModal] = useState(false);
	const [showUserEditModal, setShowUserEditModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState({});

	useEffect(() => {
		GetUserList();
	}, []);

	useEffect(() => {
		if (searchTerm.length > 0) {
			setActiveUserList(
				userList.filter((user) => {
					if (user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) {
						return user;
					}
				})
			);
		}
	}, [searchTerm]);

	const GetUserList = async () => {
		try {
			const result = await axios.post(`admin/list-user`);
			if (result.status !== 200) {
				throw new Error(result);
			}
			setUserList([...result.data]);
			setActiveUserList([...result.data]);
		} catch (err) {
			console.log(err.response);
			ToastAndroid.show(
				err?.response?.data?.error || err.message,
				ToastAndroid.SHORT
			);
		}
	};

	const updateAfterUserAddition = (newUser) => {
		setSearchTerm("");
		setUserList([...userList, newUser]);
		setActiveUserList([...userList, newUser]);
	};

	const updateAfterUserEdit = (updatedUser) => {
		setSearchTerm("");
		const newList = userList.map((user) =>
			user.id === updatedUser.id ? updatedUser : user
		);
		setUserList(newList);
		setActiveUserList(newList);
	};

	return (
		<View style={globalStyles.modalContainer}>
			<Modal
				animationType="slide"
				visible={showAddUserModal}
				onRequestClose={() => {
					setShowAddUserModal(!showAddUserModal);
				}}
			>
				<AdminAddUserModal
					setShowAddUserModal={setShowAddUserModal}
					updateAfterUserAddition={updateAfterUserAddition}
				/>
			</Modal>
			<Modal
				animationType="slide"
				visible={showUserEditModal}
				onRequestClose={() => {
					setShowUserEditModal(!showUserEditModal);
				}}
			>
				<AdminEditUserModal
					setShowModal={setShowUserEditModal}
					profileDetails={selectedUser}
					updateAfterUserEdit={updateAfterUserEdit}
				/>
			</Modal>
			<Text style={globalStyles.adminTitleText}>Company Users</Text>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					alignSelf: "center",
				}}
			>
				<TextInput
					value={searchTerm}
					onChangeText={setSearchTerm}
					style={globalStyles.textInput}
					placeholder="Enter name to type"
				/>
				<TouchableOpacity
					activeOpacity={0.75}
					onPress={() => setSearchTerm("")}
					style={{
						backgroundColor: COLORS.primary,
						height: 5 * vh,
						justifyContent: "center",
						width: 5 * vh,
						alignItems: "center",
					}}
				>
					<Ionicons name="close" size={7 * vw} color="white" />
				</TouchableOpacity>
			</View>

			<TouchableOpacity
				style={{
					width: "100%",
					borderColor: COLORS.primary,
					borderWidth: 2,
					padding: "3%",
					alignItems: "center",
					marginVertical: 1 * vh,
				}}
				onPress={() => setShowAddUserModal(true)}
			>
				<Text style={globalStyles.primaryColorText}>Add New User</Text>
			</TouchableOpacity>

			<View style={{ marginBottom: 32 * vh }}>
				<FlatList
					data={activeUserList}
					keyExtractor={(item) => item.id}
					initialNumToRender={1}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={{
								marginBottom: 20,
								flexDirection: "row",
								alignItems: "center",
								padding: "2%",
								borderWidth: 2,
								borderColor: COLORS.primary,
							}}
							onPress={() => {
								setSelectedUser(item);
								setShowUserEditModal(true);
							}}
						>
							{item.profilePicture ? (
								<Image
									source={{
										uri: `${BASEURL}${item?.profilePicture?.replace(
											"\\",
											"/"
										)}`,
									}}
									style={{ height: 10 * vh, width: 10 * vh, borderRadius: 200 }}
								/>
							) : (
								<Ionicons
									name="person-circle-outline"
									color={COLORS.primary}
									size={10 * vh}
								/>
							)}
							<View style={{ paddingLeft: "5%" }}>
								<Text style={{ fontFamily: "", fontWeight: "bold" }}>
									Name:{" "}
									<Text style={{ fontWeight: "normal" }}>{item.fullName}</Text>
								</Text>
								<Text style={{ fontFamily: "", fontWeight: "bold" }}>
									Email:{" "}
									<Text style={{ fontWeight: "normal" }}>{item.email}</Text>
								</Text>
								<Text
									style={{
										color: COLORS.primary,
										fontFamily: "",
										fontWeight: "bold",
									}}
								>
									Total Holidays: {item.totalHolidays}
								</Text>
								<Text
									style={{
										color: COLORS.red,
										fontFamily: "",
										fontWeight: "bold",
									}}
								>
									Completed Holidays: {item.completedHolidays}
								</Text>

								<Text style={{ fontFamily: "", fontWeight: "bold" }}>
									Join Date:{" "}
									<Text style={{ fontWeight: "normal" }}>
										{item.createdAt.slice(0, 10)}
									</Text>
								</Text>
							</View>
						</TouchableOpacity>
					)}
				/>
			</View>
		</View>
	);
};

export default AdminUsers;
