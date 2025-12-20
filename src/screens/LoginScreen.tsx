import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SvgXml } from 'react-native-svg';
import axios from 'axios';
import { authService } from '../api/authService';

const LoginScreen = ({ navigation }: any) => {
    const [userid, setUserid] = useState('');
    const [password, setPassword] = useState('');
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

    const handleLogin = async () => {
        if (!userid || !password) {
            Alert.alert('Error', 'Please enter userid and password');
            return;
        }
        setLoading(true);
        try {
            const response = await authService.login(userid, password);
            if (response.status) {
                Alert.alert('Success', response.msg);
                navigation.navigate('VerifyOtp', { userid: response.userid.toString() });
            } else {
                Alert.alert('Failure', response.msg || 'Login failed');
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
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="User ID"
                value={userid}
                onChangeText={setUserid}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
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
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
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

export default LoginScreen;
