/**
 * Offline storage layer for Gallán.
 *
 * This module owns the SQLite database and is the only place in the app that
 * talks to it directly. Screens and components ask this module for data; they
 * never open the database or write SQL themselves. That boundary keeps the
 * storage details in one file, so if the schema changes or the storage engine
 * is swapped later, nothing outside this file has to change.
 *
 * Uses expo-sqlite's async API throughout, so no database call blocks the UI.
 */

import * as SQLite from "expo-sqlite";
import type { Site, SiteType, SitePeriod } from "../types/site";

/** Name of the on device database file. */
const DATABASE_NAME = "gallan.db";

/**
 * The open database handle, cached after the first call. Opening a connection
 * is not free, so we open once and reuse it for the life of the app rather than
 * reopening on every query.
 */
let database: SQLite.SQLiteDatabase | null = null;

/**
 * The shape of a row as SQLite returns it. This differs from the Site type on
 * purpose: SQLite has no boolean, so isSaved comes back as an integer (0 or 1),
 * and we convert it at the boundary rather than letting that leak into the app.
 */
interface SiteRow {
  id: string;
  name: string;
  type: SiteType;
  period: SitePeriod;
  latitude: number;
  longitude: number;
  county: string | null;
  description: string | null;
  is_saved: number;
}

/**
 * Opens the database if it is not already open and makes sure the schema
 * exists. Safe to call repeatedly: after the first call it simply returns the
 * cached handle. Every public function here calls this first, so callers never
 * have to worry about initialisation order.
 */
async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (database) {
    return database;
  }

  database = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await initialiseSchema(database);
  return database;
}

/**
 * Creates the sites table if it does not already exist. Split out from
 * getDatabase for readability and so the schema is easy to find and review.
 *
 * `IF NOT EXISTS` makes this idempotent, so running it on every app start is
 * harmless. When the schema needs to change in future, this is where a
 * migration step would be added.
 */
async function initialiseSchema(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sites (
      id          TEXT PRIMARY KEY NOT NULL,
      name        TEXT NOT NULL,
      type        TEXT NOT NULL,
      period      TEXT NOT NULL,
      latitude    REAL NOT NULL,
      longitude   REAL NOT NULL,
      county      TEXT,
      description TEXT,
      is_saved    INTEGER NOT NULL DEFAULT 0
    );
  `);
}

/**
 * Converts a raw database row into the Site type used by the rest of the app.
 * This is the single point where SQLite's integer-for-boolean is turned back
 * into a real boolean, and where null columns become optional fields.
 */
function rowToSite(row: SiteRow): Site {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    period: row.period,
    latitude: row.latitude,
    longitude: row.longitude,
    county: row.county ?? undefined,
    description: row.description ?? undefined,
    isSaved: row.is_saved === 1,
  };
}

/**
 * Returns every site in the database, ordered by name.
 *
 * Used to populate the map and the full site list. Returns an empty array
 * rather than throwing when there is no data yet, so callers can render a clean
 * empty state without special casing.
 */
export async function getAllSites(): Promise<Site[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<SiteRow>(
    "SELECT * FROM sites ORDER BY name;"
  );
  return rows.map(rowToSite);
}

/**
 * Returns a single site by id, or null if no site with that id exists.
 * Used by the site detail screen. Returning null rather than throwing lets the
 * caller show a "not found" state instead of handling an exception.
 */
export async function getSiteById(id: string): Promise<Site | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<SiteRow>(
    "SELECT * FROM sites WHERE id = ?;",
    [id]
  );
  return row ? rowToSite(row) : null;
}

/**
 * Inserts a site, or updates it if one with the same id already exists.
 *
 * `INSERT ... ON CONFLICT ... DO UPDATE` (an upsert) means loading the bundled
 * site data on every app start will not create duplicates: existing rows are
 * refreshed in place. Note that is_saved is intentionally left out of the
 * update, so re-seeding the data never wipes a user's saved flag.
 */
export async function upsertSite(site: Site): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO sites (id, name, type, period, latitude, longitude, county, description, is_saved)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       name        = excluded.name,
       type        = excluded.type,
       period      = excluded.period,
       latitude    = excluded.latitude,
       longitude   = excluded.longitude,
       county      = excluded.county,
       description = excluded.description;`,
    [
      site.id,
      site.name,
      site.type,
      site.period,
      site.latitude,
      site.longitude,
      site.county ?? null,
      site.description ?? null,
      site.isSaved ? 1 : 0,
    ]
  );
}

/**
 * Toggles whether a site is in the user's saved list and returns the new state.
 *
 * Done in a single SQL statement (`is_saved = NOT is_saved`) so the flip is
 * atomic and cannot race with another update. Returns the resulting boolean so
 * the UI can update immediately without a second query.
 */
export async function toggleSiteSaved(id: string): Promise<boolean> {
  const db = await getDatabase();
  await db.runAsync(
    "UPDATE sites SET is_saved = NOT is_saved WHERE id = ?;",
    [id]
  );

  const row = await db.getFirstAsync<{ is_saved: number }>(
    "SELECT is_saved FROM sites WHERE id = ?;",
    [id]
  );

  return row?.is_saved === 1;
}
