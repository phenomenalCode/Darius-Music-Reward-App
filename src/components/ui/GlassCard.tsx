// components/ui/GlassCard.tsx
import React, { memo, useMemo } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { GlassCardProps } from "../../types";

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  borderRadius = 12,
  style,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const containerStyle = useMemo<ViewStyle[]>(
    () => [
      styles.base,
      { borderRadius },
      style as ViewStyle,
    ],
    [borderRadius, style]
  );

  return (
    <View
      style={containerStyle}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      {children}
    </View>
  );
};

export default memo(GlassCard);

const styles = StyleSheet.create({
  base: {
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    overflow: "hidden",

    // Android stacking fix
    elevation: 2,

    // iOS stacking fix
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
});
