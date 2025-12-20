import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, ActivityIndicator, Alert, FlatList } from 'react-native';
import { authService } from '../api/authService';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ route, navigation }: any) => {
    const { token } = route.params || {};
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const scrollTimer = useRef<any>(null);

    useEffect(() => {
        fetchDashboard();
    }, [token]);

    const fetchDashboard = async () => {
        if (!token) return;
        try {
            const response = await authService.getDashboardData(token);
            if (response.status) {
                setData(response);
                navigation.setParams({ user: response.user });
            } else {
                Alert.alert('Error', response.msg || 'Failed to fetch dashboard');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (data?.dashboard?.carousel?.length > 0) {
            startAutoScroll();
        }
        return () => stopAutoScroll();
    }, [data, activeIndex]);

    const startAutoScroll = () => {
        stopAutoScroll();
        scrollTimer.current = setInterval(() => {
            const nextIndex = (activeIndex + 1) % data.dashboard.carousel.length;
            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            });
            setActiveIndex(nextIndex);
        }, 3000);
    };

    const stopAutoScroll = () => {
        if (scrollTimer.current) {
            clearInterval(scrollTimer.current);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#A9D823" />
            </View>
        );
    }

    const dynamicColor = data?.dashboard?.color?.dynamic_color || '#A9D823';

    return (
        <ScrollView style={styles.container}>
            {/* Carousel */}
            <View style={styles.carouselContainer}>
                <FlatList
                    ref={flatListRef}
                    data={data?.dashboard?.carousel}
                    keyExtractor={(_, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(e) => {
                        const index = Math.round(e.nativeEvent.contentOffset.x / width);
                        setActiveIndex(index);
                    }}
                    renderItem={({ item }) => (
                        <Image source={{ uri: item }} style={styles.bannerImage} resizeMode="cover" />
                    )}
                />
                {/* Pagination Dots */}
                <View style={styles.pagination}>
                    {data?.dashboard?.carousel?.map((_: any, index: number) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                { backgroundColor: index === activeIndex ? dynamicColor : 'rgba(255,255,255,0.5)' }
                            ]}
                        />
                    ))}
                </View>
            </View>

            {/* Student Details */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Student Details</Text>
                <View style={styles.cardContainer}>
                    <View style={[styles.card, { borderLeftColor: dynamicColor }]}>
                        <Text style={styles.cardLabel}>Boys</Text>
                        <Text style={styles.cardValue}>{data?.dashboard?.student?.Boy}</Text>
                    </View>
                    <View style={[styles.card, { borderLeftColor: dynamicColor }]}>
                        <Text style={styles.cardLabel}>Girls</Text>
                        <Text style={styles.cardValue}>{data?.dashboard?.student?.Girl}</Text>
                    </View>
                    <View style={[styles.card, { borderLeftColor: dynamicColor }]}>
                        <Text style={styles.cardLabel}>Total</Text>
                        <Text style={styles.cardValue}>{(data?.dashboard?.student?.Boy || 0) + (data?.dashboard?.student?.Girl || 0)}</Text>
                    </View>
                </View>
            </View>

            {/* Payment Details */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Payment Details</Text>
                <View style={styles.cardContainer}>
                    <View style={[styles.card, { borderLeftColor: dynamicColor }]}>
                        <Text style={styles.cardLabel}>Total</Text>
                        <Text style={styles.cardValue}>₹{data?.dashboard?.amount?.Total}</Text>
                    </View>
                    <View style={[styles.card, { borderLeftColor: dynamicColor }]}>
                        <Text style={styles.cardLabel}>Paid</Text>
                        <Text style={styles.cardValue}>₹{data?.dashboard?.amount?.Paid}</Text>
                    </View>
                    <View style={[styles.card, { borderLeftColor: dynamicColor }]}>
                        <Text style={styles.cardLabel}>Due</Text>
                        <Text style={styles.cardValue}>₹{data?.dashboard?.amount?.due}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    carouselContainer: {
        height: 200,
        position: 'relative',
    },
    bannerImage: {
        width: width,
        height: 200,
    },
    pagination: {
        position: 'absolute',
        bottom: 10,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    section: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '31%',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        borderLeftWidth: 4,
    },
    cardLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
    },
    cardValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default DashboardScreen;
