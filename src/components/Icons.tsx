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
  | "arrowDown"
  | "wave";

export type IconProps = {
  width: number;
  height?: number;
  name: IconNames;
  color?: string;
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
    <svg width={props.width + "px"} height={height + "px"}>
      <use href={`${spriteHref}#${props.name}`} />
    </svg>
  );
}
