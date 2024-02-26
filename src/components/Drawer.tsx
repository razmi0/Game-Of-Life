import { For, Show, createEffect, createMemo, createSignal } from "solid-js";
import {
  CELL_SIZE_STEP,
  DELAY_STEP,
  ICON_SIZE,
  MAX_ALIVE_RANDOM,
  MAX_CELL_SIZE,
  MAX_DELAY,
  MAX_PEN_SIZE,
  MIN_ALIVE_RANDOM,
  MIN_CELL_SIZE,
  MIN_DELAY,
  MIN_PEN_SIZE,
  PEN_SIZE_STEP,
  RANDOM_STEP,
} from "../data";
import { IconButton, SimpleButton } from "./Buttons";
import Wrapper from "./Drawer/Content";
import Group from "./Drawer/Group";
import Header from "./Drawer/Header";
import Item from "./Drawer/Item";
import SimpleRange from "./Drawer/Range";
import Separator from "./Drawer/Separator";

import Icon from "./Icons";
import type { Accessor, Component, JSXElement } from "solid-js";
import useShorcuts, { type Shortcut } from "../hooks/useShorcuts";
import type { Tools } from "../hooks/usePainter";

type DrawerProps = {
  /** STATES */
  hasStarted: boolean;
  play: boolean;
  speed: number;
  randomness: number;
  generation: number;
  nAlive: number;
  nDead: number;
  navigator: UserAgentInfo | null;
  cellSize: number;
  gridInfo: { width: number; height: number };
  penSize: number;
  paintingState: boolean;
  selectedTool: Tools;
  /** ACTIONS */
  reset: () => void;
  changeSpeed: (newTime: number) => void;
  changeRandom: (newRandom: number) => void;
  changeCellSize: (newSize: number) => void;
  tuneRandom: (newRandom: number) => void;
  tuneSpeed: (newSpeed: number) => void;
  tuneCellSize: (newSize: number) => void;
  switchPlayPause: () => void;
  switchPainting: () => void;
  tunePenSize: (newSize: number) => void;
  changePenSize: (newSize: number) => void;
  setEraser: () => void;
  setPen: () => void;
  unsetTool: () => void;
};

const { xl, sm, md, xs, lg } = ICON_SIZE;

