import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SearchBar from '../components/SearchBar';
import PreferenceSelector from '../components/PreferenceSelector';

export default function JourneySearchScreen({ navigation }) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [preference, setPreference] = useState('FASTEST');

  const handleSearch = () => {
    navigation.navigate('RouteComparison', { origin, destination, preference });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Where would you like to go?</Text>
      <SearchBar value={origin} onChangeText={setOrigin} placeholder="From (Origin, e.g. Kandy)" />
      <SearchBar value={destination} onChangeText={setDestination} placeholder="To (Destination, e.g. Colombo)" />
      
      <Text style={styles.sectionTitle}>Journey Preference</Text>
      <PreferenceSelector selected={preference} onSelect={setPreference} />

      <TouchableOpacity style={styles.btn} onPress={handleSearch}>
        <Text style={styles.btnText}>Search Routes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFF' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  btn: { backgroundColor: '#2563EB', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  btnText: { color: '#FFF', fontWeight: 'bold' }
});
