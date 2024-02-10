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
  | "range"
  | "reset"
  | "population"
  | "random"
  | "queue"
  | "arrowUp"
  | "pin"
  | "caret"
  | "arrowDown"
  | "snail"
  | "hare"
  | "wave";

export type IconProps = {
  width: number;
  height?: number;
  name: IconNames;
  color?: string;
  class?: string;
  style?: string;
  classList?: Record<string, boolean>;
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
    <svg
      width={props.width + "px"}
      height={height + "px"}
      class={props.class ?? ""}
      style={props.style ?? ""}
      classList={props.classList ?? { [""]: false }}
    >
      <use href={`${spriteHref}#${props.name}`} />
    </svg>
  );
}