export default function Drawer(props: Prettify<DrawerProps>) {
  const [isOpen, setIsOpen] = createSignal(true);
  const trigger = () => setIsOpen((p) => !p);

  const shorcuts: Shortcut[] = [
    {
      key: " ",
      action: () => props.switchPlayPause(),
    },
    {
      key: "r",
      action: () => props.reset(),
    },
    {
      key: "z",
      action: () => props.changeCellSize(CELL_SIZE_STEP),
    },
    {
      key: "s",
      action: () => props.changeCellSize(-CELL_SIZE_STEP),
    },
    {
      key: "ArrowUp",
      action: () => props.changeSpeed(DELAY_STEP),
    },
    {
      key: "ArrowDown",
      action: () => props.changeSpeed(-DELAY_STEP),
    },
    {
      key: "ArrowRight",
      action: () => props.changeRandom(RANDOM_STEP),
    },
    {
      key: "ArrowLeft",
      action: () => props.changeRandom(-RANDOM_STEP),
    },
    {
      key: "a",
      action: () => trigger(),
      ctrl: true,
    },
  ];
  useShorcuts(shorcuts);

  const playPauseText = () => (props.play ? "pause" : "play");
  const PlayPauseIcon = () => (
    <Show when={props.play} fallback={<Icon width={ICON_SIZE.xl} name="play" />}>
      <Icon width={ICON_SIZE.xl} name="pause" />
    </Show>
  );

  const PlayPauseTitle = () => (
    <div class="flex flex-col items-center justify-between translate-y-[5px] w-fit">
      <div>{playPauseText()}</div>
      <div class="text-3xs flex text-dw-100 gap-1 items-center">spacebar</div>
    </div>
  );

  const ResetTitle = () => (
    <div class="flex flex-row items-center justify-between translate-y-[5px]">
      <div>reset</div>
      <div class="text-3xs flex text-dw-100 gap-1 items-center">key R</div>
    </div>
  );

  const PaintingTooltip = () => {
    const [output, setOutput] = createSignal(props.penSize);

    createEffect(() => setOutput(props.penSize));

    const handleInputOutput = (e: Event) => {
      setOutput((e.target as HTMLInputElement).valueAsNumber);
    };

    const handlePenSizeChange = (e: Event) => {
      const newSize = (e.target as HTMLInputElement).valueAsNumber;
      props.tunePenSize(newSize);
    };

    const handlePenClick = () => {
      if (isPen()) {
        props.unsetTool();
      } else {
        props.setPen();
      }
      togglePainting();
    };

    const togglePainting = () => {
      if ((isPen() || isErase()) && !props.paintingState) {
        props.switchPainting();
      }
    };

    const handleEraserClick = () => {
      if (isErase()) {
        props.unsetTool();
      } else {
        props.setEraser();
      }
      togglePainting();
    };

    const isErase = () => props.selectedTool === "eraser";
    const isPen = () => props.selectedTool === "pen";

    return (
      <div class="flex flex-col gap-4 mt-3 min-w-48">
        <div class="flex gap-2 items-start">
          <IconButton
            width={md}
            name="pen"
            onClick={handlePenClick}
            class="hover:border-dw-100  p-2 border-2 rounded-full"
            classList={{ ["border-dw-100"]: isPen(), [" border-transparent"]: !isPen() }}
          />
          <IconButton
            width={md}
            name="eraser"
            onClick={handleEraserClick}
            class=" hover:border-dw-100 p-2 border-2 rounded-full"
            classList={{ ["border-dw-100"]: isErase(), [" border-transparent"]: !isErase() }}
          />
        </div>
        <div class="flex gap-2 items-start">
          <IconButton width={md} name="minus_circle" class="mb-5" onClick={() => props.changePenSize(-PEN_SIZE_STEP)} />
          <SimpleRange
            milestones={[MIN_PEN_SIZE, Math.floor((MIN_PEN_SIZE + MAX_PEN_SIZE) / 2), MAX_PEN_SIZE]}
            onChange={handlePenSizeChange}
            onInput={handleInputOutput}
            value={props.penSize}
            min={MIN_PEN_SIZE}
            max={MAX_PEN_SIZE}
            aria="pen-size"
            class="w-56"
            step={PEN_SIZE_STEP}
          />
          <IconButton width={md} name="plus_circle" class="mb-5" onClick={() => props.changePenSize(PEN_SIZE_STEP)} />
          <div class="translate-y-[1px] text-yellow-400 text-sm font-bold h-full w-10 tabular-nums text-right">
            {output()}
          </div>
        </div>
      </div>
    );
  };

  const SpeedTitle = () => (
    <div class="flex flex-row items-center justify-between translate-y-[5px]">
      <div>speed</div>
      <div class="text-3xs flex text-dw-100 gap-1 items-center">arrow up/down</div>
    </div>
  );

  const RandomTitle = () => (
    <div class="flex flex-row items-center justify-between translate-y-[5px]">
      <div>randomness</div>
      <div class="text-3xs flex text-dw-100 gap-1 items-center">arrow left/right</div>
    </div>
  );

  const CellSizeTitle = () => (
    <div class="flex flex-row items-center justify-between translate-y-[5px]">
      <div>cell size</div>
      <div class="text-3xs flex text-dw-100 gap-1 items-center">z / s</div>
    </div>
  );

  const CellSizeTooltip = () => {
    const [output, setOutput] = createSignal(props.cellSize + "px");

    createEffect(() => setOutput(props.cellSize + "px"));

    /** UI (onInput) */
    const handleInputOutput = (e: Event) => {
      const newSize = (e.target as HTMLInputElement).valueAsNumber;
      setOutput(newSize + "px");
    };

    /** internal logic (onChange) */
    const handleCellSizeChange = (e: Event) => {
      const newSize = (e.target as HTMLInputElement).valueAsNumber;
      props.tuneCellSize(newSize);
    };

    return (
      <div class="flex flex-col gap-4 mt-3 min-w-48">
        <div class="flex gap-2 items-start">
          <IconButton
            onClick={() => props.changeCellSize(-CELL_SIZE_STEP)}
            width={lg}
            name="two_by_two_squares"
            class="mb-5"
          />
          <SimpleRange
            milestones={[MIN_CELL_SIZE, Math.floor((MIN_CELL_SIZE + MAX_CELL_SIZE) / 2), MAX_CELL_SIZE]}
            onChange={handleCellSizeChange}
            onInput={handleInputOutput}
            value={props.cellSize}
            min={MIN_CELL_SIZE}
            max={MAX_CELL_SIZE}
            aria="cell-size"
            class="w-56"
            step={CELL_SIZE_STEP}
          />
          <IconButton
            onClick={() => props.changeCellSize(CELL_SIZE_STEP)}
            width={lg}
            name="two_by_three_squares"
            class="mb-5 rotate-90"
          />
          <div class="translate-y-[1px] text-yellow-400 text-sm font-bold h-full w-16 tabular-nums text-right">
            {output()}
          </div>
        </div>
      </div>
    );
  };

  const fps = (speed: number) => {
    if (speed === 0) return "max fps";
    const lbl = 1000 / speed;
    return lbl > 200 ? "200 fps" : Math.floor(lbl) + " fps";
  };

  const SpeedTooltip = () => {
    const [output, setOutput] = createSignal(fps(props.speed));

    createEffect(() => setOutput(fps(props.speed)));

    const handleInputOutput = (e: Event) => {
      setOutput(fps((e.target as HTMLInputElement).valueAsNumber));
    };

    const handleSpeedChange = (e: Event) => {
      const newSpeed = (e.target as HTMLInputElement).valueAsNumber;
      props.tuneSpeed(newSpeed);
    };

    return (
      <div class="mt-3 flex items-center min-w-48">
        <IconButton onClick={() => props.changeSpeed(DELAY_STEP)} width={md} name="snail" class="mb-5 me-2" />
        <SimpleRange
          milestones={["10", "20", "200"]}
          onChange={handleSpeedChange}
          onInput={handleInputOutput}
          value={props.speed}
          max={MAX_DELAY}
          min={MIN_DELAY}
          class="w-56 rotate-180"
          aria="speed"
          step={DELAY_STEP}
        />
        <IconButton onClick={() => props.changeSpeed(-DELAY_STEP)} width={md} name="hare" class="mb-5 ms-2" />
        <div class="whitespace-nowrap text-yellow-400 text-sm font-bold translate-y-[-9px] h-full w-16 tabular-nums text-right">
          {output()}
        </div>
      </div>
    );
  };

  const RandomTooltip = () => {
    const [output, setOutput] = createSignal<string>(props.randomness + " %");

    createEffect(() => setOutput(props.randomness + " %"));

    const handleRandomChange = (e: Event) => {
      const newRandom = (e.target as HTMLInputElement).valueAsNumber;
      props.tuneRandom(newRandom);
    };

    const handleInputOutput = (e: Event) => {
      const newRandom = (e.target as HTMLInputElement).valueAsNumber + " %";
      setOutput(newRandom);
    };

    return (
      <div class="flex flex-col gap-4 mt-3 min-w-48">
        <div class="flex gap-2 items-start ">
          <IconButton onClick={() => props.changeRandom(-RANDOM_STEP)} width={md} name="baby" class="mb-5" />
          <SimpleRange
            milestones={[MIN_ALIVE_RANDOM, Math.floor((MIN_ALIVE_RANDOM + MAX_ALIVE_RANDOM) / 2), MAX_ALIVE_RANDOM]}
            onChange={handleRandomChange}
            onInput={handleInputOutput}
            value={props.randomness}
            min={MIN_ALIVE_RANDOM}
            max={MAX_ALIVE_RANDOM}
            aria="randomness"
            class="w-56"
            step={RANDOM_STEP}
          />
          <IconButton onClick={() => props.changeRandom(RANDOM_STEP)} width={md} name="skull" class="mb-5" />
          <div class="translate-y-[1px] text-yellow-400 text-sm font-bold h-full w-10 tabular-nums text-right">
            {output()}
          </div>
        </div>
        <SimpleButton class="bg-dw-300 w-full hover:bg-dw-200" handler={props.reset}>
          reset game
        </SimpleButton>
      </div>
    );
  };

  const boardStats: Accessor<StatsTooltipData[]> = createMemo(() => [
    {
      label: "generation",
      value: props.generation,
    },
    {
      label: "cell size",
      value: props.cellSize + "px",
      separator: true,
    },
    {
      label: "delay",
      value: `${props.speed}ms (${fps(props.speed)})`,
    },
    {
      label: "randomness",
      value: props.randomness + " %",
      separator: true,
    },
    {
      label: "total cells",
      value: props.nAlive + props.nDead,
    },
    {
      label: "alive cells",
      value: `${props.nAlive} (${Math.floor((props.nAlive / (props.nAlive + props.nDead)) * 100)}%)`,
    },
  ]);

  const deviceStats: Accessor<StatsTooltipData[]> = createMemo(() => [
    {
      label: "width",
      value: `${props.gridInfo.width} px` || "unknown",
    },
    {
      label: "height",
      value: `${props.gridInfo.height} px` || "unknown",
      separator: true,
    },
    {
      label: "platform",
      value: props.navigator?.platform || "unknown",
    },
    {
      label: "battery",
      value: `${props.navigator?.battery} % (${props.navigator?.batteryChange})` || "unknown",
      separator: true,
    },
    {
      label: "threads per core",
      value: props.navigator?.hardwareConcurrency || "unknown",
    },
    {
      label: "available threads",
      value: props.navigator?.availableThreads || "unknown",
    },
  ]);

  return (
    <Wrapper trigger={trigger} open={isOpen()}>
      <Header>
        <IconButton onClick={trigger} width={xl} name="chevron" class="hover:bg-dw-300 p-1 rounded-full" />
      </Header>
      <Separator />
      <Group>
        <Item
          showTooltipOnClick
          onClick={props.switchPlayPause}
          tooltip={<StandardTooltip title={<PlayPauseTitle />} />}
        >
          <PlayPauseIcon />
        </Item>

        <Item
          tooltip={
            <>
              <StandardTooltip title={<ResetTitle />}>
                <p class="min-w-48">reset to a new original fresh random game</p>
              </StandardTooltip>
            </>
          }
          onClick={props.reset}
        >
          <Icon width={xl} name="reset" />
        </Item>
      </Group>
      <Separator />
      <Group>
        <Item
          tooltip={
            <StandardTooltip title={"painting tools"}>
              <PaintingTooltip />
            </StandardTooltip>
          }
        >
          <Icon width={xl} name="painting_tools" />
        </Item>
      </Group>
      <Separator />
      <Group>
        <Item
          tooltip={
            <StandardTooltip title={<CellSizeTitle />}>
              <p>change the size of the cells</p>
              <CellSizeTooltip />
            </StandardTooltip>
          }
        >
          <Icon width={xl} name="grid_square" />
        </Item>

        <Item
          tooltip={
            <StandardTooltip title={<SpeedTitle />}>
              <p>change the delay between two frames thus affecting fps</p>
              <SpeedTooltip />
            </StandardTooltip>
          }
        >
          <Icon width={xl} name="speed" />
        </Item>
        <Item
          tooltip={
            <StandardTooltip title={<RandomTitle />}>
              <p class="mt-2">
                change the ratio between dead and alive cells, the higher the value the more dead cells generated on
                reset
              </p>
              <RandomTooltip />
            </StandardTooltip>
          }
        >
          <Icon width={xl} name="random" />
        </Item>
      </Group>
      <Separator />
      <Group>
        <Item tooltip={<StatsTooltip title={"board infos"} data={boardStats()} />}>
          <Icon width={xl} name="stats" />
        </Item>
        <Item tooltip={<StatsTooltip title={"Device Infos"} data={deviceStats()} />}>
          <Icon width={xl} name="screen_gear" />
        </Item>
      </Group>
      <Separator />
    </Wrapper>
  );
}

type StandardTooltipProps = {
  children?: JSXElement;
  title?: JSXElement;
  class?: string;
};
const StandardTooltip: Component<StandardTooltipProps> = (props) =>
  // prettier-ignore
  <div class={`flex h-fit w-fit py-3 px-4 bg-dw-500 flex-col ${props.class || ""}`}> 
    <Show when={!!props.title}>
      <h4 class="uppercase monserrat tracking-widest text-xs font-bold mb-2 text-dw-200">{props.title}</h4>
    </Show>
    <Show when={!!props.children}>
    <div class="text-balance">{props.children}</div></Show>
  </div>;

type StatsTooltipData = { label: string; value: JSXElement; separator?: boolean };
type StatsTooltipProps = {
  data: StatsTooltipData[];
  title?: JSXElement;
};
const StatsTooltip: Component<StatsTooltipProps> = (props) => {
  return (
    <div class="flex flex-col p-5 w-fit bg-dw-500 min-w-72">
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
                <span class="w-fit text-left">{data.label}</span>
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
    // </Draggable>
  );
};
