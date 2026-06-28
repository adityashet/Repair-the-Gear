import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions, Animated } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { theme, darkColors, lightMapStyles, darkMapStyles } from '../constants/theme';
import { useTheme, useThemeStyles } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'TowService'>;

const { width, height } = Dimensions.get('window');

const DEFAULT_USER_LOC = { latitude: 12.895690, longitude: 77.635640 };

export default function TowServiceScreen({ route, navigation }: Props) {
  const { colors, isLightTheme } = useTheme();
  const styles = useThemeStyles(createStyles);
  const insets = useSafeAreaInsets();
  const userLocation = route.params?.userLocation;
  const userLatLng = userLocation 
    ? { latitude: userLocation.latitude, longitude: userLocation.longitude } 
    : DEFAULT_USER_LOC;

  const mapRef = useRef<MapView | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation for the ring
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Map centering
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        ...userLatLng,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      }, 1000);
    }

    // Auto-transition to tracking after 3.5 seconds
    const timer = setTimeout(() => {
      navigation.replace('Tracking', {
        mechanicName: 'City Towing Services',
        eta: '15 mins',
        distance: '5.4 km',
        userLocation: userLocation,
      });
    }, 3500);

    return () => clearTimeout(timer);
  }, [userLatLng]);

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Background Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={{
          ...userLatLng,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
        customMapStyle={isLightTheme ? lightMapStyles : darkMapStyles}
      />

      {/* Translucent overlay dark background */}
      <View style={styles.overlay} pointerEvents="none" />

      {/* Bottom overlay card */}
      <View style={[styles.searchCard, { paddingBottom: Math.max(insets.bottom, theme.spacing.l) }]}>
        {/* Pulsing Wrench Ring */}
        <Animated.View style={[
          styles.pulseRing,
          { transform: [{ scale: pulseAnim }] }
        ]}>
          <View style={styles.innerRing}>
            <Ionicons name="car" size={32} color="#F57C00" />
          </View>
        </Animated.View>

        <Text style={styles.searchingText}>Locating nearest tow truck...</Text>
        <Text style={styles.sharingText}>Sharing your location with providers</Text>

        {/* Location Badge */}
        <View style={styles.locationBadge}>
          <Ionicons name="location" size={18} color="#F57C00" />
          <Text style={styles.locationLabel} numberOfLines={1}>
            {userLocation?.address || 'BTM Layout, Bangalore'}
          </Text>
        </View>

        {/* Cancel Button */}
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: typeof darkColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)', // Sleek dark overlay
  },
  searchCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: theme.spacing.l,
    paddingBottom: Platform.OS === 'ios' ? 40 : theme.spacing.l,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  pulseRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 4,
    borderColor: '#F57C00',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  innerRing: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchingText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  sharingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: theme.spacing.l,
    width: '100%',
  },
  locationLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  cancelButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#ef4444',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
});
