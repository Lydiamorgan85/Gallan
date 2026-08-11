/**
 * Sites list screen.
 *
 * Shows every site ordered by distance from the user, each as a card with its
 * name, type, county, and distance and direction. When a site has a photograph
 * the card leads with it, so imagery carries the screen; sites without a photo
 * fall back to a clean text card. Tapping a card opens the detail screen; the
 * star saves or unsaves. All colour and spacing come from the shared theme.
 */

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
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
import { colors, spacing, typography, radius } from "../constants/theme";
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
        <ActivityIndicator size="large" color={colors.primary} />
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
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const hasImage = item.site.images && item.site.images.length > 0;
            return (
              <Pressable
                style={styles.card}
                onPress={() =>
                  navigation.navigate("SiteDetail", { siteId: item.site.id })
                }
              >
                {hasImage ? (
                  <Image
                    source={{ uri: item.site.images![0].source }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                ) : null}

                <View style={styles.cardBody}>
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
                    <Text style={styles.star}>
                      {item.site.isSaved ? "★" : "☆"}
                    </Text>
                  </Pressable>
                </View>
              </Pressable>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, alignItems: "center" },
  content: {
    flex: 1,
    width: "100%",
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  centre: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  subheading: {
    fontSize: typography.small,
    color: colors.textMuted,
    marginBottom: spacing.md,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  notice: {
    fontSize: typography.small,
    color: colors.text,
    backgroundColor: colors.surface,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  list: { paddingBottom: spacing.xl },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: 160, backgroundColor: colors.border },
  cardBody: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
  },
  cardText: { flex: 1 },
  siteName: {
    fontSize: typography.heading,
    fontWeight: "700",
    color: colors.primary,
  },
  siteMeta: {
    fontSize: typography.small,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  distance: {
    fontSize: typography.small,
    color: colors.accent,
    marginTop: spacing.sm,
    fontWeight: "600",
  },
  starButton: { paddingLeft: spacing.md },
  star: { fontSize: 26, color: colors.accent },
});
