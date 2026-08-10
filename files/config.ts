/**
 * App wide configuration values.
 *
 * Constants that more than one part of the app needs to agree on live here, so
 * there is a single place to change them. Anything secret (API tokens and the
 * like) does not belong in this file; those are read from environment config at
 * runtime so they are never committed to the repository.
 */

/**
 * Default map centre and zoom, set to roughly the middle of Ireland so the
 * whole island is in view when the map first opens, before the user's location
 * is known.
 */
export const DEFAULT_MAP_REGION = {
  latitude: 53.4129,
  longitude: -8.2439,
  zoom: 6,
} as const;

/**
 * Human readable labels for each site type, used wherever a type is shown in
 * the UI. Kept next to the type union it describes so that adding a new site
 * type is a two line change in known places rather than a hunt through the app.
 */
export const SITE_TYPE_LABELS: Record<string, string> = {
  standing_stone: "Standing Stone",
  stone_circle: "Stone Circle",
  passage_tomb: "Passage Tomb",
  ring_fort: "Ring Fort",
  holy_well: "Holy Well",
  high_cross: "High Cross",
  cairn: "Cairn",
  other: "Other",
};
