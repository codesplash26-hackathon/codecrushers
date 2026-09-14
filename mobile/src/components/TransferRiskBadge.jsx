import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TransferRiskBadge({ risk }) {
  const getBadgeStyle = () => {
    switch (risk) {
      case 'HIGH': return { bg: '#FEE2E2', text: '#DC2626', label: 'High Transfer Risk' };
      case 'MEDIUM': return { bg: '#FEF3C7', text: '#D97706', label: 'Medium Transfer Risk' };
      default: return { bg: '#DCFCE7', text: '#16A34A', label: 'Low Connection Risk' };
    }
  };

  const style = getBadgeStyle();
  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Text style={[styles.text, { color: style.text }]}>{style.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start', marginTop: 4 },
  text: { fontSize: 11, fontWeight: 'bold' }
});
