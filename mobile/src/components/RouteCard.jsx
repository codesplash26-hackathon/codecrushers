import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import TransportBadge from './TransportBadge';
import TransferRiskBadge from './TransferRiskBadge';

export default function RouteCard({ route, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.duration}>{route?.totalDurationMinutes || 45} mins</Text>
        <Text style={styles.cost}>LKR {route?.totalCost || 250}</Text>
      </View>
      <View style={styles.badgeRow}>
        <TransportBadge mode="BUS" />
        <Text style={styles.arrow}>→</Text>
        <TransportBadge mode="TRAIN" />
        <Text style={styles.arrow}>→</Text>
        <TransportBadge mode="TAXI" />
      </View>
      <TransferRiskBadge risk={route?.connectionRisk || 'LOW'} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8, marginVertical: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  duration: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  cost: { fontSize: 16, fontWeight: '600', color: '#059669' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  arrow: { marginHorizontal: 6, color: '#64748B' }
});
