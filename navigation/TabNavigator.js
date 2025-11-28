import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeStackNavigator from './HomeStackNavigator';
import LogoTitle from './LogoTitle';

import SearchScreen from '../screens/SearchScreen';
import ChartScreen from '../screens/ChartScreen';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();


export default function TabNavigator() {
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
            <Tab.Screen name='MainHome' component={HomeStackNavigator} options={{ headerShown: false, title: "Home" }} />
            <Tab.Screen name='Search' component={SearchScreen} options={{ headerTitle: (props) => <LogoTitle {...props} />, headerShadowVisible: false }} />
            <Tab.Screen name='Charts' component={ChartScreen} options={{ headerTitle: (props) => <LogoTitle {...props} />, headerShadowVisible: false }} />
        </Tab.Navigator>
    );
}