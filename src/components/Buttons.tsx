import { JSXElement } from "solid-js";
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

type SimpleButtonProps = {
  handler: any;
  children: JSXElement;
};
export const SimpleButton = (props: SimpleButtonProps) => {
  return (
    <button
      onClick={props.handler}
      class=" z-50 cursor-pointer w-fit h-fit py-2 px-3 bg-dw-500 text-dw-100 rounded-md hover:brightness-105"
    >
      {props.children}
    </button>
  );
};

export default IconButton;
