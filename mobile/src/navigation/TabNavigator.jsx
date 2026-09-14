import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import PreferencesScreen from '../screens/PreferencesScreen';
import SavedJourneysScreen from '../screens/SavedJourneysScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Saved" component={SavedJourneysScreen} />
      <Tab.Screen name="Preferences" component={PreferencesScreen} />
    </Tab.Navigator>
  );
}
