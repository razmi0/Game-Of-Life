import { type Component, type JSX, Show } from "solid-js";
import Trigger from "./Trigger";

type WrapperProps = {
  children: JSX.Element | JSX.Element[];
  trigger: () => void;
  open: boolean;
};
const Wrapper: Component<WrapperProps> = (props) => {
  return (
    <Show when={props.open} fallback={<Trigger trigger={props.trigger} />}>
      <Content overlay={<></>}>{props.children}</Content>
    </Show>
  );
};

type ContentProps = {
  children: JSX.Element[] | JSX.Element;
  overlay?: JSX.Element;
};
const Content: Component<ContentProps> = (props) => {
  return (
    <div class="absolute top-0 left-0 h-full w-fit flex flex-row text-dw-100">
      <div class="h-full bg-dw-500 w-16 py-3 max-w-96">{props.children}</div>
      <Show when={props.overlay} fallback={<></>}>
        {props.overlay}
      </Show>
    </div>
  );
};

export default Wrapper;
