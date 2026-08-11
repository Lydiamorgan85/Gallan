/**
 * App entry point for Gallan.
 *
 * Sets up navigation and registers the two screens: the sites list and the site
 * detail page. The list is the home screen; tapping a site pushes its detail
 * screen on top, with a back button to return. All data loading lives inside the
 * screens themselves, so this file only wires navigation together.
 */

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SitesListScreen } from "./src/screens/SitesListScreen";
import { SiteDetailScreen } from "./src/screens/SiteDetailScreen";
import type { RootStackParamList } from "./src/navigation/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        <Stack.Screen
          name="SitesList"
          component={SitesListScreen}
          options={{ title: "Gallan" }}
        />
        <Stack.Screen
          name="SiteDetail"
          component={SiteDetailScreen}
          options={{ title: "", headerBackTitle: "Back" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
