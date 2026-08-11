/**
 * Starter dataset for Gallán.
 *
 * A spread of real, well known Irish heritage and sacred sites so the app has
 * substantial, genuine content on first run. Loaded into the database on
 * startup via upsertSite, so editing an entry and restarting updates the stored
 * copy without creating duplicates.
 *
 * Coordinates are approximate, intended for map display and distance sorting,
 * not survey use. Descriptions are brief and factual.
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
      "A large passage tomb in the Brú na Bóinne complex, famous for its alignment with the rising sun on the winter solstice.",
    isSaved: false,
  },
  {
    id: "knowth",
    name: "Knowth",
    type: "passage_tomb",
    period: "neolithic",
    latitude: 53.7016,
    longitude: -6.4922,
    county: "Meath",
    description:
      "A great passage tomb holding one of the largest collections of megalithic art in Western Europe.",
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
    id: "drombeg",
    name: "Drombeg Stone Circle",
    type: "stone_circle",
    period: "bronze_age",
    latitude: 51.5647,
    longitude: -9.0872,
    county: "Cork",
    description:
      "A recumbent stone circle known as the Druid's Altar, aligned with the midwinter sunset.",
    isSaved: false,
  },
  {
    id: "carrowmore",
    name: "Carrowmore",
    type: "passage_tomb",
    period: "neolithic",
    latitude: 54.2506,
    longitude: -8.5189,
    county: "Sligo",
    description:
      "One of the largest and oldest complexes of megalithic tombs in Ireland.",
    isSaved: false,
  },
  {
    id: "hill-of-tara",
    name: "Hill of Tara",
    type: "ring_fort",
    period: "iron_age",
    latitude: 53.5804,
    longitude: -6.6119,
    county: "Meath",
    description:
      "The traditional seat of the High Kings of Ireland, a ceremonial landscape of banks, mounds and standing stones.",
    isSaved: false,
  },
  {
    id: "dun-aonghasa",
    name: "Dún Aonghasa",
    type: "ring_fort",
    period: "bronze_age",
    latitude: 53.1264,
    longitude: -9.7681,
    county: "Galway",
    description:
      "A dramatic prehistoric stone fort on the edge of a cliff on Inishmore, the largest of the Aran Islands.",
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
    description:
      "A holy well associated with St Brigid, still a place of pilgrimage and prayer.",
    isSaved: false,
  },
  {
    id: "clonmacnoise",
    name: "Clonmacnoise",
    type: "high_cross",
    period: "early_medieval",
    latitude: 53.3264,
    longitude: -7.9872,
    county: "Offaly",
    description:
      "A monastic city on the Shannon, home to round towers, churches and celebrated high crosses.",
    isSaved: false,
  },
  {
    id: "monasterboice",
    name: "Monasterboice",
    type: "high_cross",
    period: "early_medieval",
    latitude: 53.7772,
    longitude: -6.4181,
    county: "Louth",
    description:
      "An early monastic site renowned for Muiredach's High Cross, among the finest in Ireland.",
    isSaved: false,
  },
  {
    id: "loughcrew",
    name: "Loughcrew Cairns",
    type: "cairn",
    period: "neolithic",
    latitude: 53.7442,
    longitude: -7.1119,
    county: "Meath",
    description:
      "A hilltop group of passage tombs and cairns, some aligned with the equinox sunrise.",
    isSaved: false,
  },
  {
    id: "beaghmore",
    name: "Beaghmore Stone Circles",
    type: "stone_circle",
    period: "bronze_age",
    latitude: 54.6947,
    longitude: -6.9394,
    county: "Tyrone",
    description:
      "A complex of stone circles, rows and cairns on the edge of the Sperrin Mountains.",
    isSaved: false,
  },
  {
    id: "turoe-stone",
    name: "Turoe Stone",
    type: "standing_stone",
    period: "iron_age",
    latitude: 53.2333,
    longitude: -8.5833,
    county: "Galway",
    description:
      "A granite standing stone carved in flowing La Tène Celtic style, among the finest of its kind.",
    isSaved: false,
  },
  {
    id: "ardgroom",
    name: "Ardgroom Stone Circle",
    type: "stone_circle",
    period: "bronze_age",
    latitude: 51.7333,
    longitude: -9.8833,
    county: "Cork",
    description:
      "A stone circle on the Beara Peninsula with fine views over the surrounding landscape.",
    isSaved: false,
  },
];
