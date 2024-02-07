import { Show, createSignal, createEffect } from "solid-js";
import { BG_COLOR_DEBUG_SAFE_AREA_TOOLTIP, SHOW_TOOLTIP_DEBUG, TOOLTIP_SPACING } from "../../data";
import { createStore } from "solid-js/store";
import Icon from "../Icons";
import type { JSX, Component } from "solid-js";

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
        class={
          "flex items-center justify-center text-sm text-dw-150 w-full cursor-pointer hover:bg-dw-300 hover:text-dw-100 py-2 " +
          (props.classes || "")
        }
        onClick={props.onClick}
      >
        <Left show={hasLeft}>{props.left}</Left>
        <Child show={hasChildren}>
          <div>{props.children}</div>
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
      class="fixed flex transition-opacity"
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
          transform: translate(0px, 0px); 
        `}
          class="-z-10 grid items-center"
        >
          <Icon name="caret" width={30} />
        </div>
        <div class="w-full bg-dw-500" style={`min-height: ${itemSize.height}px `}>
          {props.children}
        </div>
      </Show>
    </div>
  );
};

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
  return (
    <Show when={props.show}>
      <div>{props.children}</div>
    </Show>
  );
};
type ChildProps = {
  show?: boolean;
  children: JSX.Element;
};
const Child = (props: ChildProps) => {
  return (
    <Show when={props.show}>
      <div>{props.children}</div>
    </Show>
  );
};

//#endregion members

export default Item;
