import apiInstance from './apiInstance';

export const authService = {
    login: async (userid: string, password: string) => {
        const response = await apiInstance.post('login.php', {
            userid,
            password,
        });
        return response.data;
    },

    verifyOtp: async (userid: string, otp: string) => {
        const response = await apiInstance.post('verify_otp.php', {
            userid,
            otp,
        });
        return response.data;
    },

    getDashboardData: async (token: string) => {
        const response = await apiInstance.post('dashboard.php', {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },
};
