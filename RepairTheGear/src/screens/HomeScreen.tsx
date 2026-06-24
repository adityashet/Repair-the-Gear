import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }: Props) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string>('Locating...');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      // Reverse geocode
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        if (reverseGeocode.length > 0) {
          const place = reverseGeocode[0];
          setAddress(`${place.street || place.name}, ${place.city || place.subregion}`);
        } else {
          setAddress('Unknown Location');
        }
      } catch (e) {
        setAddress('Could not fetch address');
      }
    })();
  }, []);

  const handleFindMechanic = () => {
    navigation.navigate('SearchMechanic');
  };

  const handleTowVehicle = () => {
    navigation.navigate('TowService');
  };

  const initialRegion = location ? {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  } : {
    // Default fallback to a central location (e.g., center of a city)
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        region={initialRegion}
        showsUserLocation={true}
      >
        {location && (
          <Marker 
            coordinate={{ 
              latitude: location.coords.latitude, 
              longitude: location.coords.longitude 
            }} 
            title="You are here" 
          />
        )}
      </MapView>

      <View style={styles.addressCard}>
        <View style={styles.addressHeader}>
          <Ionicons name="location" size={24} color={theme.colors.primary} />
          <Text style={styles.addressTitle}>Current Location</Text>
        </View>
        <Text style={styles.addressText} numberOfLines={1}>{address}</Text>
      </View>

      <View style={styles.bottomCard}>
        <Text style={styles.greeting}>Need Assistance?</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} onPress={handleFindMechanic}>
            <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="build" size={32} color="#1976D2" />
            </View>
            <Text style={styles.actionText}>Find Mechanic</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleTowVehicle}>
            <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="car" size={32} color="#F57C00" />
            </View>
            <Text style={styles.actionText}>Tow Vehicle</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  map: {
    width: width,
    height: height,
    ...StyleSheet.absoluteFillObject,
  },
  addressCard: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: theme.spacing.m,
    right: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  addressTitle: {
    ...theme.typography.bodySecondary,
    marginLeft: theme.spacing.xs,
    fontWeight: '600',
  },
  addressText: {
    ...theme.typography.body,
    fontWeight: '500',
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: theme.spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  greeting: {
    ...theme.typography.header,
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
    fontWeight: '600',
  },
});
