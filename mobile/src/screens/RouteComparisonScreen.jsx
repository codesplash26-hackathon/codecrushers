import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import RouteCard from '../components/RouteCard';

export default function RouteComparisonScreen({ route, navigation }) {
  const dummyRoutes = [
    { id: '1', totalDurationMinutes: 180, totalCost: 450, connectionRisk: 'LOW' },
    { id: '2', totalDurationMinutes: 210, totalCost: 280, connectionRisk: 'MEDIUM' }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Multimodal Routes</Text>
      <FlatList
        data={dummyRoutes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RouteCard route={item} onPress={() => navigation.navigate('JourneyDetails', { routeId: item.id })} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFF' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 }
});
