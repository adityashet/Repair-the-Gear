import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Linking } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { theme, darkColors } from '../constants/theme';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme, useThemeStyles } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Help'>;

export default function HelpScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const styles = useThemeStyles(createStyles);
  const insets = useSafeAreaInsets();

  const handleCall = () => {
    Linking.openURL('tel:6362175792').catch(err => 
      console.warn('Could not open phone dialer', err)
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Ionicons name="headset" size={80} color={colors.primary} style={styles.headsetIcon} />
        
        <Text style={styles.titleText}>We're here to help</Text>
        <Text style={styles.subText}>
          If you are facing any issues or need immediate assistance, please reach out to our 24/7 customer support.
        </Text>

        {/* Customer Care Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Customer Care</Text>
          <TouchableOpacity onPress={handleCall}>
            <Text style={styles.phoneNumber}>6362175792</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.callButton, { marginBottom: Math.max(insets.bottom, 0) }]} 
            onPress={handleCall}
          >
            <Ionicons name="call" size={20} color="#0B1120" style={{ marginRight: 8 }} />
            <Text style={styles.callButtonText}>Call Now</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 36,
  },
  headsetIcon: {
    marginBottom: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1,
    marginBottom: 20,
    textAlign: 'center',
  },
  callButton: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B1120',
  },
});
