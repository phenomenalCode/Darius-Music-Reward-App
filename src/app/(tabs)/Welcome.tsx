// /app/Welcome.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';
import GlassCard from "../../components/ui/GlassCard";

export default function Welcome() {
  return (
    <View style={styles.container}>
      <GlassCard style={styles.card}>
        <Text style={styles.title}>Welcome to the Music Rewards App Beta</Text>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.md,
  },
  card: {
    padding: THEME.spacing.lg,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    textAlign: 'center',
  },
});
