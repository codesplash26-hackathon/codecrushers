import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function DisruptionAlertScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.alertTitle}>⚠️ Disruption Detected!</Text>
      <Text style={styles.details}>Train segment #T102 is delayed by 30 mins. Connection at station is no longer feasible.</Text>
      
      <Text style={styles.subHeader}>Updated Recommendation:</Text>
      <Text style={styles.reroute}>Bus → Train (Later Service) → Taxi</Text>
      
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('LiveTracking')}>
        <Text style={styles.btnText}>Accept & Update Journey</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  alertTitle: { fontSize: 22, fontWeight: 'bold', color: '#DC2626' },
  details: { fontSize: 14, color: '#475569', marginVertical: 12 },
  subHeader: { fontSize: 16, fontWeight: 'bold', marginTop: 16 },
  reroute: { fontSize: 16, color: '#2563EB', fontWeight: '600', marginVertical: 8 },
  btn: { backgroundColor: '#2563EB', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  btnText: { color: '#FFF', fontWeight: 'bold' }
});
