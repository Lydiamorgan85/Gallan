/**
 * App entry point for Gallán.
 *
 * Reads the user's location, then shows every site ordered by how near it is,
 * each with its distance and compass direction from where the user is standing.
 * Sites can be saved or unsaved. On a device the local SQLite database is seeded
 * and queried and the real GPS is used; on web, sites come from bundled seed
 * data and the location falls back to the centre of Ireland.
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
import { getCurrentLocation } from "./src/lib/location";
import { sitesByDistance, type SiteWithDistance } from "./src/lib/geo";
import { useResponsiveLayout } from "./src/lib/useResponsiveLayout";
import { SITE_TYPE_LABELS } from "./src/constants/config";

export default function App() {
  const [isReady, setIsReady] = useState(false);
  // Sites annotated with distance and direction, nearest first.
  const [rankedSites, setRankedSites] = useState<SiteWithDistance[]>([]);
  // Whether the distances are based on a real GPS reading or the fallback.
  const [usingRealLocation, setUsingRealLocation] = useState(false);

  const { contentMaxWidth } = useResponsiveLayout();

  useEffect(() => {
    // On launch: seed (device only), load the sites, read the location, then
    // rank the sites by distance from that location. try/finally guarantees the
    // app leaves its loading state even if something fails.
    async function prepare() {
      try {
        if (Platform.OS !== "web") {
          await seedInitialSites();
        }
        const sites = await loadSites();
        const location = await getCurrentLocation();
        setUsingRealLocation(location.isRealLocation);
        setRankedSites(sitesByDistance(location.coordinates, sites));
      } catch (error) {
        console.error("Failed to prepare near-me view:", error);
      } finally {
        setIsReady(true);
      }
    }
    prepare();
  }, []);

  // Persists a save/unsave on device and flips the marker in local state. The
  // ranked list holds each site inside a wrapper, so we update the nested site.
  async function handleToggleSaved(id: string) {
    try {
      if (Platform.OS !== "web") {
        await toggleSaved(id);
      }
      setRankedSites((current) =>
        current.map((entry) =>
          entry.site.id === id
            ? { ...entry, site: { ...entry.site, isSaved: !entry.site.isSaved } }
            : entry
        )
      );
    } catch (error) {
      console.error("Failed to toggle saved state:", error);
    }
  }

  // Formats a distance for display: metres when very close, otherwise
  // kilometres to one decimal place.
  function formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return Math.round(distanceKm * 1000) + " m";
    }
    return distanceKm.toFixed(1) + " km";
  }

  if (!isReady) {
    return (
      <View style={styles.centre}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="auto" />

      <View style={[styles.content, { maxWidth: contentMaxWidth }]}>
        <Text style={styles.heading}>Gallán</Text>
        <Text style={styles.subheading}>Sacred sites near you</Text>

        {!usingRealLocation && (
          <Text style={styles.notice}>
            Showing distances from the centre of Ireland. Open the app on your
            phone with location enabled to see sites near you.
          </Text>
        )}

        <FlatList
          data={rankedSites}
          keyExtractor={(entry) => entry.site.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardText}>
                <Text style={styles.siteName}>{item.site.name}</Text>
                <Text style={styles.siteMeta}>
                  {SITE_TYPE_LABELS[item.site.type]}
                  {item.site.county ? "  ·  " + item.site.county : ""}
                </Text>
                <Text style={styles.distance}>
                  {formatDistance(item.distanceKm)}  ·  {item.compassDirection}
                </Text>
              </View>
              <Pressable
                onPress={() => handleToggleSaved(item.site.id)}
                hitSlop={12}
                style={styles.starButton}
              >
                <Text style={styles.star}>{item.site.isSaved ? "★" : "☆"}</Text>
              </Pressable>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fdfcfa", alignItems: "center" },
  content: { flex: 1, width: "100%", paddingTop: 64, paddingHorizontal: 20 },
  centre: { flex: 1, alignItems: "center", justifyContent: "center" },
  heading: { fontSize: 30, fontWeight: "700", color: "#2a2a2a" },
  subheading: { fontSize: 15, color: "#777", marginBottom: 16 },
  notice: {
    fontSize: 13,
    color: "#8a6d3b",
    backgroundColor: "#fcf8e3",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
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
  distance: { fontSize: 13, color: "#c9a227", marginTop: 4, fontWeight: "600" },
  starButton: { paddingLeft: 12 },
  star: { fontSize: 24, color: "#c9a227" },
});
