import { createEffect, createSignal, For, Show } from "solid-js";
import { BG_COLOR_DEBUG_SAFE_AREA_TOOLTIP, TOOLTIP_SPACING, ICON_SIZE } from "../../data";
import { createStore } from "solid-js/store";
import Separator from "./Separator";
import IconButton from "../Buttons";
import Draggable from "../Draggable/Draggable";
import Icon from "../Icons";
import type { JSX, Component } from "solid-js";

type TooltipProps = {
  children?: JSX.Element;
  when: boolean;
  itemRef: HTMLDivElement;
};

const matrixRegex = /matrix.*\((.+)\)/g;

// tooltip 4 states :
// closed : tooltip is closed
// attached (default) : tooltip is attached to the item
// detached : tooltip is detached from the item and can be moved
// detached and pinned : tooltip is detached and pinned to a position

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

  const attached = () => (props.when || open()) && !detached();

  const mouseEnter = () => {
    if (detached()) return;
    setOpen(true);
  };
  const mouseLeave = () => {
    if (detached()) return;
    console.log("detached", detached());
    setOpen(false);
  };

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
    if (attached()) {
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
        ["opacity-0"]: !attached(),
        ["opacity-100"]: attached() || detached(),
      }}
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
      ref={(el) => (tooltipRef = el)}
    >
      <Show when={attached() || detached()}>
        <Show when={!detached()}>
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
          onEnd={() => translate.formatRaw(window.getComputedStyle(debugRef).transform)}
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

type StandardTooltipProps = {
  children: JSX.Element;
  title?: JSX.Element;
  class?: string;
};
export const StandardTooltip: Component<StandardTooltipProps> = (props) =>
  // prettier-ignore
  <div class={`flex h-fit w-fit p-5 pt-0 bg-dw-500 flex-col ${props.class || ""}`}> 
      <Show when={!!props.title}>
        <h4 class="uppercase monserrat tracking-widest text-xs font-bold mb-2 text-dw-200">{props.title}</h4>
      </Show>
      <div class="text-balance">{props.children}</div>
    </div>;

export type StatsTooltipData = { label: string; value: JSX.Element; separator?: boolean };
type StatsTooltipProps = {
  data: StatsTooltipData[];
  title?: JSX.Element;
};
export const StatsTooltip: Component<StatsTooltipProps> = (props) => {
  return (
    <div class="flex flex-col p-5 pt-0 w-fit bg-dw-500 min-w-72">
      <Show when={!!props.title}>
        <div class="flex flex-row justify-between">
          <h4 class="uppercase monserrat tracking-widest text-xs font-bold mb-2 text-dw-200">{props.title}</h4>
        </div>
      </Show>
      <div class="gap-1">
        <For each={props.data}>
          {(data) => (
            <>
              <div class="flex items-center justify-between z-10 w-full flex-nowrap">
                <span class="w-20 text-left">{data.label}</span>
                <span class="whitespace-nowrap w-24 text-right text-yellow-400 tabular-nums">{data.value}</span>
              </div>
              <Show when={data.separator}>
                <Separator classes="w-full my-3 h-[2px]" />
              </Show>
            </>
          )}
        </For>
      </div>
    </div>
  );
};

export default Tooltip;
