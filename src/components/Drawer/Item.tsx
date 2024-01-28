import { type JSX, type Component, Show, createSignal, createEffect, onMount, on } from "solid-js";
import { SHOW_TOOLTIP_DEBUG } from "../../data";

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

const Item: Component<ItemProps> = (props) => {
  const [hovering, setHovering] = createSignal(SHOW_TOOLTIP_DEBUG);

  let itemRef: HTMLDivElement;

  const hasLbl = !!props.label;
  const hasLeft = !!props.left;
  const hasRight = !!props.right;
  const hasChildren = !!props.children;
  const hasTooltip = !!props.tooltip;
  const withClick = !!props.showTooltipOnClick;

  const onMouseEnter = withClick ? () => {} : ([setHovering, true] as const);
  const onMouseLeave = withClick ? () => {} : ([setHovering, false] as const);
  const toggleOnClick = !withClick ? () => {} : ([setHovering, !hovering()] as const);

  const Tooltip = (props: TooltipProps) => {
    const [open, setOpen] = createSignal(false);
    const [itemSize, setItemSize] = createSignal({ width: 0, height: 0 });
    const [TTsize, setTTsize] = createSignal({ width: 0, height: 0 });
    const show = () => (hovering() && hasTooltip) || open();

    let tooltipRef: HTMLDivElement;

    createEffect(() => {
      if (hovering() && hasTooltip) {
        if (itemRef) {
          setItemSize({ width: itemRef.offsetWidth, height: itemRef.offsetHeight });
        }
        if (tooltipRef) {
          setTTsize({ width: tooltipRef.offsetWidth, height: tooltipRef.offsetHeight });
        }
      }
    });

    const spacing = 17;

    return (
      <div
        class="fixed flex"
        style={`transform: translate(${-spacing * 2 + itemSize().width + TTsize().width / 2}px , 0px);`}
        classList={{ ["hidden"]: !show() }}
        onMouseEnter={[setOpen, true]}
        onMouseLeave={[setOpen, false]}
      >
        <div
          style={`height : ${itemSize().height};
             width: ${spacing}px; pointer-events: none; background-color: transparent;`} // itemSize().width
        ></div>
        <div
          class="h-fit py-2 px-1 bg-dw-500 visible flex place-content-center"
          style={`min-height: ${itemSize().height}px;`}
          ref={(el) => (tooltipRef = el)}
        >
          {props.children}
        </div>
      </div>
    );
  };

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={toggleOnClick} ref={(el) => (itemRef = el)}>
      <Label show={hasLbl}>{props.label}</Label>
      <div
        class={
          "flex items-center justify-center text-sm text-dw-150 w-full cursor-pointer hover:bg-dw-300 hover:text-dw-100 py-2 " +
          (props.classes || "")
        }
        onClick={props.onClick}
      >
        <Left show={hasLeft}>{props.left}</Left>
        <Child show={hasChildren}>{props.children}</Child>
        <Right show={hasRight}>{props.right}</Right>

        <Tooltip>{props.tooltip}</Tooltip>
      </div>
    </div>
  );
};
{
  /*  */
}

type TooltipProps = {
  children?: JSX.Element;
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
