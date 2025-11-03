// GlassButton.tsx
import React from "react";
import {
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { THEME } from "../../constants/theme";

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  blurIntensity?: number;
  borderRadius?: number;
}

const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
  textStyle,
  blurIntensity = 20,
  borderRadius = 12,
}) => {
  const gradientColors =
    variant === "primary"
      ? THEME.glass.gradientColors.primary
      : THEME.glass.gradientColors.secondary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
      style={({ pressed }) => [
        {
          opacity: pressed || disabled ? 0.7 : 1,
        },
        { borderRadius },
        style,
      ]}
    >
      <BlurView
        intensity={blurIntensity}
        style={[StyleSheet.absoluteFill, { borderRadius }]}
      />
      <LinearGradient
        colors={gradientColors}
        style={[StyleSheet.absoluteFill, { borderRadius }]}
      />
      <Text
        style={[
          styles.text,
          { color: variant === "primary" ? "#fff" : THEME.colors.text.primary },
          textStyle,
        ]}
      >
        {loading ? <ActivityIndicator color="#fff" /> : title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: THEME.fonts.sizes.md,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.lg,
  },
});

export default GlassButton;
