import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, darkColors } from '../constants/theme';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme, useThemeStyles } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000); // 2 second splash screen
    return () => clearTimeout(timer);
  }, [navigation]);

  const { colors } = useTheme();
  const styles = useThemeStyles(createStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Repair The Gear</Text>
      <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
    </View>
  );
}

const createStyles = (colors: typeof darkColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    ...theme.typography.title,
    fontSize: 32,
    color: colors.text,
    marginBottom: theme.spacing.xl,
  },
  loader: {
    marginTop: theme.spacing.m,
  },
});
