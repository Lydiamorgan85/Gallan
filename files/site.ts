/**
 * Core domain model for Gallán.
 *
 * A Site represents a single physical location on the map: a standing stone,
 * holy well, ring fort, passage tomb and so on. Everything in the app is built
 * around this shape, so it lives here on its own and is imported wherever a
 * site is read, stored or displayed. Keeping it in one place means the database
 * layer, the map and the UI can never drift out of agreement about what a site is.
 */

/**
 * The category of monument. Kept as a fixed union rather than a free string so
 * that filtering, icons and the database can rely on a known, closed set of
 * values. New types are added here first, deliberately, rather than appearing
 * ad hoc in the data.
 */
export type SiteType =
  | "standing_stone"
  | "stone_circle"
  | "passage_tomb"
  | "ring_fort"
  | "holy_well"
  | "high_cross"
  | "cairn"
  | "other";

/**
 * The broad archaeological period a site belongs to. Left deliberately coarse:
 * precise dating is contested for many of these sites, so the app commits only
 * to a general era rather than implying a false precision.
 */
export type SitePeriod =
  | "neolithic"
  | "bronze_age"
  | "iron_age"
  | "early_medieval"
  | "medieval"
  | "unknown";

export interface Site {
  /** Stable unique identifier. Used as the SQLite primary key. */
  id: string;

  /** Display name of the site, for example "Poulnabrone Dolmen". */
  name: string;

  type: SiteType;
  period: SitePeriod;

  /**
   * Location in decimal degrees (WGS84), the format Mapbox and GPS both use.
   * Stored as two plain numbers rather than a nested object to keep the SQLite
   * schema flat and the queries simple.
   */
  latitude: number;
  longitude: number;

  /** Optional county, useful for search and filtering. */
  county?: string;

  /** Short human readable description shown on the site detail screen. */
  description?: string;

  /**
   * Whether the current user has saved this site to their personal list.
   * Held on the site for convenience in the UI; the database is the source
   * of truth for it.
   */
  isSaved: boolean;
}
