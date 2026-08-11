# Near me: finding sites around the user

This document explains how Gallán shows the sites nearest to the user, covering
src/lib/location.ts and how it combines with the geo engine.

## What it does

On launch the app reads the user's position, then ranks every site by distance
from that position, showing each with how far away it is and the compass
direction to reach it. This is the foundation of the planned map and augmented
reality views, which use the same position and calculations presented visually.

## How location is read

src/lib/location.ts wraps the device GPS behind a single function. On a real
device it requests location permission and reads the current position. On web,
which has no reliable GPS here, and any time permission is denied or the read
fails, it falls back to the centre of Ireland. It never throws: the app always
receives usable coordinates, and a flag tells the UI whether they are real or
the fallback so it can be honest with the user.

## How ranking works

The coordinates are passed to the geo engine (see LOCATION-ENGINE.md), which
returns every site annotated with distance and bearing, sorted nearest first.
The screen formats these for display: metres when very close, kilometres
otherwise, alongside an eight-point compass direction.

## Permission and privacy

Location is requested only when the app needs it, and only foreground access is
used. If the user declines, the app still works using the fallback position;
location is never required to use the app.

## Testing across platforms

The fallback makes the feature fully developable in the web preview, where it
measures from the centre of Ireland. Real, user-relative distances require
running on a device with location enabled.
