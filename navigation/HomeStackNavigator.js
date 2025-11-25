import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LogoTitle from "./LogoTitle";

import HomeScreen from "../screens/HomeScreen";
import AddActivityScreen from "../screens/AddActivityScreen";


const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
    return (
      <Stack.Navigator >
        <Stack.Screen name='HomeScreen' component={HomeScreen} options={{ headerTitle: (props) => <LogoTitle {...props} />, headerShadowVisible: false }} />
        <Stack.Screen name='AddActivity' component={AddActivityScreen} options={{ headerTitle: (props) => <LogoTitle {...props} />, headerTintColor: '#7E57C2', headerBackTitle: "Back" }} />
      </Stack.Navigator>
    );
  }