import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {RootSiblingParent} from "react-native-root-siblings"

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <RootSiblingParent>
          <NavigationContainer>
              <Stack.Navigator initialRouteName="Home">
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen name="Detail" component={DetailScreen} />
                  <Stack.Screen name="Add" component={AddScreen} />
                  <Stack.Screen name="Edit" component={EditScreen} />
              </Stack.Navigator>
          </NavigationContainer>
    </RootSiblingParent>
  );
}
