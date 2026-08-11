# Location and distance engine

This document explains how Gallán works out which sites are near the user and in
what direction. It covers the code in `src/lib/geo.ts`, which is the foundation
the "near me" list, the map view and the planned AR camera view all build on.

## What it does

Given the user's current position and the list of sites, the engine answers two
questions for every site:

- How far away is it, in kilometres?
- In which direction does the user need to face to reach it?

It then returns the sites sorted nearest first, each annotated with a distance,
a precise bearing in degrees, and a plain compass direction such as "NE".

## How distance is calculated

Distance uses the haversine formula, which measures the straight line distance
between two points on the surface of a sphere. The Earth is not a perfect
sphere, but for the distances this app deals with (metres up to tens of
kilometres) the error is far smaller than the accuracy of a phone's GPS, so the
simplicity is well worth it.

## How direction is calculated

Direction uses the initial bearing between two coordinates: the compass heading
the user would set off on to walk in a straight line to the site. It is returned
both as a precise angle in degrees (0 = north, 90 = east) and rounded to the
nearest of eight compass points for easy reading. The precise angle is what the
AR view will later use to place a marker in the correct spot on screen.

## Why it lives on its own

The engine is pure calculation with no dependency on the device, the database or
the UI. That means it runs anywhere, including the web preview, and can be
reasoned about and tested in isolation. Keeping it separate from any screen is a
deliberate decision: the map and AR features will both call the same tested
logic rather than each reimplementing it.

## Units and conventions

- Distances are in kilometres.
- Angles are in degrees, with north as 0 and increasing clockwise.
- Coordinates are decimal degrees (WGS84), the format GPS and Mapbox both use.

## Accuracy note

Site coordinates in the seed data are approximate, suitable for map display and
distance sorting. For a production dataset each site should be verified against
an authoritative source such as the National Monuments Service.
