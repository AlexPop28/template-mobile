import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootSiblingParent } from "react-native-root-siblings";
import HomeScreen from "./src/screens/HomeScreen";
import { RepositoryProvider } from "./src/lib/RepositoryContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <RootSiblingParent>
      <NavigationContainer>
        <RepositoryProvider>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Navigator>
        </RepositoryProvider>
      </NavigationContainer>
    </RootSiblingParent>
  );
}
// <Stack.Screen name="Detail" component={DetailScreen} />
// <Stack.Screen name="Add" component={AddScreen} />
// <Stack.Screen name="Edit" component={EditScreen} />
