import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>; // Simplified for typing

export default function ProfileScreen({ navigation }: any) {
  const handleLogout = () => {
    // Navigate to splash or login
    navigation.replace('Login');
  };

  const renderOption = (icon: keyof typeof Ionicons.glyphMap, title: string) => (
    <TouchableOpacity style={styles.optionRow}>
      <View style={styles.optionIcon}>
        <Ionicons name={icon} size={24} color={theme.colors.text} />
      </View>
      <Text style={styles.optionTitle}>{title}</Text>
      <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
        </View>
        <Text style={styles.name}>Alex User</Text>
        <Text style={styles.phone}>+91 98765 43210</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        {renderOption('person-outline', 'Edit Profile')}
        {renderOption('car-outline', 'Saved Vehicles')}
        {renderOption('card-outline', 'Payment Methods')}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety</Text>
        {renderOption('shield-checkmark-outline', 'Emergency Contacts')}
        {renderOption('document-text-outline', 'Terms & Conditions')}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  avatarText: {
    ...theme.typography.title,
    color: theme.colors.white,
  },
  name: {
    ...theme.typography.title,
    marginBottom: 4,
  },
  phone: {
    ...theme.typography.bodySecondary,
  },
  section: {
    marginTop: theme.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.m,
  },
  sectionTitle: {
    ...theme.typography.bodySecondary,
    fontWeight: '600',
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.s,
    textTransform: 'uppercase',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
  },
  optionIcon: {
    marginRight: theme.spacing.m,
  },
  optionTitle: {
    ...theme.typography.body,
    flex: 1,
  },
  logoutButton: {
    margin: theme.spacing.l,
    padding: theme.spacing.m,
    alignItems: 'center',
  },
  logoutText: {
    ...theme.typography.button,
    color: theme.colors.error,
  },
});
