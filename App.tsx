import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootSiblingParent } from "react-native-root-siblings";
import { RepositoryProvider } from "./src/lib/RepositoryContext";
import AddScreen from "./src/screens/AddScreen";
import DetailScreen from "./src/screens/DetailScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SearchScreen from "./src/screens/Search";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <RootSiblingParent>
      <NavigationContainer>
        <RepositoryProvider>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Detail" component={DetailScreen} />
            <Stack.Screen name="Add" component={AddScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
          </Stack.Navigator>
        </RepositoryProvider>
      </NavigationContainer>
    </RootSiblingParent>
  );
}

// <Stack.Screen name="Edit" component={EditScreen} />
