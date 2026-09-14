import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import JourneyMap from '../components/JourneyMap';
import DisruptionAlertModal from '../components/DisruptionAlertModal';

export default function LiveTrackingScreen({ navigation }) {
  const [showDisruption, setShowDisruption] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Journey Monitoring</Text>
      <JourneyMap />
      <Text style={styles.status}>Status: Monitoring active route for disruptions...</Text>
      
      <DisruptionAlertModal
        visible={showDisruption}
        onAcceptReroute={() => {
          setShowDisruption(false);
          navigation.navigate('DisruptionAlert');
        }}
        onDismiss={() => setShowDisruption(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFF' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  status: { marginTop: 16, fontSize: 14, color: '#059669', fontWeight: '500' }
});
