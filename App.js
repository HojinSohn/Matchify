import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import PromptScreen from "./screens/PromptScreen";
import ChatRoomScreen from "./screens/ChatRoomScreen";
import ChatListScreen from "./screens/ChatListScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AppointmentScreen from "./screens/AppointmentScreen";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Prompt" component={PromptScreen} />
            <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
            <Stack.Screen name="ChatList" component={ChatListScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Appointment" component={AppointmentScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
