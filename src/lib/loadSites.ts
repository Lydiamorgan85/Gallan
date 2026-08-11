/**
 * Web-safe site loading.
 *
 * expo-sqlite does not run in a browser, so on web we read the bundled seed
 * data directly instead of opening the database. On a real device this file is
 * not used; the repository talks to SQLite as normal. This keeps the browser
 * preview working for UI development without affecting device behaviour.
 */

import { Platform } from "react-native";
import { SEED_SITES } from "../data/seedSites";
import { listSites as listFromDb } from "./siteRepository";
import type { Site } from "../types/site";

// Returns sites from the database on device, or the seed data on web.
export async function loadSites(): Promise<Site[]> {
  if (Platform.OS === "web") {
    return SEED_SITES;
  }
  return listFromDb();
}
