import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { theme, darkColors } from '../constants/theme';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme, useThemeStyles } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'About'>;

export default function AboutScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const styles = useThemeStyles(createStyles);

  const features = [
    'Real-time mechanic discovery using GPS',
    'Emergency roadside assistance requests',
    'Nearby towing service support',
    'Secure and easy-to-use platform',
    'Fast response and reduced waiting times',
    'Service tracking and request management',
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Logo and App Title */}
        <View style={styles.logoSection}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Repair The Gear</Text>
        </View>

        {/* Paragraphs */}
        <Text style={styles.paragraph}>
          Repair The Gear is a smart roadside assistance platform designed to connect vehicle owners with nearby mechanics and towing services during emergencies.
        </Text>

        <Text style={styles.paragraph}>
          Whether you're dealing with a flat tire, battery failure, engine trouble, or an unexpected breakdown, our app helps you quickly locate and contact verified mechanics in your area. Using real-time GPS technology, Repair The Gear matches users with the nearest available service providers, reducing wait times and getting drivers back on the road faster.
        </Text>

        <Text style={styles.paragraph}>
          Our mission is to make roadside assistance simple, reliable, and accessible for everyone. By combining location-based services, instant request management, and a user-friendly interface, Repair The Gear provides a seamless experience for both vehicle owners and mechanics.
        </Text>

        {/* Key Features */}
        <Text style={styles.sectionTitle}>Key Features</Text>
        <View style={styles.featuresList}>
          {features.map((feature, idx) => (
            <View key={idx} style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} style={styles.featureIcon} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Bottom Quote */}
        <Text style={styles.quoteText}>
          "Repair The Gear is built to ensure that help is always just a few taps away."
        </Text>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: typeof darkColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  featuresList: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  featureIcon: {
    marginRight: 12,
    marginTop: 1,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  quoteText: {
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'italic',
    color: colors.text,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 20,
  },
});
