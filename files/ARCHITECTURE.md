# Architecture

This document explains how Gallán is organised and why. It is meant for anyone
reading the codebase for the first time, including future me.

## Guiding principle

Gallán is offline first. The device is the source of truth: the app reads and
writes a local SQLite database, and the network is only ever used to fetch map
tiles when a connection happens to be available. Every design decision below
follows from that principle.

## Layers

The code is arranged in layers, and each layer only talks to the one directly
below it. This keeps responsibilities separate and makes any single piece easy
to change or test in isolation.

```
UI (screens and components)
        │  asks for data using plain function calls
        ▼
Repository (src/lib/siteRepository.ts)
        │  decides what data operations mean for the app
        ▼
Database (src/database/database.ts)
        │  the only code that writes SQL
        ▼
SQLite (on device)
```

### UI layer

Lives in the Expo Router `app/` folder (screens) and `src/components/`
(reusable pieces). It never touches SQL or the database directly. It imports
from the repository and works only with the `Site` type.

### Repository layer — `src/lib/`

The single entry point the UI uses for data. It exposes intention revealing
functions such as `listSites` and `toggleSaved`, and it owns data related logic
that is not SQL, such as seeding the starter dataset on first run. Its job is to
let the UI depend on *what* it needs rather than *how* storage works.

### Database layer — `src/database/`

The only module that opens the database or writes SQL. It manages the
connection, creates the schema, and converts raw rows into the app's `Site`
type at the boundary. If storage ever changes, this is the only file that has
to change with it.

## Folder structure

```
app/                     Expo Router screens (the routes)
src/
  components/            Reusable UI components
  constants/             App wide config and labels
  data/                  Bundled seed dataset
  database/              SQLite connection, schema and queries
  lib/                   Repository: the UI's data entry point
  types/                 Shared TypeScript types (the domain model)
docs/                    Project documentation
```

## The domain model

Everything centres on one type, `Site`, defined in `src/types/site.ts`. It is
deliberately the only shared shape the whole app agrees on. Site type and
period are fixed unions rather than free strings, so filtering, icons and the
database can all rely on a known, closed set of values.

## Key decisions and their reasons

- **SQLite over remote storage.** The app has to work with no signal in remote
  locations, so all data lives on the device.
- **A repository layer between UI and database.** So the UI never depends on
  storage details, and storage can be changed later without touching screens.
- **Booleans stored as integers.** SQLite has no boolean type. The conversion
  is handled in one place, at the database boundary, so the rest of the app
  works with real booleans.
- **Idempotent seeding (upsert).** The starter data can be reloaded on every
  launch without creating duplicates or wiping the user's saved sites.

## Configuration and secrets

Shared configuration lives in `src/constants/config.ts`. Secrets such as the
Mapbox access token are never committed; they are provided through environment
configuration at build time and read at runtime.
