import { Show, createSignal, createEffect } from "solid-js";
import { BG_COLOR_DEBUG_SAFE_AREA_TOOLTIP, SHOW_TOOLTIP_DEBUG, TOOLTIP_SPACING } from "../../data";
import { createStore } from "solid-js/store";
import Icon from "../Icons";
import type { JSX, Component } from "solid-js";
import Draggable from "../Draggable/Draggable";
import { ICON_SIZE } from "../../data/index";
import IconButton from "../Buttons";
import Tooltip from "./Tooltip";

type ItemProps = {
  children?: JSX.Element;
  right?: JSX.Element;
  left?: JSX.Element;
  label?: JSX.Element;
  onClick?: () => void;
  classes?: string;
  hover?: boolean;
  onHover?: () => void;
  tooltip?: JSX.Element;
  showTooltipOnClick?: boolean;
};

const Item: Component<Prettify<ItemProps>> = (props) => {
  const [hovering, setHovering] = createSignal(SHOW_TOOLTIP_DEBUG);

  let itemRef: HTMLDivElement;

  const hasLbl = !!props.label;
  const hasLeft = !!props.left;
  const hasRight = !!props.right;
  const hasChildren = !!props.children;
  const withClick = !!props.showTooltipOnClick;

  const onMouseEnter = withClick ? () => {} : ([setHovering, true] as const);
  const onMouseLeave = withClick ? () => {} : ([setHovering, false] as const);
  const toggleOnClick = !withClick ? () => {} : () => setHovering((p) => !p);

  return (
    <div ref={(el) => (itemRef = el)} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={toggleOnClick}>
      <Label show={hasLbl}>{props.label}</Label>
      <div
        class={"flex items-center justify-center text-sm text-dw-150 cursor-pointer" + (props.classes || "")}
        onClick={props.onClick}
      >
        <Left show={hasLeft}>{props.left}</Left>
        <Child show={hasChildren}>
          <div class="hover:bg-dw-300 hover:text-dw-100 w-full h-full flex place-content-center py-2">
            {props.children}
          </div>
        </Child>
        <Right show={hasRight}>{props.right}</Right>
        <Tooltip when={hovering() && hasChildren} itemRef={itemRef!}>
          {props.tooltip}
        </Tooltip>
      </div>
    </div>
  );
};

//#region members

type LabelProps = {
  show?: boolean;
  children: JSX.Element;
};
const Label = (props: LabelProps) => {
  return (
    <Show when={props.show}>
      <label class="text-sm w-full mt-2">{props.children}</label>
    </Show>
  );
};
type RightProps = {
  show?: boolean;
  children: JSX.Element;
};
const Right = (props: RightProps) => {
  return (
    <Show when={props.show}>
      <div class="flex flex-col items-center">{props.children}</div>
    </Show>
  );
};
type LeftProps = {
  show?: boolean;
  children: JSX.Element;
};
const Left = (props: LeftProps) => {
  return <Show when={props.show}>{props.children}</Show>;
};
type ChildProps = {
  show?: boolean;
  children: JSX.Element;
};
const Child = (props: ChildProps) => {
  return <Show when={props.show}>{props.children}</Show>;
};

//#endregion members

export default Item;
