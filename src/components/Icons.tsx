import spriteHref from "/sprite.svg?url";

export type IconNames =
  | "chevron"
  | "squares"
  | "speed"
  | "shuffle"
  | "baby"
  | "plus"
  | "minus"
  | "skull"
  | "heart"
  | "gear"
  | "play"
  | "pause"
  | "speed"
  | "clock"
  | "controls"
  | "range"
  | "screen_gear"
  | "reset"
  | "minus_circle"
  | "plus_circle"
  | "pen"
  | "eraser"
  | "color_picker"
  | "population"
  | "random"
  | "queue"
  | "grid_square"
  | "two_by_two_squares"
  | "two_by_three_squares"
  | "arrowUp"
  | "pin"
  | "caret"
  | "spacebar"
  | "arrowDown"
  | "snail"
  | "hare"
  | "stats"
  | "painting_tools";

export type IconProps = {
  width: number;
  height?: number;
  name: IconNames;
  color?: string;
  class?: string;
  style?: string;
};
/**
 * <svg>
 *      <defs>
 *           <symbol id="dw-icon">
 *               ...
 */
export default function Icon(props: IconProps) {
  const height = props.height || props.width;
  return (
    <svg width={props.width + "px"} height={height + "px"} class={props.class ?? ""} style={props.style ?? ""}>
      <use href={`${spriteHref}#${props.name}`} />
    </svg>
  );
}
