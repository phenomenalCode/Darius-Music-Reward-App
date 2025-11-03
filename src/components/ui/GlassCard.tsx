// GlassCard Component
import React from "react";
import { View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import { GlassCardProps } from "../../types";
import { THEME } from "../../constants/theme";



const GlassCard: React.FC<GlassCardProps> = ({
  children,
  blurIntensity = 20,
  borderRadius = 16,
  gradientColors = ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],
  style,
}) => {
  return (
    <View style={[{ borderRadius, overflow: 'hidden' }, style]}>
      <BlurView intensity={blurIntensity} style={StyleSheet.absoluteFillObject} />
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={{ margin: 1, borderRadius: borderRadius - 1 }}>
        {children}
      </View>
    </View>
  );
};
export default GlassCard;