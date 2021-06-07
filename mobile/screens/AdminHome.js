import { AntDesign, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StatusBar } from 'react-native';

import AdminDashboard from '../components/admin/AdminDashboard';
import AdminRequests from '../components/admin/AdminRequest';
import AdminSupportTicket from '../components/admin/AdminSupportTicket';
import AdminUsers from '../components/admin/AdminUsers';
import { COLORS } from '../utils/constant';
import { vw } from '../utils/viewport';

const Tab = createBottomTabNavigator();

const AdminTabNavigator = () => {
	return (
		<>
			<StatusBar />

			<Tab.Navigator
				tabBarOptions={{
					activeTintColor: COLORS.primary,
					inactiveTintColor: COLORS.gray,
					style: { height: "7%", paddingBottom: "1%" },
				}}
				screenOptions={({ route }) => ({
					tabBarIcon: ({ focused, color, size }) => {
						size = 7 * vw;
						if (route.name === "Dashboard") {
							return (
								<Ionicons
									name={focused ? "home" : "home-outline"}
									size={size}
									color={color}
								/>
							);
						} else if (route.name === "Users") {
							return (
								<Ionicons
									name={focused ? "people-circle" : "people-circle-outline"}
									size={size}
									color={color}
								/>
							);
						} else if (route.name === "Requests") {
							return (
								<FontAwesome5 name="clipboard-list" color={color} size={size} />
							);
						} else if (route.name === "Tickets") {
							return (
								<AntDesign name="customerservice" color={color} size={size} />
							);
						}
					},
				})}
				initialRouteName="Dashboard"
				lazy={true}
			>
				<Tab.Screen name="Dashboard" component={AdminDashboard} />
				<Tab.Screen name="Users" component={AdminUsers} />
				<Tab.Screen name="Requests" component={AdminRequests} />
				<Tab.Screen name="Tickets" component={AdminSupportTicket} />
			</Tab.Navigator>
		</>
	);
};

export default AdminTabNavigator;
