/**
 * Core domain model for Gallan.
 *
 * A Site represents a single physical location: a standing stone, holy well,
 * ring fort, passage tomb and so on. Everything in the app is built around this
 * shape, so it lives here on its own and is imported wherever a site is read,
 * stored or displayed. Keeping it in one place means the database layer, the map
 * and the UI can never drift out of agreement about what a site is.
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

export type SitePeriod =
  | "neolithic"
  | "bronze_age"
  | "iron_age"
  | "early_medieval"
  | "medieval"
  | "unknown";

// A single image for a site gallery. The source is a string key or path rather
// than a bundled image reference, so the data stays plain and serialisable; the
// UI resolves it to an actual image when rendering.
export interface SiteImage {
  source: string;
  caption?: string;
}

export interface Site {
  // Stable unique identifier. Used as the SQLite primary key.
  id: string;

  // Display name of the site, for example Poulnabrone Dolmen.
  name: string;

  type: SiteType;
  period: SitePeriod;

  // Location in decimal degrees (WGS84), the format Mapbox and GPS both use.
  // Stored as two plain numbers to keep the SQLite schema flat and queries simple.
  latitude: number;
  longitude: number;

  // Optional county, useful for search and filtering.
  county?: string;

  // Short summary shown in the list and at the top of the detail screen.
  description?: string;

  // Longer historical account shown on the detail screen. Written by hand per
  // site rather than generated, so the voice stays personal and accurate.
  history?: string;

  // Local legends and folklore, kept separate from the factual history so the
  // two are never confused while still giving the stories their proper place.
  folklore?: string;

  // Gallery of images for the site. Empty or absent until photos are added.
  images?: SiteImage[];

  // Optional link to an authoritative source such as the National Monuments
  // Service, so users can read more and the data can be verified.
  officialSourceUrl?: string;

  // Whether the user has saved this site. The database is the source of truth.
  isSaved: boolean;
}
