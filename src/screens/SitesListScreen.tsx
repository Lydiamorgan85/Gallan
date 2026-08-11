/**
 * Sites list screen.
 *
 * Shows every site ordered by distance from the user, each with its distance
 * and compass direction. Tapping a site opens its detail screen; tapping the
 * star saves or unsaves it. Location and ranking use the geo engine, so this
 * screen only presents data and handles taps.
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
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { seedInitialSites, toggleSaved } from "../lib/siteRepository";
import { loadSites } from "../lib/loadSites";
import { getCurrentLocation } from "../lib/location";
import { sitesByDistance, type SiteWithDistance } from "../lib/geo";
import { useResponsiveLayout } from "../lib/useResponsiveLayout";
import { SITE_TYPE_LABELS } from "../constants/config";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "SitesList">;

export function SitesListScreen({ navigation }: Props) {
  const [isReady, setIsReady] = useState(false);
  const [rankedSites, setRankedSites] = useState<SiteWithDistance[]>([]);
  const [usingRealLocation, setUsingRealLocation] = useState(false);

  const { contentMaxWidth } = useResponsiveLayout();

  useEffect(() => {
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
        console.error("Failed to prepare sites list:", error);
      } finally {
        setIsReady(true);
      }
    }
    prepare();
  }, []);

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
      <View style={[styles.content, { maxWidth: contentMaxWidth }]}>
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
            <Pressable
              style={styles.card}
              onPress={() =>
                navigation.navigate("SiteDetail", { siteId: item.site.id })
              }
            >
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
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fdfcfa", alignItems: "center" },
  content: { flex: 1, width: "100%", paddingTop: 16, paddingHorizontal: 20 },
  centre: { flex: 1, alignItems: "center", justifyContent: "center" },
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
