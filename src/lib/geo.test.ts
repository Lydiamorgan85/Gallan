/**
 * Tests for the geo engine (src/lib/geo.ts).
 *
 * These cover the pure distance, bearing and compass calculations that every
 * location feature depends on. Expected values are worked out from known
 * geography, with a tolerance where appropriate since the calculations are
 * approximate by nature. Coordinates used here are well known Irish cities.
 */

import {
  distanceBetween,
  bearingBetween,
  bearingToCompass,
  sitesByDistance,
} from "./geo";
import type { Site } from "../types/site";

// Reference points used across the tests.
const DUBLIN = { latitude: 53.3498, longitude: -6.2603 };
const GALWAY = { latitude: 53.2707, longitude: -9.0568 };
const CORK = { latitude: 51.8985, longitude: -8.4756 };

describe("distanceBetween", () => {
  it("returns zero for the same point", () => {
    expect(distanceBetween(DUBLIN, DUBLIN)).toBeCloseTo(0, 5);
  });

  it("measures Dublin to Galway at roughly 187 km", () => {
    // Real straight line distance is about 187 km. A tolerance is allowed
    // because the calculation treats the Earth as a sphere.
    const distance = distanceBetween(DUBLIN, GALWAY);
    expect(distance).toBeGreaterThan(180);
    expect(distance).toBeLessThan(195);
  });

  it("is symmetric: A to B equals B to A", () => {
    const there = distanceBetween(DUBLIN, CORK);
    const back = distanceBetween(CORK, DUBLIN);
    expect(there).toBeCloseTo(back, 5);
  });
});

describe("bearingBetween", () => {
  it("points roughly west from Dublin to Galway", () => {
    // Galway is west and slightly south of Dublin, so the bearing sits in the
    // western arc, near 270 degrees.
    const bearing = bearingBetween(DUBLIN, GALWAY);
    expect(bearing).toBeGreaterThan(240);
    expect(bearing).toBeLessThan(290);
  });

  it("points roughly south from Dublin to Cork", () => {
    // Cork is south and a little west of Dublin, so the bearing sits in the
    // southern arc, near 200 degrees.
    const bearing = bearingBetween(DUBLIN, CORK);
    expect(bearing).toBeGreaterThan(180);
    expect(bearing).toBeLessThan(230);
  });

  it("always returns a value between 0 and 360", () => {
    const bearing = bearingBetween(CORK, DUBLIN);
    expect(bearing).toBeGreaterThanOrEqual(0);
    expect(bearing).toBeLessThan(360);
  });
});

describe("bearingToCompass", () => {
  it("maps the four cardinal directions correctly", () => {
    expect(bearingToCompass(0)).toBe("N");
    expect(bearingToCompass(90)).toBe("E");
    expect(bearingToCompass(180)).toBe("S");
    expect(bearingToCompass(270)).toBe("W");
  });

  it("rounds to the nearest compass point", () => {
    // 44 degrees is just under halfway between N and E, so it rounds to NE.
    expect(bearingToCompass(44)).toBe("NE");
    // 359 degrees is almost due north, so it wraps back to N.
    expect(bearingToCompass(359)).toBe("N");
  });
});

describe("sitesByDistance", () => {
  // A small set of fake sites at the reference points, enough to check ordering.
  const sites: Site[] = [
    {
      id: "cork",
      name: "Cork Site",
      type: "other",
      period: "unknown",
      latitude: CORK.latitude,
      longitude: CORK.longitude,
      isSaved: false,
    },
    {
      id: "galway",
      name: "Galway Site",
      type: "other",
      period: "unknown",
      latitude: GALWAY.latitude,
      longitude: GALWAY.longitude,
      isSaved: false,
    },
  ];

  it("sorts sites nearest first relative to the user", () => {
    // Standing in Galway, the Galway site must come before the Cork site.
    const ranked = sitesByDistance(GALWAY, sites);
    expect(ranked[0].site.id).toBe("galway");
    expect(ranked[1].site.id).toBe("cork");
  });

  it("annotates each site with a distance and a compass direction", () => {
    const ranked = sitesByDistance(DUBLIN, sites);
    for (const entry of ranked) {
      expect(entry.distanceKm).toBeGreaterThan(0);
      expect(typeof entry.compassDirection).toBe("string");
    }
  });
});
