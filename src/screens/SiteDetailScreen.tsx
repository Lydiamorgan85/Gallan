/**
 * Site detail screen.
 *
 * Shows the full record for a single site: summary, history, folklore, an image
 * gallery and a link to an authoritative source. Each section renders only when
 * the site has that content, so sites without images or folklore still look
 * clean. The site to show is identified by the siteId passed in navigation.
 */

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { findSite } from "../lib/siteRepository";
import { loadSites } from "../lib/loadSites";
import { useResponsiveLayout } from "../lib/useResponsiveLayout";
import { SITE_TYPE_LABELS } from "../constants/config";
import type { Site } from "../types/site";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "SiteDetail">;

export function SiteDetailScreen({ route }: Props) {
  const { siteId } = route.params;
  const [site, setSite] = useState<Site | null>(null);
  const [isReady, setIsReady] = useState(false);

  const { contentMaxWidth } = useResponsiveLayout();

  useEffect(() => {
    async function load() {
      try {
        // On device the site comes from the database; on web there is no
        // database, so fall back to finding it in the loaded seed data.
        let found = await findSite(siteId);
        if (!found) {
          const all = await loadSites();
          found = all.find((s) => s.id === siteId) ?? null;
        }
        setSite(found);
      } catch (error) {
        console.error("Failed to load site:", error);
      } finally {
        setIsReady(true);
      }
    }
    load();
  }, [siteId]);

  if (!isReady) {
    return (
      <View style={styles.centre}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!site) {
    return (
      <View style={styles.centre}>
        <Text style={styles.notFound}>Site not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <View style={[styles.content, { maxWidth: contentMaxWidth }]}>
        <Text style={styles.name}>{site.name}</Text>
        <Text style={styles.meta}>
          {SITE_TYPE_LABELS[site.type]}
          {site.county ? "  ·  " + site.county : ""}
        </Text>

        {site.description ? (
          <Text style={styles.blurb}>{site.description}</Text>
        ) : null}

        {site.images && site.images.length > 0 ? (
          <View style={styles.gallery}>
            {site.images.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image
                  source={{ uri: image.source }}
                  style={styles.image}
                  resizeMode="cover"
                />
                {image.caption ? (
                  <Text style={styles.caption}>{image.caption}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {site.history ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>History</Text>
            <Text style={styles.sectionBody}>{site.history}</Text>
          </View>
        ) : null}

        {site.folklore ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legends and folklore</Text>
            <Text style={styles.sectionBody}>{site.folklore}</Text>
          </View>
        ) : null}

        {site.officialSourceUrl ? (
          <Pressable
            style={styles.sourceButton}
            onPress={() => Linking.openURL(site.officialSourceUrl as string)}
          >
            <Text style={styles.sourceText}>Read more at the official source</Text>
          </Pressable>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fdfcfa" },
  scrollContent: { alignItems: "center", paddingVertical: 24 },
  content: { width: "100%", paddingHorizontal: 20 },
  centre: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFound: { fontSize: 16, color: "#777" },
  name: { fontSize: 26, fontWeight: "700", color: "#2a2a2a" },
  meta: { fontSize: 14, color: "#888", marginTop: 4, marginBottom: 16 },
  blurb: { fontSize: 16, color: "#444", lineHeight: 24, marginBottom: 20 },
  gallery: { marginBottom: 20 },
  imageWrapper: { marginBottom: 12 },
  image: { width: "100%", height: 220, borderRadius: 12, backgroundColor: "#eee" },
  caption: { fontSize: 12, color: "#888", marginTop: 6, textAlign: "center" },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#2a2a2a", marginBottom: 8 },
  sectionBody: { fontSize: 15, color: "#444", lineHeight: 23 },
  sourceButton: {
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 24,
  },
  sourceText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
