import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function JourneyMap({ route }) {
  return (
    <View style={styles.mapContainer}>
      <Text style={styles.mapPlaceholder}>Interactive Map Container (Leaflet / Mapbox / React Native Maps)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: { height: 220, backgroundColor: '#E2E8F0', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  mapPlaceholder: { color: '#64748B', fontWeight: '500' }
});
