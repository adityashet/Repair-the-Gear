import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Tracking'>;

const { width, height } = Dimensions.get('window');

// Mock locations for demo purposes
const USER_LOC = { latitude: 37.78825, longitude: -122.4324 };
const MECHANIC_START_LOC = { latitude: 37.795, longitude: -122.42 };

export default function TrackingScreen({ route, navigation }: Props) {
  const { mechanicName, eta, distance } = route.params;
  const [mechanicLoc, setMechanicLoc] = useState(MECHANIC_START_LOC);

  useEffect(() => {
    // Simulate mechanic moving towards user
    const interval = setInterval(() => {
      setMechanicLoc(prev => {
        const latDiff = USER_LOC.latitude - prev.latitude;
        const lngDiff = USER_LOC.longitude - prev.longitude;
        return {
          latitude: prev.latitude + latDiff * 0.1, // Move 10% closer each tick
          longitude: prev.longitude + lngDiff * 0.1,
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleComplete = () => {
    // In a real app, this would happen when mechanic arrives and finishes job
    alert('Service Completed!');
    navigation.popToTop(); // Go back to Home
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={{
          latitude: (USER_LOC.latitude + MECHANIC_START_LOC.latitude) / 2,
          longitude: (USER_LOC.longitude + MECHANIC_START_LOC.longitude) / 2,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={USER_LOC} title="You">
          <View style={styles.userMarker} />
        </Marker>
        
        <Marker coordinate={mechanicLoc} title={mechanicName}>
          <View style={styles.mechanicMarker}>
            <Ionicons name="car" size={16} color={theme.colors.white} />
          </View>
        </Marker>

        <Polyline
          coordinates={[mechanicLoc, USER_LOC]}
          strokeColor={theme.colors.secondary}
          strokeWidth={4}
        />
      </MapView>

      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Text style={styles.title}>Mechanic is on the way</Text>
          <Text style={styles.etaText}>Arriving in {eta}</Text>
        </View>

        <View style={styles.profileRow}>
          <View style={styles.avatar}>
             <Ionicons name="person" size={24} color={theme.colors.white} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{mechanicName}</Text>
            <Text style={styles.distance}>{distance} away</Text>
          </View>
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call" size={20} color={theme.colors.white} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
          <Text style={styles.completeButtonText}>Simulate Completion</Text>
        </TouchableOpacity>
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
    width,
    height: height * 0.7, // Map takes 70% of screen
  },
  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.secondary,
    borderWidth: 3,
    borderColor: theme.colors.white,
  },
  mechanicMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  infoCard: {
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
  infoHeader: {
    marginBottom: theme.spacing.m,
  },
  title: {
    ...theme.typography.header,
  },
  etaText: {
    ...theme.typography.body,
    color: theme.colors.secondary,
    fontWeight: '600',
    marginTop: 4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingBottom: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    ...theme.typography.body,
    fontWeight: '600',
  },
  distance: {
    ...theme.typography.bodySecondary,
    marginTop: 2,
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButtonText: {
    ...theme.typography.button,
  },
});
