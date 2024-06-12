import type { Component, JSX } from "solid-js";
import { Show } from "solid-js";

type HeaderProps = {
  children?: JSX.Element;
};
const Header: Component<HeaderProps> = (props) => {
  return <div class="flex place-content-center mb-10">{props.children}</div>;
};

type ToolTipTitleProps = {
  title: string;
  keyCmd?: string;
  class?: string;
};
export const TooltipTitle = (props: ToolTipTitleProps) => (
  <div class={`flex flex-row items-center justify-between w-full ${props.class || ""}`}>
    <div>{props.title}</div>
    <Show when={props.keyCmd}>
      <div class="text-3xs flex text-dw-100 gap-1 items-center">{props.keyCmd}</div>
    </Show>
  </div>
);

export default Header;
