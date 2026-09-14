import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import JourneyMap from '../components/JourneyMap';

export default function JourneyDetailsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Journey Breakdown</Text>
      <JourneyMap />
      <TouchableOpacity 
        style={styles.startBtn} 
        onPress={() => navigation.navigate('LiveTracking')}
      >
        <Text style={styles.btnText}>Start Journey Monitoring</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFF' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  startBtn: { marginTop: 20, backgroundColor: '#059669', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold' }
});
