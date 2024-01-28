import { type JSX, type Component, Show, createSignal, createEffect, onMount, on } from "solid-js";
import { BG_COLOR_DEBUG_SAFE_AREA_TOOLTIP, SHOW_TOOLTIP_DEBUG, TOOLTIP_SPACING } from "../../data";

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

    const spacing = () => itemSize().width - TOOLTIP_SPACING * 2 + TTsize().width / 2;
    const offsetY = () => {
      if (TTsize().height <= itemSize().height) return 0;
      return (TTsize().height - itemSize().height) / 2;
    };

    return (
      <div
        class="fixed flex"
        style={`transform: translate(${spacing()}px , ${offsetY()}px);`}
        classList={{ ["hidden"]: !show() }}
        onMouseEnter={[setOpen, true]}
        onMouseLeave={[setOpen, false]}
      >
        <div
          style={`height : ${itemSize().height};
             width: ${
               TOOLTIP_SPACING + 25
             }px; pointer-events: none; background-color: ${BG_COLOR_DEBUG_SAFE_AREA_TOOLTIP};`}
        >
          <div class="caret"></div>
        </div>
        <div class="h-fit bg-dw-500" style={`min-height: ${itemSize().height}px;`} ref={(el) => (tooltipRef = el)}>
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

// style={`width : 0px; height: 0px; border-top: ${
//   itemSize().height / 2
// }px solid transparent; border-right: 20px solid #1d1f25; border-bottom: ${
//   itemSize().height / 2
// }px solid transparent; transform : translate(20px, 0px);
// `}
