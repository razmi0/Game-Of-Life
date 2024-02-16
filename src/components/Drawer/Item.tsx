import { Show, createSignal, createEffect } from "solid-js";
import { BG_COLOR_DEBUG_SAFE_AREA_TOOLTIP, SHOW_TOOLTIP_DEBUG, TOOLTIP_SPACING } from "../../data";
import { createStore } from "solid-js/store";
import Icon from "../Icons";
import type { JSX, Component } from "solid-js";
import Draggable from "../Draggable/Draggable";
import { ICON_SIZE } from "../../data/index";
import IconButton from "../Buttons";

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

const matrixRegex = /matrix.*\((.+)\)/g;

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

type TooltipProps = {
  children?: JSX.Element;
  when: boolean;
  itemRef: HTMLDivElement;
};

const Tooltip = (props: TooltipProps) => {
  const [open, setOpen] = createSignal(false);
  const [detached, setDetached] = createSignal(false);
  const [pin, setPin] = createSignal(false);

  const [translate, setTranslate] = createStore<any>({
    formatRaw: (raw: Record<number, string>) => {
      if (!raw) return;
      const values = Object.values(raw).join("");
      const matrixRaw = values.match(/matrix.*\((.+)\)/);
      if (!matrixRaw) return;
      const matrixValues = matrixRaw[1].split(", ");
      setTranslate({ x: matrixValues[4], y: matrixValues[5] });
    },
  });

  const [itemSize, setItemSize] = createStore({ width: 0, height: 0 });
  const [tooltipSize, setTooltipSize] = createStore({ width: 0, height: 0 });

  const showAttached = () => (props.when || open()) && !detached();
  const showDetached = () => detached();

  const mouseEnter = () => {
    if (detached()) return;
    setOpen(true);
  };
  const mouseLeave = () => {
    if (detached()) return;
    console.log("detached", detached());
    setOpen(false);
  };

  // tooltip states :
  // attached / detached
  // attached => showAttached => vars ( props.when && open() mouseHovers )
  // detached => showDetached (dragged) when hasMoved => vars (pin()) detached mouseHovers are disabled
  // detached => showDetached (not dragged) when not hasMoved => vars (hasMoved() && !pin()) detached mouseHovers are disabled

  const closeTooltip = () => {
    setOpen(false);
    setPin(false);
    setDetached(false);
  };

  const triggerDrag = () => {
    setPin((p) => !p);
    setDetached(true);
  };

  let tooltipRef: HTMLDivElement;
  let debugRef: HTMLDivElement;

  createEffect(() => {
    if (showAttached()) {
      if (props.itemRef) {
        setItemSize({ width: props.itemRef.offsetWidth, height: props.itemRef.offsetHeight });
      }
      if (tooltipRef) {
        setTooltipSize({ width: tooltipRef.offsetWidth, height: tooltipRef.offsetHeight });
      }
    }
  });

  const spacing = () => Math.floor(itemSize.width + tooltipSize.width / 2 - TOOLTIP_SPACING * 2);

  const offsetY = () => {
    if (tooltipSize.height <= itemSize.height) return 0;
    return itemSize.height / tooltipSize.height;
  };

  return (
    <div
      class="fixed flex transition-opacity"
      style={`transform: translate(${spacing()}px, -${offsetY()}px);`}
      classList={{
        ["opacity-0"]: !showAttached(),
        ["opacity-100"]: showAttached() || showDetached(),
      }}
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
      ref={(el) => (tooltipRef = el)}
    >
      <Show when={showAttached() || showDetached()}>
        <Show when={!showDetached()}>
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
            <Icon name="caret" width={30} />
          </div>
        </Show>
        <Draggable
          enabled={pin()}
          reset={open()}
          /** on unmount (draggable disabled) the transform translate values are lost so we save them into translate state store */
          onDrag={() => translate.formatRaw(window.getComputedStyle(debugRef).transform)}
        >
          <div
            class="w-full bg-dw-500"
            style={`min-height: ${itemSize.height}px; transform: translate(${translate.x}px, ${translate.y}px)`}
            classList={{ ["cursor-move"]: pin() }}
            ref={(el) => {
              debugRef = el;
            }}
          >
            <div class="flex flex-row-reverse p-1">
              <IconButton
                name="close"
                width={ICON_SIZE.sm}
                class="hover:bg-dw-300 rounded-sm p-[1px] items-center justify-center"
                onClick={closeTooltip}
              />
              <IconButton
                name="drag"
                width={ICON_SIZE.sm}
                class="hover:bg-dw-300 rounded-sm p-[1px]"
                classList={{ ["bg-dw-300"]: pin() }}
                onClick={triggerDrag}
              />
            </div>
            {props.children}
          </div>
        </Draggable>
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
