/**
 * Starter dataset for Gallán.
 *
 * A small set of real, well known Irish sites so the app has something to show
 * on first run before a larger dataset is wired in. Loaded into the database on
 * startup via upsertSite, so editing an entry and restarting updates the stored
 * copy without creating duplicates.
 *
 * Coordinates are approximate and intended for map display, not survey use.
 */

import type { Site } from "../types/site";

export const SEED_SITES: Site[] = [
  {
    id: "poulnabrone",
    name: "Poulnabrone Dolmen",
    type: "passage_tomb",
    period: "neolithic",
    latitude: 53.0489,
    longitude: -9.1401,
    county: "Clare",
    description:
      "A portal tomb on the limestone pavement of the Burren, one of Ireland's most recognisable megalithic monuments.",
    isSaved: false,
  },
  {
    id: "newgrange",
    name: "Newgrange",
    type: "passage_tomb",
    period: "neolithic",
    latitude: 53.6947,
    longitude: -6.4755,
    county: "Meath",
    description:
      "A large passage tomb famous for its alignment with the rising sun on the winter solstice.",
    isSaved: false,
  },
  {
    id: "grange-lough-gur",
    name: "Grange Stone Circle",
    type: "stone_circle",
    period: "bronze_age",
    latitude: 52.5122,
    longitude: -8.5386,
    county: "Limerick",
    description: "The largest stone circle in Ireland, on the shores of Lough Gur.",
    isSaved: false,
  },
  {
    id: "st-brigids-well-kildare",
    name: "St Brigid's Well",
    type: "holy_well",
    period: "early_medieval",
    latitude: 53.1547,
    longitude: -6.9236,
    county: "Kildare",
    description: "A holy well associated with St Brigid, still a place of pilgrimage.",
    isSaved: false,
  },
];
