import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';
import Test from './Test';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

//Navigation is declared in this component
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator

      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home'
          } else if (route.name === 'Search') {
            iconName = 'search-web'
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#7E57C2',
        animation: 'shift' //For smooth transition between screens
      })}
    >

      <Tab.Screen name='Home' component={StackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name='Search' component={SearchScreen} />
    </Tab.Navigator>

  );
}

function StackNavigator() {
  return (
    <Stack.Navigator >
      <Stack.Screen name='HomeScreen' component={HomeScreen} />
      <Stack.Screen name='Test' component={Test} />
    </Stack.Navigator>
  );
}

//The root component calls both tab snd stack navigator components and wraps them in navigationcontainer
export default function App() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}


