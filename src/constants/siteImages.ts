/**
 * Bundled site imagery and attribution.
 *
 * React Native resolves bundled images at build time, so each file must be
 * referenced with a static require rather than a dynamic path. This module is
 * the one place that does that, mapping a site id to its image. Screens look
 * images up by id here.
 *
 * All images are sourced from Wikimedia Commons under Creative Commons licences.
 * Author and licence details are recorded per site and must be shown with the
 * image to satisfy the licence terms; these are filled in as they are gathered.
 */

import type { ImageSourcePropType } from "react-native";

export interface BundledImage {
  source: ImageSourcePropType;
  author: string;
  licence: string;
}

// Site id to bundled image. The id on the left must match the site id in the
// seed data; the file on the right is the actual file saved under assets/sites.
export const SITE_IMAGES: Record<string, BundledImage> = {
  poulnabrone: {
    source: require("../../assets/sites/poulnabrone.jpg"),
    author: "Bernard Gagnon",
    licence: "CC BY-SA 4.0",
  },
  "turoe-stone": {
    source: require("../../assets/sites/turoe.jpg"),
    author: "Dirk Huth",
    licence: "CC BY-SA 3.0",
  },
  clonmacnoise: {
    source: require("../../assets/sites/clonmacnoise.jpg"),
    author: "Berthold Werner",
    licence: "CC BY-SA 4.0",
  },
  newgrange: {
    source: require("../../assets/sites/newgrange.jpg"),
    author: "",
    licence: "",
  },
  knowth: {
    source: require("../../assets/sites/Knowth.jpg"),
    author: "",
    licence: "",
  },
  "grange-lough-gur": {
    source: require("../../assets/sites/GrangeStoneCircle.jpg"),
    author: "",
    licence: "",
  },
  drombeg: {
    source: require("../../assets/sites/Drombeg_stone_circle.jpg"),
    author: "",
    licence: "",
  },
  carrowmore: {
    source: require("../../assets/sites/carrowmore.jpg"),
    author: "",
    licence: "",
  },
  "hill-of-tara": {
    source: require("../../assets/sites/hilloftara.jpg"),
    author: "",
    licence: "",
  },
  monasterboice: {
    source: require("../../assets/sites/Monasterboice.jpg"),
    author: "",
    licence: "",
  },
  loughcrew: {
    source: require("../../assets/sites/Loughcrew_Cairn_in_snow.jpg"),
    author: "",
    licence: "",
  },
  beaghmore: {
    source: require("../../assets/sites/Beaghmore.jpg"),
    author: "",
    licence: "",
  },
  ardgroom: {
    source: require("../../assets/sites/Ardgroom_stone_circle.jpg"),
    author: "",
    licence: "",
  },
};
