# Architecture

This document explains how Gallan is organised and why. It is the single source of truth for the project structure and is kept up to date as features land.

## What Gallan is

Gallan is an offline first companion for exploring Ireland's sacred and ancient landscape: megalithic tombs, stone circles, standing stones, holy wells, ring forts and high crosses. The long term goal is an augmented reality experience where a person outdoors can hold up their phone and see nearby heritage sites placed in the real landscape around them.

## Guiding principle

The app is offline first. The device is the source of truth: it reads and writes a local SQLite database, and the network is only ever used for map tiles when a connection happens to be available. This matters because most of these sites are in remote places with no signal.

## Layers

Each layer only talks to the one below it, which keeps responsibilities separate and each piece easy to change or test on its own.

- Screens: the list and detail screens, connected by navigation
- Domain logic (src/lib): repository, geo engine, location, platform-safe loaders
- Database (src/database): the only code that writes SQL
- SQLite: on device storage

## Folder structure

- App.tsx: sets up navigation and registers the screens
- index.ts: registers the app with Expo
- src/screens: the sites list screen and the site detail screen
- src/navigation: navigation type definitions
- src/components: reusable UI components
- src/constants: app wide config and labels
- src/data: bundled seed dataset of real Irish sites
- src/database: SQLite connection, schema and queries
- src/lib: domain logic, the repository, geo engine, location and loaders
- src/types: shared TypeScript types (the domain model)
- docs: project documentation

## The domain model

Everything centres on one type, Site, defined in src/types/site.ts. It carries the essentials (name, type, period, location) and the richer content each site can hold: a short description, a longer history, local folklore, an image gallery and a link to an official source. Site type and period are fixed unions rather than free strings, so filtering, icons and the database can all rely on a known, closed set of values. The richer content fields are optional, so a site is valid with only its basics and can be enriched over time.

## Screens and navigation

The app uses React Navigation with a simple stack of two screens. The sites list is the home screen, showing every site ranked by distance and direction from the user. Tapping a site pushes the detail screen, which shows that site's full record: summary, history, folklore, image gallery and source link, with each section appearing only when the site has that content. A back button returns to the list. Navigation is type checked, so a screen cannot be opened without the data it requires.

## Key modules

- Database (src/database/database.ts): the only module that opens the database or writes SQL. Manages the connection, creates the schema, and converts raw rows into the Site type at the boundary.
- Repository (src/lib/siteRepository.ts): the app's single entry point for site data, and the home of the startup seeding. Lets the UI depend on what it needs rather than how storage works.
- Geo engine (src/lib/geo.ts): distance and direction between the user and each site. Pure calculation with no device dependency, so it runs and can be tested anywhere. Covered by unit tests. See LOCATION-ENGINE.md.
- Location (src/lib/location.ts): reads the device GPS with a fallback to the centre of Ireland on web or when permission is denied, so the app always has usable coordinates. See NEAR-ME.md.
- Platform-safe loading (src/lib/loadSites.ts): reads sites from the database on a device, or from bundled seed data on web, since SQLite does not run in a browser.
- Responsive layout (src/lib/useResponsiveLayout.ts): adapts the layout so the app works across phone, tablet and desktop, constraining content to a centred column on wide screens.

## Platform support

The app targets phones first, but runs on tablets and desktop web too. Two deliberate accommodations make this work: SQLite is native only, so on web the app falls back to reading the bundled seed data, with database features guarded by a platform check; and layout is width-responsive rather than assuming a phone-sized screen.

## Testing

The core distance and direction engine is covered by unit tests using Jest, run with npm run test. Because that engine is pure calculation with no device dependencies, it can be tested in isolation, which is why the project's testing effort starts there: it is both the easiest to test and the most important to get right, since every location feature depends on it.

## Key decisions and their reasons

- SQLite over remote storage: the app must work with no signal, so all data lives on the device.
- A repository layer between UI and database: so the UI never depends on storage details and storage can change without touching screens.
- A standalone, tested geo engine: so the distance and direction logic is proven once and reused by every location feature rather than reimplemented per screen.
- Optional richer content fields: so a site is valid with only its basics and can be enriched with history, folklore and images over time.
- Booleans stored as integers: SQLite has no boolean type; the conversion is handled in one place at the database boundary.
- Idempotent seeding (upsert): the starter data can be reloaded on every launch without creating duplicates or wiping the user's saved sites.

## Roadmap

The project is built in layers so there is always a working app to show, and each layer is a real step towards the augmented reality goal:

1. Offline data layer and site list. Done.
2. Responsive layout and expanded real dataset. Done.
3. Geo engine for distance and direction, with unit tests. Done.
4. Sites near me, using the device GPS. Done.
5. Navigation and a site detail screen for rich content. Done.
6. Real content added per site: history, folklore, images and sources.
7. Map view of nearby sites around the user's position.
8. AR camera view with sites placed in the live landscape.

## Configuration and secrets

Shared configuration lives in src/constants/config.ts. Secrets such as the Mapbox access token are never committed; they are provided through environment configuration at build time and read at runtime.
