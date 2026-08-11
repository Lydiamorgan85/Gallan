/**
 * Device location for Gallán.
 *
 * Provides the user's current position, which the geo engine uses to work out
 * which sites are nearby and in which direction. Wraps expo-location so the
 * permission flow and the web fallback live in one place rather than inside a
 * screen.
 *
 * On a real device this asks for location permission and reads the GPS. On web,
 * which has no reliable GPS in this context, it falls back to the centre of
 * Ireland so the feature can still be developed and demonstrated in the browser.
 */

import { Platform } from "react-native";
import * as Location from "expo-location";
import type { Coordinates } from "./geo";

// A sensible default when a real position is unavailable: roughly the centre of
// Ireland, so the "near me" list still shows a spread of sites during web
// development rather than nothing.
const IRELAND_CENTRE: Coordinates = {
  latitude: 53.4129,
  longitude: -8.2439,
};

/**
 * The result of a location request. success tells the caller whether the
 * coordinates are a real device reading or the fallback, so the UI can be
 * honest about it (for example, showing a note when using the fallback).
 */
export interface LocationResult {
  coordinates: Coordinates;
  isRealLocation: boolean;
}

/**
 * Returns the user's current position.
 *
 * On web, returns the Ireland centre fallback immediately. On a device, asks
 * for permission and reads the GPS; if permission is denied or the read fails,
 * it falls back to the centre of Ireland rather than throwing, so the app keeps
 * working even without location access.
 */
export async function getCurrentLocation(): Promise<LocationResult> {
  if (Platform.OS === "web") {
    return { coordinates: IRELAND_CENTRE, isRealLocation: false };
  }

  try {
    // Ask the user to grant location access. This shows the system permission
    // dialog the first time it is called.
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      // The user declined. Fall back rather than blocking the feature.
      return { coordinates: IRELAND_CENTRE, isRealLocation: false };
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      coordinates: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      isRealLocation: true,
    };
  } catch (error) {
    // Any failure (hardware, timeout, permission quirk) falls back to the
    // centre of Ireland so the app never gets stuck waiting on location.
    console.error("Failed to read device location:", error);
    return { coordinates: IRELAND_CENTRE, isRealLocation: false };
  }
}
