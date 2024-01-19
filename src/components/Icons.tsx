import spriteHref from "/sprite.svg?url";

export type IconNames =
  | "chevron"
  | "squares"
  | "speed"
  | "shuffle"
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
  | "wave";

export interface IconProps {
  width: number;
  height: number;
  name: IconNames;
  color?: string;
}
/**
 * <svg>
 *      <defs>
 *           <symbol id="dw-icon">
 *               ...
 */
export default function Icon(props: IconProps) {
  return (
    <svg width={props.width + "px"} height={props.height + "px"}>
      <use href={`${spriteHref}#${props.name}`} />
    </svg>
  );
}
