import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SvgXml } from 'react-native-svg';
import axios from 'axios';
import { OtpInput } from 'react-native-otp-entry';
import { authService } from '../api/authService';
import { storage } from '../utils/storage';

const VerifyOtpScreen = ({ route, navigation }: any) => {
    const { userid } = route.params;
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [svgXml, setSvgXml] = useState<string | null>(null);

    useEffect(() => {
        const fetchSvg = async () => {
            try {
                const response = await axios.get('https://accevate.in/images/Hero%20Banner/Logo.svg');
                setSvgXml(response.data);
            } catch (error) {
                console.error('Error fetching SVG:', error);
            }
        };
        fetchSvg();
    }, []);

    const handleVerify = async () => {
        if (otp.length !== 6) {
            Alert.alert('Error', 'Please enter 6 digit OTP');
            return;
        }
        setLoading(true);
        try {
            const response = await authService.verifyOtp(userid, otp);
            if (response.status) {
                Alert.alert('Success', response.msg);
                await storage.saveToken(response.token);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'DrawerRoot', params: { token: response.token } }],
                });
            } else {
                Alert.alert('Failure', response.msg || 'Verification failed');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                {svgXml ? (
                    <SvgXml xml={svgXml} width="100%" height="100" />
                ) : (
                    <ActivityIndicator color="#A9D823" />
                )}
            </View>
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>Enter the 6-digit code sent to your mobile</Text>

            <OtpInput
                numberOfDigits={6}
                focusColor="#A9D823"
                focusStickBlinkingDuration={500}
                onTextChange={(text) => setOtp(text)}
                theme={{
                    containerStyle: styles.otpContainer,
                    pinCodeContainerStyle: styles.pinCodeContainer,
                    pinCodeTextStyle: styles.pinCodeText,
                    focusStickStyle: styles.focusStick,
                    focusedPinCodeContainerStyle: styles.activePinCodeContainer,
                }}
            />

            <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify OTP</Text>}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    logoContainer: {
        width: '100%',
        height: 100,
        marginBottom: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    otpContainer: {
        marginBottom: 30,
    },
    pinCodeContainer: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        width: 45,
        height: 55,
    },
    activePinCodeContainer: {
        borderColor: '#A9D823',
    },
    pinCodeText: {
        fontSize: 20,
        color: '#333',
    },
    focusStick: {
        backgroundColor: '#A9D823',
    },
    button: {
        backgroundColor: '#A9D823',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default VerifyOtpScreen;
