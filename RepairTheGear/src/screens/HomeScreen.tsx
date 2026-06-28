import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackParamList, MainTabParamList } from '../navigation/AppNavigator';
import { theme, darkColors, lightMapStyles, darkMapStyles } from '../constants/theme';
import { useTheme, useThemeStyles } from '../context/ThemeContext';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'HomeTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function HomeScreen({ navigation }: Props) {
  const { colors, isLightTheme } = useTheme();
  const styles = useThemeStyles(createStyles);
  
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [address, setAddress] = useState<string>('Locating...');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const mapRef = useRef<MapView | null>(null);

  const centerMapOnCoordinates = (lat: number, lng: number) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setAddress('Permission Denied');
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(currentLocation);
        setSelectedLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        centerMapOnCoordinates(currentLocation.coords.latitude, currentLocation.coords.longitude);
      } catch (e) {
        // Fallback default coordinates (BTM Layout, Bangalore)
        const fallbackLat = 12.895690;
        const fallbackLng = 77.635640;
        setSelectedLocation({ latitude: fallbackLat, longitude: fallbackLng });
        centerMapOnCoordinates(fallbackLat, fallbackLng);
      }
    })();
  }, []);

  const handleRegionChange = () => {
    setIsDragging(true);
    setAddress('Locating...');
  };

  const handleRegionChangeComplete = async (region: any) => {
    setIsDragging(false);
    const centerCoords = {
      latitude: region.latitude,
      longitude: region.longitude,
    };
    setSelectedLocation(centerCoords);

    // Reverse geocode the center coordinates
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync(centerCoords);
      if (reverseGeocode.length > 0) {
        const place = reverseGeocode[0];
        const parts = [];
        if (place.street || place.name) parts.push(place.street || place.name);
        if (place.district || place.subregion) parts.push(place.district || place.subregion);
        if (place.city) parts.push(place.city);
        
        setAddress(parts.slice(0, 3).join(', ') || 'Unknown Location');
      } else {
        setAddress('Unknown Location');
      }
    } catch (e) {
      setAddress('Could not fetch address');
    }
  };

  const locateMe = async () => {
    try {
      setAddress('Locating...');
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAddress('Permission denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentLocation);
      setSelectedLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      centerMapOnCoordinates(currentLocation.coords.latitude, currentLocation.coords.longitude);
    } catch (e) {
      setAddress('Could not fetch location');
    }
  };

  const handleFindMechanic = () => {
    if (selectedLocation) {
      navigation.navigate('SearchMechanic', {
        userLocation: {
          ...selectedLocation,
          address: address,
        },
      });
    } else {
      navigation.navigate('SearchMechanic');
    }
  };

  const handleTowVehicle = () => {
    if (selectedLocation) {
      navigation.navigate('TowService', {
        userLocation: {
          ...selectedLocation,
          address: address,
        },
      });
    } else {
      navigation.navigate('TowService');
    }
  };

  const initialRegion = {
    latitude: 12.895690,
    longitude: 77.635640,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      {/* Map Container with Overlays */}
      <View style={styles.mapContainer}>
        <MapView 
          ref={mapRef}
          style={styles.map} 
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={false}
          onRegionChange={handleRegionChange}
          onRegionChangeComplete={handleRegionChangeComplete}
          customMapStyle={isLightTheme ? lightMapStyles : darkMapStyles}
        />

        {/* Floating Locate Me Button */}
        <TouchableOpacity style={styles.locateMeButton} onPress={locateMe}>
          <Ionicons name="locate" size={24} color={colors.text} />
        </TouchableOpacity>

        {/* Central blue dot marker */}
        <View style={styles.centerPinContainer} pointerEvents="none">
          <View style={styles.blueDotContainer}>
            <View style={styles.blueDotPulse} />
            <View style={styles.blueDotOuter}>
              <View style={styles.blueDotInner} />
            </View>
          </View>
        </View>

        {/* Top Address Card */}
        <View style={styles.addressCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <View style={styles.addressHeader}>
              <Ionicons name="location" size={24} color={colors.primary} />
              <Text style={styles.addressTitle}>Current Location</Text>
            </View>
          </View>
          <Text style={styles.addressText} numberOfLines={1}>{address}</Text>
        </View>

        {/* Bottom Actions Card */}
        <View style={styles.bottomCard}>
          <Text style={styles.greeting}>Need Assistance?</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleFindMechanic}>
              <View style={[styles.iconContainer, { backgroundColor: isLightTheme ? '#E3F2FD' : '#1E293B' }]}>
                <Ionicons name="build" size={32} color={isLightTheme ? '#1976D2' : '#38BDF8'} />
              </View>
              <Text style={styles.actionText}>Find Mechanic</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleTowVehicle}>
              <View style={[styles.iconContainer, { backgroundColor: isLightTheme ? '#FFF3E0' : '#1E293B' }]}>
                <Ionicons name="car" size={32} color={isLightTheme ? '#F57C00' : '#F59E0B'} />
              </View>
              <Text style={styles.actionText}>Tow Vehicle</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: typeof darkColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapContainer: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  centerPinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20, // Center exactly (half of 40px width)
    marginTop: -20,  // Center exactly (half of 40px height)
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  blueDotContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  blueDotPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(56, 189, 248, 0.25)', // Soft blue pulse halo matching second pic
  },
  blueDotOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ffffff', // White border
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
  blueDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563EB', // Blue dot core
  },
  locateMeButton: {
    position: 'absolute',
    bottom: 220, // Float just above the bottom sheet
    right: theme.spacing.m,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 10,
  },
  addressCard: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: theme.spacing.m,
    right: theme.spacing.m,
    backgroundColor: colors.surface,
    padding: theme.spacing.m,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 15,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressTitle: {
    ...theme.typography.bodySecondary,
    color: colors.textSecondary,
    marginLeft: theme.spacing.xs,
    fontWeight: '600',
  },
  addressText: {
    ...theme.typography.body,
    color: colors.text,
    fontWeight: '500',
    marginTop: 6,
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: theme.spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 15,
  },
  greeting: {
    ...theme.typography.header,
    color: colors.text,
    marginBottom: theme.spacing.l,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.s,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  actionText: {
    ...theme.typography.body,
    color: colors.text,
    fontWeight: '600',
  },
});
