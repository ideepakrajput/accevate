import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';
const USER_DATA_KEY = '@user_data';

export const storage = {
    saveToken: async (token: string) => {
        try {
            await AsyncStorage.setItem(TOKEN_KEY, token);
        } catch (e) {
            console.error('Error saving token', e);
        }
    },

    getToken: async () => {
        try {
            return await AsyncStorage.getItem(TOKEN_KEY);
        } catch (e) {
            console.error('Error getting token', e);
            return null;
        }
    },

    removeToken: async () => {
        try {
            await AsyncStorage.removeItem(TOKEN_KEY);
        } catch (e) {
            console.error('Error removing token', e);
        }
    },

    saveUserData: async (userData: any) => {
        try {
            await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
        } catch (e) {
            console.error('Error saving user data', e);
        }
    },

    getUserData: async () => {
        try {
            const data = await AsyncStorage.getItem(USER_DATA_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error getting user data', e);
            return null;
        }
    },

    clearAll: async () => {
        try {
            await AsyncStorage.multiRemove([TOKEN_KEY, USER_DATA_KEY]);
        } catch (e) {
            console.error('Error clearing storage', e);
        }
    },
};
