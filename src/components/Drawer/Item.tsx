import { Show, createSignal, createEffect, onMount } from "solid-js";
import { BG_COLOR_DEBUG_SAFE_AREA_TOOLTIP, SHOW_TOOLTIP_DEBUG, TOOLTIP_SPACING } from "../../data";
import { createStore } from "solid-js/store";
import Icon from "../Icons";
import type { JSX, Component } from "solid-js";
import Draggable from "../Draggable/Draggable";
import { ICON_SIZE } from "../../data/index";

type ItemProps = {
  children?: JSX.Element;
  right?: JSX.Element;
  left?: JSX.Element;
  indicator?: JSX.Element;
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

  const hasIndicator = !!props.indicator;
  const hasLeft = !!props.left;
  const hasRight = !!props.right;
  const hasChildren = !!props.children;
  const hasTooltip = !!props.tooltip;
  const withClick = !!props.showTooltipOnClick;

  const onMouseEnter = withClick ? () => {} : ([setHovering, true] as const);
  const onMouseLeave = withClick ? () => {} : ([setHovering, false] as const);
  const toggleOnClick = !withClick ? () => {} : () => setHovering((p) => !p);

  return (
    <div ref={(el) => (itemRef = el)} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={toggleOnClick}>
      <Indicator show={hasIndicator} itemRef={itemRef!}>
        {props.indicator}
      </Indicator>
      <div
        class={
          "flex items-center justify-center text-sm text-dw-150 w-full hover:bg-dw-300 hover:text-dw-100 py-2 " +
          (props.classes || "")
        }
        onClick={props.onClick}
      >
        <Left show={hasLeft}>{props.left}</Left>
        <Child show={hasChildren}>{props.children}</Child>
        <Right show={hasRight}>{props.right}</Right>

        <Tooltip when={hovering() && hasChildren && hasTooltip} itemRef={itemRef!}>
          {props.tooltip}
        </Tooltip>
      </div>
    </div>
  );
};

//#region members

type TooltipProps = {
  children?: JSX.Element;
  when: boolean;
  itemRef: HTMLDivElement;
};
const Tooltip = (props: TooltipProps) => {
  const [open, setOpen] = createSignal(false);
  const [itemSize, setItemSize] = createStore({ width: 0, height: 0 });
  const [tooltipSize, setTooltipSize] = createStore({ width: 0, height: 0 });
  const show = () => props.when || open();

  let tooltipRef: HTMLDivElement;

  createEffect(() => {
    if (show()) {
      if (props.itemRef) {
        setItemSize({ width: props.itemRef.offsetWidth, height: props.itemRef.offsetHeight });
      }
      if (tooltipRef) {
        setTooltipSize({ width: tooltipRef.offsetWidth, height: tooltipRef.offsetHeight });
      }
    }
  });

  const spacing = () => itemSize.width + tooltipSize.width / 2 - TOOLTIP_SPACING * 2;

  const offsetY = () => {
    if (tooltipSize.height <= itemSize.height) return 0;
    return itemSize.height / tooltipSize.height;
  };

  return (
    <div
      class="fixed flex transition-opacity "
      style={`transform: translate(${spacing()}px, -${offsetY()}px);`}
      classList={{ ["opacity-0"]: !show(), ["opacity-100"]: show() }}
      onMouseEnter={[setOpen, true]}
      onMouseLeave={[setOpen, false]}
      ref={(el) => (tooltipRef = el)}
    >
      <Show when={show()}>
        <div
          // SAFE AREA
          style={`
          height : ${tooltipSize.height}px;
          width: ${TOOLTIP_SPACING}px;
          pointer-events: none;
          background-color: ${BG_COLOR_DEBUG_SAFE_AREA_TOOLTIP};
        `}
          class="-z-10 grid items-center"
        >
          {/* <Icon name="caret" width={30} /> */}
        </div>
        {props.children}
      </Show>
    </div>
  );
};

type LabelProps = {
  show?: boolean;
  children: JSX.Element;
  itemRef: HTMLDivElement;
};
const Indicator = (props: LabelProps) => {
  const [itemHeight, setItemHeight] = createSignal(0);

  onMount(() => {
    if (props.itemRef && itemHeight() !== props.itemRef.offsetHeight) {
      setItemHeight(props.itemRef.offsetHeight);
    }
  });

  return (
    <Show when={props.show}>
      <label
        class="absolute right-0 text-sm text-yellow-400 font-bold"
        style={`transform: translate(2px,${(itemHeight() + 10) / 2}px);`}
      >
        {props.children}
      </label>
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
