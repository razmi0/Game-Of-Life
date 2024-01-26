import { type Component, type JSX } from "solid-js";

export const CanvasWrapper: Component<{ children: JSX.Element }> = (props) => {
  return <div>{props.children}</div>;
};

type EventManagerProps = {
  children: JSX.Element;
  onHover?: () => void;
  onLeave?: () => void;
};
export const EventManager: Component<EventManagerProps> = (props) => {
  return (
    <div data-events onMouseEnter={props.onHover} onMouseLeave={props.onLeave}>
      {props.children}
    </div>
  );
};
