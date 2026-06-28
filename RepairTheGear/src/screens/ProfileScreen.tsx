import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, darkColors } from '../constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme, useThemeStyles } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function ProfileScreen({ navigation }: any) {
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const { themeMode, setThemeMode, colors } = useTheme();

  const handleLogout = () => {
    navigation.replace('Login');
  };

  const styles = useThemeStyles(createStyles);
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}>
        {/* User Card */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.profileRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color="#94A3B8" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.nameText}>aditya</Text>
              <Text style={styles.phoneText}>1234567890</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#64748B" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.ratingRow}>
            <View style={styles.rowLeft}>
              <Ionicons name="star" size={20} color={theme.colors.primary} />
              <Text style={styles.rowText}>4.64 My Rating</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Options Settings Card */}
        <View style={styles.card}>
          {/* Theme Row */}
          <TouchableOpacity style={styles.optionRow} onPress={() => setThemeModalVisible(true)}>
            <View style={styles.rowLeft}>
              <Ionicons name="color-palette" size={22} color="#94A3B8" style={styles.iconMargin} />
              <Text style={styles.rowText}>Theme</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#64748B" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Help Row */}
          <TouchableOpacity style={styles.optionRow}>
            <View style={styles.rowLeft}>
              <Ionicons name="help-circle" size={22} color="#94A3B8" style={styles.iconMargin} />
              <Text style={styles.rowText}>Help</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#64748B" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Safety Row */}
          <TouchableOpacity style={styles.optionRow}>
            <View style={styles.rowLeft}>
              <Ionicons name="shield-checkmark" size={22} color="#94A3B8" style={styles.iconMargin} />
              <Text style={styles.rowText}>Safety</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#64748B" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* About Row */}
          <TouchableOpacity style={styles.optionRow}>
            <View style={styles.rowLeft}>
              <Ionicons name="information-circle" size={22} color="#94A3B8" style={styles.iconMargin} />
              <Text style={styles.rowText}>About</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#64748B" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Log Out Row */}
          <TouchableOpacity style={styles.optionRow} onPress={handleLogout}>
            <View style={styles.rowLeft}>
              <Ionicons name="log-out" size={22} color="#ef4444" style={styles.iconMargin} />
              <Text style={[styles.rowText, { color: '#ef4444' }]}>Log Out</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Theme Slide-up Modal Sheet (Screenshot #2 style) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={themeModalVisible}
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPressOut={() => setThemeModalVisible(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            {/* Modal Handle Bar */}
            <View style={styles.modalHandle} />

            <Text style={styles.modalTitle}>Theme</Text>
            <Text style={styles.modalSubTitle}>APPEARANCE</Text>

            {/* Theme Options Row */}
            <View style={styles.themeOptionsRow}>
              {/* Light Option */}
              <View style={styles.themeOptionColumn}>
                <TouchableOpacity 
                  style={[
                    styles.themeOptionCard, 
                    themeMode === 'light' && styles.themeOptionCardSelected
                  ]}
                  onPress={() => setThemeMode('light')}
                >
                  <View style={styles.mockupContainer}>
                    <View style={styles.lightMockupHeader} />
                    <View style={styles.lightMockupBody} />
                  </View>
                  <Text style={[styles.themeOptionTitle, themeMode === 'light' && styles.selectedText]}>Light</Text>
                  <Text style={styles.themeOptionSub}>Always bright</Text>
                </TouchableOpacity>
                {themeMode === 'light' && (
                  <Ionicons name="checkmark-circle" size={22} color={colors.primary} style={{ marginTop: 8 }} />
                )}
              </View>

              {/* Dark Option */}
              <View style={styles.themeOptionColumn}>
                <TouchableOpacity 
                  style={[
                    styles.themeOptionCard, 
                    themeMode === 'dark' && styles.themeOptionCardSelected
                  ]}
                  onPress={() => setThemeMode('dark')}
                >
                  <View style={styles.mockupContainer}>
                    <View style={styles.darkMockupHeader} />
                    <View style={styles.darkMockupBody} />
                  </View>
                  <Text style={[styles.themeOptionTitle, themeMode === 'dark' && styles.selectedText]}>Dark</Text>
                  <Text style={styles.themeOptionSub}>Always dark</Text>
                </TouchableOpacity>
                {themeMode === 'dark' && (
                  <Ionicons name="checkmark-circle" size={22} color={colors.primary} style={{ marginTop: 8 }} />
                )}
              </View>

              {/* Auto Option */}
              <View style={styles.themeOptionColumn}>
                <TouchableOpacity 
                  style={[
                    styles.themeOptionCard, 
                    themeMode === 'auto' && styles.themeOptionCardSelected
                  ]}
                  onPress={() => setThemeMode('auto')}
                >
                  <View style={styles.mockupContainer}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <View style={{ flex: 1, backgroundColor: '#E2E8F0' }} />
                      <View style={{ flex: 1, backgroundColor: '#0F172A' }} />
                    </View>
                  </View>
                  <Text style={[styles.themeOptionTitle, themeMode === 'auto' && styles.selectedText]}>Auto</Text>
                  <Text style={styles.themeOptionSub}>Follows IST time</Text>
                </TouchableOpacity>
                {themeMode === 'auto' && (
                  <Ionicons name="checkmark-circle" size={22} color={colors.primary} style={{ marginTop: 8 }} />
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const createStyles = (colors: typeof darkColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: theme.spacing.m,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
    paddingTop: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  phoneText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  iconMargin: {
    width: 24,
    textAlign: 'center',
  },
  // Modal layout
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
    alignItems: 'center',
  },
  modalHandle: {
    width: 44,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  modalSubTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 1.5,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  themeOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  themeOptionColumn: {
    flex: 1,
    alignItems: 'center',
  },
  themeOptionCard: {
    width: '100%',
    aspectRatio: 0.9,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeOptionCardSelected: {
    borderColor: colors.primary,
  },
  mockupContainer: {
    width: '100%',
    height: '42%',
    borderRadius: 6,
    backgroundColor: colors.border,
    overflow: 'hidden',
    marginBottom: 10,
  },
  lightMockupHeader: {
    height: '25%',
    backgroundColor: '#E2E8F0',
  },
  lightMockupBody: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  darkMockupHeader: {
    height: '25%',
    backgroundColor: '#1E293B',
  },
  darkMockupBody: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  themeOptionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  themeOptionSub: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  selectedText: {
    color: colors.primary,
  },
});
