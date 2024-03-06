import { JSXElement } from "solid-js";
import Icon, { type IconProps } from "./Icons";
import Separator from "./Drawer/Separator";

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
    <>
      <button
        onClick={props.handler}
        class={`cursor-pointer py-1 px-3 whitespace-nowrap rounded-sm bg-dw-300 hover:bg-dw-200 ${props.class || ""}`} // prettier-ignore
      >
        {props.children}
      </button>
    </>
  );
};

export default IconButton;
