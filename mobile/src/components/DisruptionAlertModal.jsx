import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function DisruptionAlertModal({ visible, disruption, onAcceptReroute, onDismiss }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>⚠️ Journey Disruption Detected</Text>
          <Text style={styles.message}>{disruption?.message || 'Your connecting train is delayed by 25 mins.'}</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={onAcceptReroute}>
            <Text style={styles.btnText}>View Alternative Route</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={onDismiss}>
            <Text style={styles.secondaryBtnText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#FFF', padding: 24, borderRadius: 12 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#DC2626', marginBottom: 12 },
  message: { fontSize: 14, color: '#334155', marginBottom: 20 },
  primaryBtn: { backgroundColor: '#2563EB', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  secondaryBtn: { marginTop: 8, padding: 12, alignItems: 'center' },
  secondaryBtnText: { color: '#64748B' }
});
