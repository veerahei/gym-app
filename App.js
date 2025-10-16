import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name='Home' component={HomeScreen} />
          <Tab.Screen name='Search' component={SearchScreen} />
        </Tab.Navigator>
      </NavigationContainer>
  );
}


