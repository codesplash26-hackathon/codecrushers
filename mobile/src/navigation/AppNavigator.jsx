import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import JourneySearchScreen from '../screens/JourneySearchScreen';
import RouteComparisonScreen from '../screens/RouteComparisonScreen';
import JourneyDetailsScreen from '../screens/JourneyDetailsScreen';
import LiveTrackingScreen from '../screens/LiveTrackingScreen';
import DisruptionAlertScreen from '../screens/DisruptionAlertScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainTabs">
        <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="JourneySearch" component={JourneySearchScreen} options={{ title: 'Plan Journey' }} />
        <Stack.Screen name="RouteComparison" component={RouteComparisonScreen} options={{ title: 'Route Options' }} />
        <Stack.Screen name="JourneyDetails" component={JourneyDetailsScreen} options={{ title: 'Journey Details' }} />
        <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} options={{ title: 'Live Tracking' }} />
        <Stack.Screen name="DisruptionAlert" component={DisruptionAlertScreen} options={{ title: 'Disruption Alert' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
