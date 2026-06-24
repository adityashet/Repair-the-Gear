import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SearchMechanic'>;

export default function SearchMechanicScreen({ navigation }: Props) {
  const [status, setStatus] = useState<'searching' | 'found'>('searching');

  useEffect(() => {
    // Simulate backend search delay
    const timer = setTimeout(() => {
      setStatus('found');
    }, 3000); // 3 seconds to find mechanic
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    navigation.replace('Tracking', {
      mechanicName: 'Rahul Kumar',
      eta: '8 minutes',
      distance: '3.2 km',
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  if (status === 'searching') {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.searchingText}>Searching nearby mechanics...</Text>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="checkmark-circle" size={64} color={theme.colors.success} />
        <Text style={styles.foundText}>Mechanic Found!</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={40} color={theme.colors.white} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.nameText}>Rahul Kumar</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>4.8 (120 reviews)</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="location" size={24} color={theme.colors.textSecondary} />
            <Text style={styles.statValue}>3.2 km</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="time" size={24} color={theme.colors.textSecondary} />
            <Text style={styles.statValue}>8 mins</Text>
            <Text style={styles.statLabel}>ETA</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.contactButton}>
          <Ionicons name="call" size={20} color={theme.colors.white} />
          <Text style={styles.contactButtonText}>Contact Mechanic</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleContinue}>
        <Text style={styles.confirmButtonText}>View Live Tracking</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
    justifyContent: 'center',
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchingText: {
    ...theme.typography.header,
    marginTop: theme.spacing.m,
  },
  cancelButton: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.m,
  },
  cancelButtonText: {
    ...theme.typography.button,
    color: theme.colors.error,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  foundText: {
    ...theme.typography.title,
    marginTop: theme.spacing.s,
    color: theme.colors.success,
  },
  profileCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: theme.spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: theme.spacing.xl,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  profileInfo: {
    flex: 1,
  },
  nameText: {
    ...theme.typography.header,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    ...theme.typography.bodySecondary,
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.m,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.l,
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
  statValue: {
    ...theme.typography.header,
    marginTop: 4,
  },
  statLabel: {
    ...theme.typography.bodySecondary,
  },
  contactButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactButtonText: {
    ...theme.typography.button,
    marginLeft: theme.spacing.s,
  },
  confirmButton: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.m,
    borderRadius: 8,
    alignItems: 'center',
    position: 'absolute',
    bottom: theme.spacing.xl,
    left: theme.spacing.m,
    right: theme.spacing.m,
  },
  confirmButtonText: {
    ...theme.typography.button,
  },
});
