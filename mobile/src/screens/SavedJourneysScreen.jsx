import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SavedJourneysScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Favourite Journeys</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFF' },
  title: { fontSize: 20, fontWeight: 'bold' }
});
