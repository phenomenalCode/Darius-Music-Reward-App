// components/ui/GlassCard.tsx
import React from "react";
import { Platform, View } from "react-native";
import { GlassCardProps } from "../../types";

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  borderRadius = 12,
  style,
  accessibilityLabel,
  accessibilityHint,
}) => {
  return (
    <View
      style={[
        { 
          borderRadius,
          padding: 16,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        style,
      ]}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      {children}
    </View>
  );
};

export default GlassCard;
