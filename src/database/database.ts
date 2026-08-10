/**
 * Offline storage layer for Gallán.
 *
 * This module owns the SQLite database and is the only place in the app that
 * talks to it directly. Screens ask this module for data; they never open the
 * database or write SQL themselves. That boundary keeps storage details in one
 * file, so if the schema or storage engine changes later, nothing outside this
 * file has to change.
 */

import * as SQLite from "expo-sqlite";
import type { Site, SiteType, SitePeriod } from "../types/site";

const DATABASE_NAME = "gallan.db";

// Cached after the first call. Opening a connection is not free, so we open
// once and reuse it for the life of the app.
let database: SQLite.SQLiteDatabase | null = null;

// The shape of a row as SQLite returns it. Differs from Site on purpose:
// SQLite has no boolean, so is_saved comes back as an integer.
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

// Opens the database if needed and ensures the schema exists. Safe to call
// repeatedly: after the first call it returns the cached handle.
async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (database) {
    return database;
  }
  database = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await initialiseSchema(database);
  return database;
}

// Creates the sites table if it does not already exist. IF NOT EXISTS makes
// this idempotent, so running it on every app start is harmless.
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

// The single point where SQLite integer-for-boolean is turned back into a real
// boolean, and null columns become optional fields.
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

// Returns every site, ordered by name. Returns an empty array rather than
// throwing when there is no data, so callers can render a clean empty state.
export async function getAllSites(): Promise<Site[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<SiteRow>("SELECT * FROM sites ORDER BY name;");
  return rows.map(rowToSite);
}

// Returns a single site by id, or null if none exists.
export async function getSiteById(id: string): Promise<Site | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<SiteRow>("SELECT * FROM sites WHERE id = ?;", [id]);
  return row ? rowToSite(row) : null;
}

// Inserts a site, or updates it if one with the same id exists (an upsert).
// is_saved is left out of the update so re-seeding never wipes a saved flag.
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

// Toggles whether a site is saved and returns the new state. Done in one SQL
// statement so the flip is atomic and cannot race with another update.
export async function toggleSiteSaved(id: string): Promise<boolean> {
  const db = await getDatabase();
  await db.runAsync("UPDATE sites SET is_saved = NOT is_saved WHERE id = ?;", [id]);
  const row = await db.getFirstAsync<{ is_saved: number }>(
    "SELECT is_saved FROM sites WHERE id = ?;",
    [id]
  );
  return row?.is_saved === 1;
}
