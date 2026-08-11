/**
 * Navigation type definitions.
 *
 * Declares every screen in the app and the parameters each expects, so
 * navigation is type checked: moving to a screen without its required data, or
 * with the wrong data, becomes a compile time error rather than a runtime bug.
 *
 * SitesList takes no parameters. SiteDetail requires the id of the site to show.
 */

export type RootStackParamList = {
  SitesList: undefined;
  SiteDetail: { siteId: string };
};
