import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TransportBadge({ mode }) {
  return (
    <View style={[styles.badge, styles[mode] || styles.default]}>
      <Text style={styles.text}>{mode}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  BUS: { backgroundColor: '#3B82F6' },
  TRAIN: { backgroundColor: '#8B5CF6' },
  TAXI: { backgroundColor: '#F59E0B' },
  THREE_WHEELER: { backgroundColor: '#10B981' },
  WALK: { backgroundColor: '#6B7280' },
  default: { backgroundColor: '#9CA3AF' },
  text: { color: '#FFF', fontSize: 12, fontWeight: 'bold' }
});
