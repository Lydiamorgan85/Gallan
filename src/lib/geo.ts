/**
 * Location and distance utilities for Gallán.
 *
 * The foundation of the app's "near me" experience: given the user's position
 * and a set of sites, work out how far away each one is and in which direction.
 * The map view and, later, the AR camera view both build on these calculations,
 * so the logic lives here in one tested place rather than inside any screen.
 *
 * All angles are in degrees; all distances are in kilometres.
 */

import type { Site } from "../types/site";

/** A simple latitude/longitude pair, as returned by the device's GPS. */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/** A site paired with how far away it is and the compass bearing to reach it. */
export interface SiteWithDistance {
  site: Site;
  /** Straight line distance from the user, in kilometres. */
  distanceKm: number;
  /** Compass bearing from the user to the site, 0-360 degrees (0 = north). */
  bearingDegrees: number;
  /** Human readable compass direction, for example "NE". */
  compassDirection: string;
}

// The Earth's mean radius in kilometres, used by the distance calculation.
const EARTH_RADIUS_KM = 6371;

// Converts degrees to radians. The trigonometry functions work in radians, but
// coordinates and bearings are far easier to reason about in degrees, so we
// convert at the boundaries.
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Distance between two points on the Earth's surface, using the haversine
 * formula. Haversine treats the Earth as a sphere, which is accurate to well
 * within the precision this app needs (metres over tens of kilometres).
 */
export function distanceBetween(from: Coordinates, to: Coordinates): number {
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);

  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);

  // a is the square of half the chord length between the points.
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  // c is the angular distance in radians; multiply by the radius for kilometres.
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * Initial compass bearing from one point to another, in degrees (0 = north,
 * 90 = east). This is the direction the user would face to walk in a straight
 * line towards the site, which the AR view will later use to place its marker.
 */
export function bearingBetween(from: Coordinates, to: Coordinates): number {
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const dLon = toRadians(to.longitude - from.longitude);

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  // atan2 returns -180..180; normalise into a 0..360 compass bearing.
  const bearing = toDegrees(Math.atan2(y, x));
  return (bearing + 360) % 360;
}

// The eight compass points, in clockwise order starting from north. Used to
// turn a precise bearing into a direction a person can read at a glance.
const COMPASS_POINTS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;

/**
 * Converts a bearing in degrees to the nearest of the eight compass points.
 * Each point covers a 45 degree slice; adding half a slice before dividing
 * rounds to the nearest rather than always rounding down.
 */
export function bearingToCompass(bearingDegrees: number): string {
  const index = Math.round(bearingDegrees / 45) % 8;
  return COMPASS_POINTS[index];
}

/**
 * Given the user's position and a list of sites, returns those sites annotated
 * with distance and direction, sorted nearest first. This is the single call a
 * screen makes to power a "near me" view.
 */
export function sitesByDistance(
  userLocation: Coordinates,
  sites: Site[]
): SiteWithDistance[] {
  return sites
    .map((site) => {
      const target: Coordinates = {
        latitude: site.latitude,
        longitude: site.longitude,
      };
      const bearingDegrees = bearingBetween(userLocation, target);
      return {
        site,
        distanceKm: distanceBetween(userLocation, target),
        bearingDegrees,
        compassDirection: bearingToCompass(bearingDegrees),
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);
}
