import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { theme, darkColors } from '../constants/theme';
import { useTheme, useThemeStyles } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

export default function PaymentScreen({ route, navigation }: Props) {
  const { mechanicName, amount, isTow } = route.params;
  const { colors } = useTheme();
  const styles = useThemeStyles(createStyles);
  const insets = useSafeAreaInsets();

  const handlePay = () => {
    navigation.replace('Rating', {
      mechanicName: mechanicName,
      isTow: isTow,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment & Feedback</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Payment Card (Screenshot #2 style) */}
        <View style={styles.paymentCard}>
          <Text style={styles.nameText}>{mechanicName}</Text>
          <Text style={styles.statusText}>Job Completed Successfully</Text>

          <Text style={styles.amountText}>₹{amount}</Text>
          
          <Text style={styles.labelSubText}>Fixed service charge</Text>
        </View>
      </View>

      {/* Pay Button */}
      <TouchableOpacity 
        style={[
          styles.payButton, 
          { marginBottom: Math.max(insets.bottom, 16) }
        ]} 
        onPress={handlePay}
      >
        <Text style={styles.payButtonText}>Pay ₹{amount}</Text>
      </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.l,
  },
  paymentCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '600',
    marginBottom: 24,
  },
  amountText: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.primary,
  },
  labelSubText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 16,
    fontWeight: '500',
  },
  payButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 30,
    left: theme.spacing.l,
    right: theme.spacing.l,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
  },
});
