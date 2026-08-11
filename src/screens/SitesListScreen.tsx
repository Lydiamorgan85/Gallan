/**
 * Sites list screen.
 *
 * Shows every site ordered by distance from the user. Each site is a card that
 * leads with its photograph when it has one, so imagery carries the screen. A
 * warm hero band heads the list. Tapping a card opens the detail screen; the
 * star saves or unsaves. All colour, spacing and depth come from the theme.
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
      <View style={[styles.contentWrap, { maxWidth: contentMaxWidth }]}>
        <FlatList
          data={rankedSites}
          keyExtractor={(entry) => entry.site.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.hero}>
              <Text style={styles.heroTitle}>Sacred sites near you</Text>
              <Text style={styles.heroSubtitle}>
                Ancient places across the Irish landscape
              </Text>
              {!usingRealLocation && (
                <Text style={styles.notice}>
                  Showing distances from the centre of Ireland. Open on your phone
                  with location enabled to see sites near you.
                </Text>
              )}
            </View>
          }
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
                ) : (
                  // A slim coloured accent strip stands in for a photo until one
                  // is added, so imageless cards still feel deliberate.
                  <View style={styles.accentStrip} />
                )}

                <View style={styles.cardBody}>
                  <View style={styles.cardText}>
                    <Text style={styles.typeLabel}>
                      {SITE_TYPE_LABELS[item.site.type].toUpperCase()}
                    </Text>
                    <Text style={styles.siteName}>{item.site.name}</Text>
                    <Text style={styles.siteMeta}>
                      {item.site.county ? item.site.county + "   ·   " : ""}
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
  contentWrap: { flex: 1, width: "100%" },
  centre: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },

  hero: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  heroTitle: {
    fontSize: typography.title,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.3,
  },
  heroSubtitle: {
    fontSize: typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  notice: {
    fontSize: typography.small,
    color: colors.text,
    backgroundColor: colors.surface,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.md,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    // Soft depth. Reads subtly on web, more richly on a device.
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: { width: "100%", height: 180, backgroundColor: colors.border },
  accentStrip: { height: 6, backgroundColor: colors.primaryLight },
  cardBody: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
  },
  cardText: { flex: 1 },
  typeLabel: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: spacing.xs,
  },
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
  starButton: { paddingLeft: spacing.md },
  star: { fontSize: 26, color: colors.accent },
});
