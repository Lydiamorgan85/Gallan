/**
 * App entry point for Gallán.
 *
 * Loads the stored sites and renders them as a list, where each row can be
 * saved or unsaved. On a real device the local SQLite database is seeded and
 * queried; on web, which has no SQLite, the sites are read from bundled seed
 * data instead so the preview still runs.
 */

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { seedInitialSites, toggleSaved } from "./src/lib/siteRepository";
import { loadSites } from "./src/lib/loadSites";
import { SITE_TYPE_LABELS } from "./src/constants/config";
import type { Site } from "./src/types/site";

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);

  useEffect(() => {
    // Prepare data on launch. Seeding only runs on a real device, since web has
    // no database to seed. loadSites then returns either database rows (device)
    // or the seed data (web). try/finally ensures the app always leaves its
    // loading state.
    async function prepare() {
      try {
        if (Platform.OS !== "web") {
          await seedInitialSites();
        }
        const loaded = await loadSites();
        setSites(loaded);
      } catch (error) {
        console.error("Failed to load sites:", error);
      } finally {
        setIsReady(true);
      }
    }
    prepare();
  }, []);

  // Persists a save/unsave on device and updates the affected row in state so
  // the marker flips instantly. On web there is no database, so this updates
  // local state only.
  async function handleToggleSaved(id: string) {
    try {
      if (Platform.OS !== "web") {
        await toggleSaved(id);
      }
      setSites((current) =>
        current.map((site) =>
          site.id === id ? { ...site, isSaved: !site.isSaved } : site
        )
      );
    } catch (error) {
      console.error("Failed to toggle saved state:", error);
    }
  }

  if (!isReady) {
    return (
      <View style={styles.centre}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.heading}>Gallán</Text>
      <Text style={styles.subheading}>Ireland's sacred landscape</Text>

      <FlatList
        data={sites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardText}>
              <Text style={styles.siteName}>{item.name}</Text>
              <Text style={styles.siteMeta}>
                {SITE_TYPE_LABELS[item.type]}
                {item.county ? "  ·  " + item.county : ""}
              </Text>
            </View>
            <Pressable
              onPress={() => handleToggleSaved(item.id)}
              hitSlop={12}
              style={styles.starButton}
            >
              <Text style={styles.star}>{item.isSaved ? "★" : "☆"}</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdfcfa", paddingTop: 64, paddingHorizontal: 20 },
  centre: { flex: 1, alignItems: "center", justifyContent: "center" },
  heading: { fontSize: 30, fontWeight: "700", color: "#2a2a2a" },
  subheading: { fontSize: 15, color: "#777", marginBottom: 24 },
  list: { paddingBottom: 40 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardText: { flex: 1 },
  siteName: { fontSize: 17, fontWeight: "600", color: "#2a2a2a" },
  siteMeta: { fontSize: 13, color: "#888", marginTop: 2 },
  starButton: { paddingLeft: 12 },
  star: { fontSize: 24, color: "#c9a227" },
});
