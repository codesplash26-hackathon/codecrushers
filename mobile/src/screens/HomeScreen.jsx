import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BestRoute Multimodal Planner</Text>
      <Text style={styles.subtitle}>Unified Bus, Train, Taxi & Walking Connections</Text>

      <TouchableOpacity 
        style={styles.searchBtn} 
        onPress={() => navigation.navigate('JourneySearch')}
      >
        <Text style={styles.btnText}>Plan New Journey</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#FFF' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },
  subtitle: { fontSize: 14, color: '#64748B', marginVertical: 8 },
  searchBtn: { marginTop: 24, backgroundColor: '#2563EB', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
