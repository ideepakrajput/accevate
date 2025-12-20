import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import VerifyOtpScreen from '../screens/VerifyOtpScreen';
import DashboardScreen from '../screens/DashboardScreen';
import { storage } from '../utils/storage';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: any) => {
    const user = props.state.routes.find((r: any) => r.name === 'Dashboard')?.params?.user || { name: 'Deepak', mobile: '8789913840' };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    onPress: async () => {
                        await storage.clearAll();
                        props.navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    }
                },
            ]
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
                <View style={styles.drawerHeader}>
                    <View style={styles.profileCircle}>
                        <Text style={styles.profileInitial}>{user.name.charAt(0).toUpperCase()}</Text>
                    </View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userMobile}>{user.mobile}</Text>
                </View>
                <View style={styles.divider} />
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const DrawerNavigator = ({ route }: any) => {
    const { token, user } = route.params || {};
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerStyle: { backgroundColor: '#A9D823' },
                headerTitleStyle: { color: '#fff' },
                headerTintColor: '#fff',
                drawerActiveTintColor: '#A9D823',
                drawerLabelStyle: { fontSize: 16, fontWeight: '600' },
            }}
        >
            <Drawer.Screen
                name="Dashboard"
                component={DashboardScreen}
                initialParams={{ token, user }}
            />
        </Drawer.Navigator>
    );
};

const AppNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
            <Stack.Screen name="DrawerRoot" component={DrawerNavigator} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    drawerContainer: {
        paddingTop: 0,
    },
    drawerHeader: {
        paddingVertical: 30,
        backgroundColor: '#A9D823',
        alignItems: 'center',
    },
    profileCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    profileInitial: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
    userName: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    userMobile: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 10,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        marginBottom: 20,
    },
    logoutText: {
        marginLeft: 15,
        fontSize: 16,
        fontWeight: '600',
        color: '#FF3B30',
    },
});

export default AppNavigator;
