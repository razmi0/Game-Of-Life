import { Component, JSX, Show } from "solid-js";
import Trigger from "./Trigger";
import Overlay from "./Overlay";

type WrapperProps = {
  children: JSX.Element | JSX.Element[];
  trigger: () => void;
  open: boolean;
  ref: HTMLDivElement;
};

const Wrapper: Component<WrapperProps> = (props) => {
  return (
    <Show when={props.open} fallback={<Trigger trigger={props.trigger} />}>
      <Content ref={props.ref} overlay={<Overlay />}>
        {props.children}
      </Content>
    </Show>
  );
};

type ContentProps = {
  children: JSX.Element[] | JSX.Element;
  ref: HTMLDivElement;
  overlay: JSX.Element;
};
const Content: Component<ContentProps> = (props) => {
  return (
    <div class="absolute top-0 h-full w-full flex flex-row text-dw-100">
      <div ref={props.ref} class="h-full bg-dw-500 w-1/3 py-3 pe-2 ps-3">
        {props.children}
      </div>
      {props.overlay}
    </div>
  );
};

export default Wrapper;
