import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PREFERENCES = [
  { id: 'FASTEST', label: 'Fastest' },
  { id: 'CHEAPEST', label: 'Cheapest' },
  { id: 'MIN_WALKING', label: 'Min Walking' },
  { id: 'MIN_TRANSFERS', label: 'Min Transfers' },
  { id: 'MOST_RELIABLE', label: 'Most Reliable' }
];

export default function PreferenceSelector({ selected, onSelect }) {
  return (
    <View style={styles.container}>
      {PREFERENCES.map(pref => (
        <TouchableOpacity
          key={pref.id}
          style={[styles.chip, selected === pref.id && styles.activeChip]}
          onPress={() => onSelect(pref.id)}
        >
          <Text style={[styles.text, selected === pref.id && styles.activeText]}>{pref.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderBottomWidth: 1, borderColor: '#CBD5E1', marginRight: 8, marginBottom: 8 },
  activeChip: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  text: { color: '#475569', fontSize: 12 },
  activeText: { color: '#FFF', fontWeight: 'bold' }
});
