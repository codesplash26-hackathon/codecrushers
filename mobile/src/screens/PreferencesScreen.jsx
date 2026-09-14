import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PreferenceSelector from '../components/PreferenceSelector';

export default function PreferencesScreen() {
  const [pref, setPref] = useState('FASTEST');
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Passenger Preferences</Text>
      <PreferenceSelector selected={pref} onSelect={setPref} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFF' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 }
});
