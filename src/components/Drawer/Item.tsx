import type { Component, JSX, JSXElement } from "solid-js";
import { Show, createEffect, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { SHOW_TOOLTIP_DEBUG, TOOLTIP_SPACING } from "../../data";
import { ICON_SIZE } from "../../data/index";
import Icon from "../ui/Icons";

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
  staticShowOnClick?: boolean;
  yes?: boolean;
};

const Item: Component<Prettify<ItemProps>> = (props) => {
  const [hovering, setHovering] = createSignal(SHOW_TOOLTIP_DEBUG);

  let itemRef: HTMLDivElement;

  const hasIndicator = () => !!props.indicator;
  const hasLeft = () => !!props.left;
  const hasRight = () => !!props.right;
  const hasChildren = () => !!props.children;
  const hasTooltip = () => !!props.tooltip;

  const handleClick = () => {
    props.onClick && props.onClick();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      props.onClick && props.onClick();
    }
  };

  return (
    <div
      ref={(el) => (itemRef = el)}
      onMouseEnter={props.staticShowOnClick ? () => {} : ([setHovering, true] as const)}
      onMouseLeave={props.staticShowOnClick ? () => {} : ([setHovering, false] as const)}
      onClick={props.staticShowOnClick ? () => setHovering((p) => !p) : () => {}}
      class="relative"
      tabindex="0"
      role="button"
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          props.staticShowOnClick && setHovering((p) => !p);
        }
      }}
    >
      <Indicator show={hasIndicator()} itemRef={itemRef!}>
        {props.indicator}
      </Indicator>
      <div
        class={
          "relative flex items-center justify-center text-sm text-dw-150 w-full hover:bg-dw-300 hover:text-dw-100 py-2 " +
          (props.classes || "")
        }
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabindex="0"
      >
        <Left show={hasLeft()}>{props.left}</Left>
        <Child show={hasChildren()}>{props.children}</Child>
        <Right show={hasRight()}>{props.right}</Right>

        <Tooltip yes={props.yes} when={hovering() && hasChildren() && hasTooltip()} itemRef={itemRef!}>
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
  showCaret?: boolean;
  yes?: boolean;
};
const Tooltip = (props: TooltipProps) => {
  const [open, setOpen] = createSignal(false);
  const [itemSize, setItemSize] = createStore({ width: 0, height: 0 });
  const [tooltipSize, setTooltipSize] = createStore({ width: 0, height: 0 });
  const show = () => props.when || open() || props.yes;

  let tooltipRef: HTMLDivElement;

  createEffect(() => {
    if (show()) {
      if (props.itemRef && !itemSize.width && !itemSize.height)
        setItemSize({ width: props.itemRef.offsetWidth, height: props.itemRef.offsetHeight });
      if (tooltipRef && !tooltipSize.width && !tooltipSize.height)
        setTooltipSize({ width: tooltipRef.offsetWidth, height: tooltipRef.offsetHeight });
    }
  });

  const spacing = () => itemSize.width + tooltipSize.width / 2 - TOOLTIP_SPACING * 2;

  const offsetY = () => {
    if (tooltipSize.height <= itemSize.height) return 0;
    return itemSize.height / tooltipSize.height;
  };

  return (
    <div
      role="button"
      tabindex="0"
      class="fixed flex transition-opacity "
      style={{ transform: `translate(${spacing()}px, -${offsetY()}px)` }}
      classList={{ ["opacity-0"]: !show(), ["opacity-100"]: show() }}
      onMouseEnter={[setOpen, true]}
      onMouseLeave={[setOpen, false]}
      ref={(el) => (tooltipRef = el)}
    >
      <Show when={show()}>
        <SafeArea width={TOOLTIP_SPACING} height={tooltipSize.height}>
          <Show when={props.showCaret}>
            <Icon name="caret" width={ICON_SIZE.xl} />
          </Show>
        </SafeArea>
        {props.children}
      </Show>
    </div>
  );
};
type SafeAreaProps = {
  width: number;
  height: number;
  color?: string;
  children?: JSXElement;
};

const SafeArea = (props: SafeAreaProps) => {
  return (
    <div
      style={{
        height: `${props.height}px`,
        width: `${props.width}px`,
        "background-color": props.color ?? "transparent",
        "pointer-events": "none",
      }}
      class="-z-10 grid items-center"
    >
      {props.children}
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
    if (props.itemRef && itemHeight() !== props.itemRef.offsetHeight) setItemHeight(props.itemRef.offsetHeight);
  });

  return (
    <Show when={props.show}>
      <label
        class="absolute right-0 text-sm text-yellow-400 font-bold"
        style={{ transform: `translate(2px,${(itemHeight() + 10) / 2}px)` }}
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
