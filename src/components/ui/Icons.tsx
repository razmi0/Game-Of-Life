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
  | "screen_gear"
  | "reset"
  | "eye_open"
  | "eye_closed"
  | "minus_circle"
  | "plus_circle"
  | "pen"
  | "eraser"
  | "color_picker"
  | "random"
  | "grid_square"
  | "two_by_two_squares"
  | "two_by_three_squares"
  | "arrowUp"
  | "pin"
  | "caret"
  | "arrowDown"
  | "snail"
  | "hare"
  | "stats"
  | "circle_shape"
  | "square_shape"
  | "shape_picker"
  | "painting_tools";

export type IconComponentNames = "minus_circle_FC" | "plus_circle_FC";

// | "population"
// | "spacebar"
// | "queue"

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

export type OpCircleIconProps = {
  width: number;
  height?: number;
  color?: string;
  class?: string;
  classList?: Record<string, boolean | undefined>;
  style?: string;
};

export const MinusCircleIcon = (props: OpCircleIconProps) => {
  const color = () => props.color || "#b3b3b7";
  const classNames = props.class || "";
  const style = props.style || "";
  const height = props.height || props.width;
  return (
    <svg
      width={props.width + "px"}
      height={height + "px"}
      class={classNames}
      classList={props.classList || {}}
      style={style}
      id="minus_circle"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M12 2.84952C17.0536 2.84952 21.1504 6.94633 21.1504 12C21.1504 17.0537 17.0536 21.1505 12 21.1505C6.9463 21.1505 2.84949 17.0537 2.84949 12C2.84949 6.94633 6.9463 2.84952 12 2.84952Z"
          stroke={color()}
          stroke-width="1.69904"
        ></path>
        <path d="M9.39941 12L14.5902 12" stroke={color()} stroke-width="1.69904" stroke-linecap="round"></path>
      </g>
    </svg>
  );
};

export const PlusCircleIcon = (props: OpCircleIconProps) => {
  const color = () => props.color || "#b3b3b7";
  const classNames = props.class || "";
  const style = props.style || "";
  const height = props.height || props.width;

  return (
    <svg
      width={props.width + "px"}
      height={height + "px"}
      class={classNames}
      classList={props.classList || {}}
      style={style}
      id="plus_circle"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M12 2.84952C17.0536 2.84952 21.1504 6.94633 21.1504 12C21.1504 17.0537 17.0536 21.1505 12 21.1505C6.9463 21.1505 2.84949 17.0537 2.84949 12C2.84949 6.94633 6.9463 2.84952 12 2.84952Z"
          stroke={color()}
          stroke-width="1.69904"
        ></path>
        <path d="M9.39941 12L14.5902 12" stroke={color()} stroke-width="1.69904" stroke-linecap="round"></path>
        <path d="M11.9949 9.4046L11.9949 14.5954" stroke={color()} stroke-width="1.69904" stroke-linecap="round"></path>
      </g>
    </svg>
  );
};
