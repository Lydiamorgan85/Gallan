/**
 * Responsive layout helper.
 *
 * Returns layout values that adapt to the current screen width, so the same
 * screens work sensibly on a narrow phone and a wide desktop browser. Rather
 * than scatter width checks through the UI, components read these values from
 * one place. Recomputes when the window is resized (relevant on web and when a
 * tablet is rotated).
 */

import { useWindowDimensions } from "react-native";

// Above this width (in points) we treat the screen as "large" (tablet/desktop)
// and constrain content to a centred column instead of letting it stretch.
const LARGE_SCREEN_BREAKPOINT = 768;

// The widest the content column is allowed to grow on large screens, so lines
// of text and cards stay a comfortable width rather than spanning the display.
const MAX_CONTENT_WIDTH = 640;

export function useResponsiveLayout() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= LARGE_SCREEN_BREAKPOINT;

  return {
    isLargeScreen,
    // On large screens, cap the width and let margins centre it. On phones,
    // take the full width available.
    contentMaxWidth: isLargeScreen ? MAX_CONTENT_WIDTH : "100%",
  } as const;
}
