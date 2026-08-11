# Gallan

Gallan is an offline first companion for exploring Ireland's sacred and ancient landscape. It brings megalithic tombs, stone circles, standing stones, holy wells, ring forts and high crosses into one app that works with no signal, which is exactly where these places tend to be. The name comes from the Irish word for a standing stone.

## Why it exists

Ireland's ancient sites are scattered, poorly signposted, and often have no phone coverage nearby. Existing map apps assume you are online. Gallan is built the other way round: the sites, their information and your saved places are all stored on the device and available offline. The long term goal is an augmented reality view where a person standing outdoors can hold up their phone and see nearby heritage sites placed in the real landscape around them.

## Features

- Offline list of heritage and sacred sites across Ireland
- Sites ranked by distance and compass direction from your current location
- A detail page for each site with room for history, local folklore, an image gallery and a link to an official source
- Save and revisit your own list of sites
- Works across phone, tablet and desktop web

## Tech stack

- React Native with Expo
- TypeScript throughout
- Expo SQLite for offline local storage
- React Navigation for moving between screens
- Expo Location for the near me feature
- Jest for unit testing

## Getting started

Clone the repository and install dependencies:

    git clone https://github.com/lydiamorgan85/gallan.git
    cd gallan
    npm install

Start the app:

    npx expo start

Then scan the QR code with the Expo Go app on your phone, or press w to open it in a browser. Some features that need a real device, such as GPS location and the offline database, fall back sensibly on web so the app can still be developed and previewed there.

## Running the tests

The core distance and direction engine is covered by unit tests:

    npm run test

## Project structure

- App.tsx sets up navigation and registers the screens
- src/screens holds the list and detail screens
- src/lib holds the domain logic: the repository, the geo engine, location and loaders
- src/database holds the SQLite connection, schema and queries
- src/data holds the bundled dataset of real Irish sites
- src/types holds the shared domain model
- docs holds the project documentation

See docs/ARCHITECTURE.md for how the project is put together and why.

## Project status

In active development as a personal project, with the aim of growing into a polished tool for exploring Ireland's heritage. Feedback and suggestions are welcome.

## Licence

MIT. See the LICENSE file.
