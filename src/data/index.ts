/** CONSTANTS */

export const DEFAULT_PALETTE = ["#3B82F6", "#6366F1", "#EC4899", "#F59E0B"];
export const GREY_SCALED_COEF = [0.2126, 0.7152, 0.0722];
export const MAX_PALETTE_LENGTH = 7;
export const DEFAULT_RANDOMNESS = 80;
export const DEFAULT_SPEED = 10;
export const START_IMMEDIATELY = false;
export const INITIAL_CELL_SIZE = 25;
export const DEFAULT_SPACING = 2;
export const DEFAULT_GRID_COLOR = "black";
export const MIN_SPACING = 0;
export const MAX_SPACING = 10;
export const STEP_SPACING = 2;
export const QUEUE_TICKS_QUANTITY = 25;
export const INITIAL_PEN_SIZE = 3;
export const MAX_PEN_SIZE = 20;
export const MIN_PEN_SIZE = 1;
export const PEN_SIZE_STEP = 1;
export const BATTERY_REFRESH_INTERVAL = 3000;
export const MAX_DELAY = 1000;
export const MIN_DELAY = 0;
export const DELAY_STEP = 10;
export const MAX_ALIVE_RANDOM = 100 as const;
export const MIN_ALIVE_RANDOM = 0 as const;
export const RANDOM_STEP = 5 as const;
export const MIN_CELL_SIZE = 1 as const;
export const MAX_CELL_SIZE = 50 as const;
export const CELL_SIZE_STEP = 1 as const;
export const SHOW_TOOLTIP_DEBUG = false;
export const BG_COLOR_DEBUG_SAFE_AREA_TOOLTIP = "transparent"; // red
export const TOOLTIP_SPACING = 17 as const;
export const DEBOUNCING_DELAY = 80 as const;

export const ICON_SIZE = {
  xs: 15,
  sm: 20,
  md: 23,
  lg: 25,
  xl: 30,
} as const;
