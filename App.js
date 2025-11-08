import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';
import LoginScreen from './LoginScreen';
import AddActivity from './AddActivity';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


//Navigation is declared in this component
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator

      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'MainHome') {
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

      <Tab.Screen name='MainHome' component={StackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name='Search' component={SearchScreen} />
    </Tab.Navigator>

  );
}

function StackNavigator() {
  return (
    <Stack.Navigator >
      <Stack.Screen name='HomeScreen' component={HomeScreen} />
      <Stack.Screen name='AddActivity' component={AddActivity} options={{ title: "", headerTintColor: '#7E57C2' }} />
    </Stack.Navigator>
  );
}

//The root component has stack navigator to show either login screen or the app main screen with tab navigation
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={HomeTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


