import Icon, { type IconProps } from "./Icons";

type IconButtonProps = IconProps & {
  onClick: () => void;
  classes?: string;
};

export const IconButton = (props: IconButtonProps) => {
  return (
    <button class={props.classes} onClick={props.onClick}>
      <Icon width={props.width} height={props.height} color={props.color} name="chevron" />
    </button>
  );
};

export default IconButton;
