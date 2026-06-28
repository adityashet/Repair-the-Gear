import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity, Modal } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { theme, darkColors, lightMapStyles, darkMapStyles } from '../constants/theme';
import { useTheme, useThemeStyles } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Tracking'>;

const { width, height } = Dimensions.get('window');

const DEFAULT_USER_LOC = { latitude: 12.895690, longitude: 77.635640 };

export default function TrackingScreen({ route, navigation }: Props) {
  const { colors, isLightTheme } = useTheme();
  const styles = useThemeStyles(createStyles);
  const insets = useSafeAreaInsets();
  const { mechanicName, eta, distance, userLocation } = route.params;
  const isTow = mechanicName.toLowerCase().includes('tow');
  const amount = isTow ? 700 : 500;

  const [modalVisible, setModalVisible] = useState(false);

  const userLatLng = userLocation
    ? { latitude: userLocation.latitude, longitude: userLocation.longitude }
    : DEFAULT_USER_LOC;

  // Provider starts ~1.5km away from the user's location
  const providerStartLoc = {
    latitude: userLatLng.latitude + 0.009,
    longitude: userLatLng.longitude - 0.009,
  };

  const [mechanicLoc, setMechanicLoc] = useState(providerStartLoc);

  useEffect(() => {
    // Simulate mechanic moving towards user
    const interval = setInterval(() => {
      setMechanicLoc(prev => {
        const latDiff = userLatLng.latitude - prev.latitude;
        const lngDiff = userLatLng.longitude - prev.longitude;
        return {
          latitude: prev.latitude + latDiff * 0.1, // Move 10% closer each tick
          longitude: prev.longitude + lngDiff * 0.1,
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [userLatLng]);

  const handleCancelBooking = () => {
    setModalVisible(false);
    navigation.popToTop(); // Back to Home
  };

  const handleComplete = () => {
    setModalVisible(false);
    navigation.replace('Payment', {
      mechanicName: mechanicName,
      amount: amount,
      isTow: isTow,
    });
  };

  return (
    <View style={styles.container}>
      {/* Google Map */}
      <MapView
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={{
          latitude: (userLatLng.latitude + providerStartLoc.latitude) / 2,
          longitude: (userLatLng.longitude + providerStartLoc.longitude) / 2,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        }}
        customMapStyle={isLightTheme ? lightMapStyles : darkMapStyles}
      >
        <Marker coordinate={userLatLng} title="You">
          <View style={styles.userMarker} />
        </Marker>
        
        <Marker coordinate={mechanicLoc} title={mechanicName}>
          <View style={styles.mechanicMarker}>
            <Ionicons name="car" size={16} color={colors.white} />
          </View>
        </Marker>

        <Polyline
          coordinates={[mechanicLoc, userLatLng]}
          strokeColor={colors.secondary}
          strokeWidth={4}
        />
      </MapView>

      {/* Header Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      {/* Premium Dark Tracking Bottom Sheet */}
      <View style={[styles.infoCard, { paddingBottom: Math.max(insets.bottom, theme.spacing.l) }]}>
        {/* Title and ETA block */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.cardTitle}>Provider is on the way</Text>
            <Text style={styles.distText}>{distance} away</Text>
          </View>
          <View style={styles.etaContainer}>
            <Text style={styles.etaLabel}>ETA</Text>
            <Text style={styles.etaValue}>{eta}</Text>
          </View>
        </View>

        {/* PIN Code block */}
        <View style={styles.pinRow}>
          <Text style={styles.pinLabel}>Start service with PIN</Text>
          <View style={styles.pinDigits}>
            {['7', '6', '4', '9'].map((digit, idx) => (
              <View key={idx} style={styles.pinBox}>
                <Text style={styles.pinText}>{digit}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Profile Row */}
        <View style={styles.profileRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{mechanicName}</Text>
          </View>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
               <Ionicons name={isTow ? "business" : "person"} size={22} color={colors.white} />
            </View>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>4.8</Text>
              <Ionicons name="star" size={12} color={colors.primary} style={{ marginLeft: 2 }} />
            </View>
          </View>
        </View>

        {/* Call and Message provider */}
        <View style={styles.communicationRow}>
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call" size={20} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageContainer}>
            <Ionicons name="chatbubble-ellipses" size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <Text style={styles.messagePlaceholder}>Message provider</Text>
          </TouchableOpacity>
        </View>

        {/* Service location details */}
        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>Service location</Text>
          <View style={styles.locationRow}>
            <Text style={styles.addressText} numberOfLines={1}>
              {userLocation?.address || '4th Main Road, Kodi Chikkanahalli, Bengaluru'}
            </Text>
            <TouchableOpacity style={styles.detailsButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.detailsButtonText}>Trip Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Simulation Complete Button */}
        <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
          <Text style={styles.completeButtonText}>Simulate Completion</Text>
        </TouchableOpacity>
      </View>

      {/* Trip Details Modal (styled exactly like the first user screenshot) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, theme.spacing.l) }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <View style={[styles.modalIconContainer, { backgroundColor: isTow ? '#F57C00' : colors.primary }]}>
                  <Ionicons name={isTow ? "business" : "person"} size={18} color={colors.background} />
                </View>
                <Text style={styles.modalTitle}>{isTow ? 'Tow Service' : 'Mechanic Service'}</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Location Details */}
            <View style={styles.modalSection}>
              <Text style={styles.sectionHeader}>Location Details</Text>
              <View style={styles.modalAddressRow}>
                <View style={styles.greenCircle} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalAddressText}>
                    {userLocation?.address || '4th Main Road, Kodi Chikkanahalli, Bengaluru'}
                  </Text>
                  <Text style={styles.modalSubText}>Vehicle breakdown location</Text>
                </View>
              </View>
            </View>

            {/* Fare details */}
            <View style={styles.modalFareRow}>
              <Text style={styles.modalFareLabel}>Total Fare</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.modalFareValue}>₹{amount}</Text>
                <Ionicons name="chevron-down" size={16} color="#94A3B8" style={{ marginLeft: 6 }} />
              </View>
            </View>

            {/* Payment Mode */}
            <View style={styles.paymentModeRow}>
              <View style={styles.cashBadgeRow}>
                <View style={styles.cashBadge}>
                  <Text style={styles.cashBadgeText}>₹</Text>
                </View>
                <Text style={styles.cashLabel}>Paying via Cash</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>

            {/* Actions */}
            <TouchableOpacity style={styles.modalCancelButton} onPress={handleCancelBooking}>
              <Text style={styles.modalCancelText}>Cancel Booking</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalConfirmButton} onPress={handleComplete}>
              <Text style={styles.modalConfirmText}>Simulate Completion</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (colors: typeof darkColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  map: {
    width,
    height: height * 0.55,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: theme.spacing.m,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  userMarker: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.secondary,
    borderWidth: 3,
    borderColor: colors.white,
  },
  mechanicMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  infoCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: theme.spacing.l,
    paddingBottom: Platform.OS === 'ios' ? 40 : theme.spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  distText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  etaContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  etaLabel: {
    fontSize: 11,
    color: colors.secondary,
    fontWeight: '700',
  },
  etaValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  pinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: theme.spacing.m,
  },
  pinLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  pinDigits: {
    flexDirection: 'row',
    gap: 8,
  },
  pinBox: {
    width: 32,
    height: 32,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
  },
  communicationRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: theme.spacing.m,
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    flex: 1,
    height: 48,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  messagePlaceholder: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  locationContainer: {
    marginBottom: theme.spacing.l,
  },
  locationLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  addressText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
  },
  detailsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  detailsButtonText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
  },
  // Modal styling (Screenshot #1)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: theme.spacing.l,
    paddingBottom: Platform.OS === 'ios' ? 40 : theme.spacing.l,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  modalSection: {
    marginBottom: theme.spacing.l,
  },
  sectionHeader: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  modalAddressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  greenCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#10b981',
    marginTop: 4,
  },
  modalAddressText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 20,
  },
  modalSubText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  modalFareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: theme.spacing.l,
  },
  modalFareLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  modalFareValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  paymentModeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  cashBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cashBadge: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashBadgeText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '700',
  },
  cashLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  changeText: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '600',
  },
  modalCancelButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ef4444',
  },
  modalConfirmButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
  },
});
