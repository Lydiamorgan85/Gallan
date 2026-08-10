/**
 * Site repository: the app's single entry point for site data.
 *
 * Screens and components import from here, not from the database module. This
 * extra layer exists so the UI depends on a small, stable set of functions
 * describing *what* it needs ("give me all sites", "save this one") rather than
 * *how* storage works. It also gives us a natural home for logic that is about
 * data but not about SQL, such as seeding the initial dataset.
 */

import {
  getAllSites,
  getSiteById,
  toggleSiteSaved,
  upsertSite,
} from "../database/database";
import { SEED_SITES } from "../data/seedSites";
import type { Site } from "../types/site";

/**
 * Ensures the database contains at least the bundled starter sites.
 *
 * Called once when the app starts. Because upsertSite is idempotent, running
 * this on every launch is safe: it refreshes the seed data without duplicating
 * rows and without touching the user's saved flags. Seeding is done in
 * sequence deliberately; the dataset is tiny, so the simplicity is worth more
 * than the marginal speed of parallel writes.
 */
export async function seedInitialSites(): Promise<void> {
  for (const site of SEED_SITES) {
    await upsertSite(site);
  }
}

/** Returns all sites for the map and list views. */
export async function listSites(): Promise<Site[]> {
  return getAllSites();
}

/** Returns one site for the detail view, or null if it does not exist. */
export async function findSite(id: string): Promise<Site | null> {
  return getSiteById(id);
}

/**
 * Adds or removes a site from the user's saved list and returns the new state,
 * so the calling screen can update its display without re-fetching everything.
 */
export async function toggleSaved(id: string): Promise<boolean> {
  return toggleSiteSaved(id);
}
