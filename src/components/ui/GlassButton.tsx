import React from "react";
import { Text, Pressable, StyleSheet, Platform } from "react-native";
import { GlassButtonProps } from "../../types";
import { THEME } from "../../constants/theme";

/**
 * GlassButton
 * ------------
 * A platform-safe, visually consistent button for web and native.
 * Fixes click-blocking issues caused by parent layers (like GlassCard) by
 * ensuring correct pointerEvents and zIndex.
 */
const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  onPress,
  disabled,
  style,
}) => {
  return (
    <Pressable
      onPress={() => {
        try {
          console.log("🎯 GlassButton pressed!", { title, disabled });
          onPress?.();
          console.log("✅ GlassButton onPress() executed successfully");
        } catch (err) {
          console.error("❌ GlassButton onPress() error:", err);
        }
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      hitSlop={10}
      onPressIn={() => console.log('🎯 GlassButton onPressIn', title)}
      style={({ pressed }) => [
        styles.button,
        {
          // keep stacking modest so it doesn't occlude siblings
          zIndex: 1,
          position: 'relative',
          opacity: pressed ? 0.8 : disabled ? 0.6 : 1,
          cursor: Platform.OS === "web" ? "pointer" : "auto"
        },
        style,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: THEME.colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default GlassButton;