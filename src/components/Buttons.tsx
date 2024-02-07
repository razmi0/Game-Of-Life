import { JSXElement } from "solid-js";
import Icon, { type IconProps } from "./Icons";

type IconButtonProps = IconProps & {
  onClick: () => void;
  class?: string;
  classList?: Record<string, boolean>;
  children?: JSXElement;
};

export const IconButton = (props: IconButtonProps) => {
  return (
    <button onClick={props.onClick} class={"flex gap-2 " + props.class || ""} classList={props.classList || {}}>
      <Icon width={props.width} height={props.height} color={props.color} style={props.style} name={props.name} />
      {props.children}
    </button>
  );
};

type SimpleButtonProps = {
  handler: any;
  children: JSXElement;
  class?: string;
};
export const SimpleButton = (props: SimpleButtonProps) => {
  return (
    <button
      onClick={props.handler}
      class={`z-50 cursor-pointer w-fit h-fit py-1 px-3 rounded-sm ${props.class || ""}`} // prettier-ignore
    >
      {props.children}
    </button>
  );
};

export default IconButton;
