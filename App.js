import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import { Image } from 'react-native';

import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';
import LoginScreen from './LoginScreen';
import AddActivity from './AddActivity';
import ChartScreen from './ChartScreen';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

//Navigation is declared in this component
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function LogoTitle() {
  return (
    <Image
      source={require('./assets/FullLogo_Transparent_NoBuffer.png')}
      style={{ width: 40, height: 40 }}
    />
  )
}

function StackNavigator() {
  return (
    <Stack.Navigator >
      <Stack.Screen name='HomeScreen' component={HomeScreen} options={{ headerTitle: (props) => <LogoTitle {...props} />, headerShadowVisible: false }} />
      <Stack.Screen name='AddActivity' component={AddActivity} options={{ headerTitle: (props) => <LogoTitle {...props} />, headerTintColor: '#7E57C2', headerBackTitle: "Back" }} />
    </Stack.Navigator>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator

      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'MainHome') {
            iconName = 'home'
          } else if (route.name === 'Search') {
            iconName = 'search-web'
          } else if (route.name === "Charts") {
            iconName = "chart-bar"
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#7E57C2',
      })}
    >

      <Tab.Screen name='MainHome' component={StackNavigator} options={{ headerShown: false, title: "Home" }} />
      <Tab.Screen name='Search' component={SearchScreen} options={{ headerTitle: (props) => <LogoTitle {...props} />, headerShadowVisible: false}} />
      <Tab.Screen name='Charts' component={ChartScreen} options={{ headerTitle: (props) => <LogoTitle {...props} />, headerShadowVisible: false }} />
    </Tab.Navigator>

  );
}

//The root component has stack navigator to show either login screen or the app main screen with tab navigation
export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MainTabs" component={HomeTabs} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}


