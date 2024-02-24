/** CONSTANTS */

export const DEFAULT_RANDOMNESS = 80;
export const DEFAULT_SPEED = 1000;
export const START_IMMEDIATELY = false;
export const START_CLOCKED = true;
export const INITIAL_CELL_SIZE = 25;
export const QUEUE_TICKS_QUANTITY = 25;
export const BATTERY_REFRESH_INTERVAL = 3000;
export const MAX_DELAY = 100;
export const MIN_DELAY = 0;
export const MAX_ALIVE_RANDOM = 100 as const;
export const MIN_ALIVE_RANDOM = 0 as const;
export const MIN_CELL_SIZE = 1 as const;
export const MAX_CELL_SIZE = 50 as const;
export const SHOW_TOOLTIP_DEBUG = false;
export const BG_COLOR_DEBUG_SAFE_AREA_TOOLTIP = "transparent"; // red
export const TOOLTIP_SPACING = 17 as const;

export const ICON_SIZE = {
  xs: 15,
  sm: 20,
  md: 23,
  lg: 25,
  xl: 30,
} as const;
