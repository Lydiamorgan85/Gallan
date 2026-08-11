# Architecture

This document explains how Gallán is organised and why. It is the single source of truth for the project structure and is kept up to date as features land.

## What Gallán is

Gallán is an offline first companion for exploring Ireland's sacred and ancient landscape: megalithic tombs, stone circles, standing stones, holy wells, ring forts and high crosses. The long term goal is an augmented reality experience where a person outdoors can hold up their phone and see nearby heritage sites placed in the real landscape around them.

## Guiding principle

The app is offline first. The device is the source of truth: it reads and writes a local SQLite database, and the network is only ever used for map tiles when a connection happens to be available. This matters because most of these sites are in remote places with no signal.

## Layers

Each layer only talks to the one below it, which keeps responsibilities separate and each piece easy to change or test on its own.

- UI: screens and components, ask for data and calculations
- Domain logic (src/lib): repository, geo engine, platform-safe loaders
- Database (src/database): the only code that writes SQL
- SQLite: on device storage

## Folder structure

- App.tsx: app entry point and current screen
- index.ts: registers the app with Expo
- src/components: reusable UI components
- src/constants: app wide config and labels
- src/data: bundled seed dataset of real Irish sites
- src/database: SQLite connection, schema and queries
- src/lib: domain logic, the repository, geo engine and loaders
- src/types: shared TypeScript types (the domain model)
- docs: project documentation

## The domain model

Everything centres on one type, Site, defined in src/types/site.ts. Site type and period are fixed unions rather than free strings, so filtering, icons and the database can all rely on a known, closed set of values.

## Key modules

- Database (src/database/database.ts): the only module that opens the database or writes SQL. Manages the connection, creates the schema, and converts raw rows into the Site type at the boundary.
- Repository (src/lib/siteRepository.ts): the app's single entry point for site data, and the home of the startup seeding. Lets the UI depend on what it needs rather than how storage works.
- Geo engine (src/lib/geo.ts): distance and direction between the user and each site. Pure calculation with no device dependency, so it runs and can be tested anywhere. The near me list, the map and the planned AR view all build on it. See LOCATION-ENGINE.md.
- Platform-safe loading (src/lib/loadSites.ts): reads sites from the database on a device, or from bundled seed data on web, since SQLite does not run in a browser. Keeps the web preview working for UI development.
- Responsive layout (src/lib/useResponsiveLayout.ts): adapts the layout so the app works across phone, tablet and desktop, constraining content to a centred column on wide screens.

## Platform support

The app targets phones first, but runs on tablets and desktop web too. Two deliberate accommodations make this work:

- SQLite is native only, so on web the app falls back to reading the bundled seed data. Features that require the database are guarded by a platform check.
- Layout is width-responsive rather than assuming a phone-sized screen.

## Key decisions and their reasons

- SQLite over remote storage: the app must work with no signal, so all data lives on the device.
- A repository layer between UI and database: so the UI never depends on storage details and storage can change without touching screens.
- A standalone geo engine: so the distance and direction logic is tested once and reused by every location feature rather than reimplemented per screen.
- Booleans stored as integers: SQLite has no boolean type; the conversion is handled in one place at the database boundary.
- Idempotent seeding (upsert): the starter data can be reloaded on every launch without creating duplicates or wiping the user's saved sites.

## Roadmap

The project is being built in layers so there is always a working app to show, and each layer is a real step towards the augmented reality goal:

1. Offline data layer and site list. Done.
2. Responsive layout and expanded real dataset. Done.
3. Geo engine for distance and direction. Done.
4. Sites near me, using the device's GPS.
5. Map view of nearby sites around the user's position.
6. AR camera view with sites placed in the live landscape.

## Configuration and secrets

Shared configuration lives in src/constants/config.ts. Secrets such as the Mapbox access token are never committed; they are provided through environment configuration at build time and read at runtime.
