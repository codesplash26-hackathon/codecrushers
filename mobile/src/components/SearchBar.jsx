import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export default function SearchBar({ value, onChangeText, placeholder }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || "Enter location..."}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 6 },
  input: { height: 44, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#F8FAFC' }
});
