/**
 * Core domain model for Gallán.
 *
 * A Site represents a single physical location on the map: a standing stone,
 * holy well, ring fort, passage tomb and so on. Everything in the app is built
 * around this shape, so it lives here on its own and is imported wherever a
 * site is read, stored or displayed.
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

export interface Site {
  /** Stable unique identifier. Used as the SQLite primary key. */
  id: string;
  /** Display name, for example "Poulnabrone Dolmen". */
  name: string;
  type: SiteType;
  period: SitePeriod;
  /** Location in decimal degrees (WGS84), the format Mapbox and GPS both use. */
  latitude: number;
  longitude: number;
  county?: string;
  description?: string;
  /** Whether the user has saved this site to their personal list. */
  isSaved: boolean;
}
