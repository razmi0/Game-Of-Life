import spriteHref from "/sprite.svg?url";

type IconNames = "dw-icon" | "chevron" | "squares" | "plus";
type IconProps = {
  width: number;
  height: number;
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
  return (
    <svg width={props.width + "px"} height={props.height + "px"}>
      <use href={`${spriteHref}#${props.name}`} />
    </svg>
  );
}
