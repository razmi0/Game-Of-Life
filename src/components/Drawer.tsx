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
import Header, { TooltipTitle } from "./Drawer/Headers";
import StandardTooltip, { StatsTooltip } from "./Drawer/Tooltips";
import Item from "./Drawer/Item";
import SimpleRange from "./Drawer/Range";
import Separator from "./Drawer/Separator";
import { InputColor } from "./Input";

import Icon from "./Icons";
import useShorcuts, { type Shortcut } from "../hooks/useShorcuts";
import type { Accessor, ParentComponent } from "solid-js";
import type { Tools } from "../hooks/usePainter";
import type { StatsTooltipData } from "./Drawer/Tooltips";

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
  palette: string[];
  penColor: string;
  backgroundColor: string;
  shape: "square" | "circle";
  seeGrid: boolean;
  seeCorpse: boolean;
  /** ACTIONS */
  reset: () => void;
  resetBlank: () => void;
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
  addColor: (color: string) => void;
  patchColor: (color: string, index: number) => void;
  removeColor: (index: number) => void;
  applyColors: () => void;
  changePenColor: (color: string) => void;
  changeBackgroundColor: (color: string) => void;
  setShapeSquare: () => void;
  setShapeCircle: () => void;
  toggleGrid: () => void;
  toggleCorpse: () => void;
};

const { xs, sm, md, lg, xl } = ICON_SIZE;

export default function Drawer(props: Prettify<DrawerProps>) {
  const [isOpen, setIsOpen] = createSignal(true);
  const trigger = () => setIsOpen((p) => !p);

  const fps = (speed: number) => {
    if (speed === 0) return "max fps";
    const lbl = 1000 / speed;
    return lbl > 200 ? "200 fps" : Math.floor(lbl) + " fps";
  };

  const formatIdToLabel = (label: string) => label.replace(/_/g, " ").replace(/color/, "Color");

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

    const handlePenColorChange = (e: Event) => {
      const val = (e.target as HTMLInputElement).value;
      props.changePenColor(val);
    };

    const isErase = () => props.selectedTool === "eraser";
    const isPen = () => props.selectedTool === "pen";

    return (
      <div class="flex flex-col gap-2 mt-3 min-w-40">
        <div class="flex items-start gap-1">
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
            class="hover:border-dw-100 p-2 border-2 rounded-full"
            classList={{ ["border-dw-100"]: isErase(), [" border-transparent"]: !isErase() }}
          />
          <div class="flex items-center justify-center h-11 w-11 ">
            <InputColor
              id="color_brush"
              label="pen color"
              hiddenLabel
              value={props.penColor}
              onChange={handlePenColorChange}
              class="input-color-rounded-full w-6 h-6"
            />
          </div>
        </div>
        <p>brush size : </p>
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

  const ColorPaletteTooltip = () => {
    const [newColor, setNewColor] = createSignal("#FFF");

    const ColorSection: ParentComponent = (local) => (
      <div
        class="flex flex-col gap-1 max-h-40 flex-wrap "
        id="section_color"
        classList={{ ["items-center"]: props.palette.length > 3, ["-translate-x-[5px]"]: props.palette.length > 7 }}
      >
        {local.children}
      </div>
    );
    const ColorItem: ParentComponent = (local) => <div class="flex flex-row items-center">{local.children}</div>;

    return (
      <div class="flex flex-col gap-3 mt-3 min-w-48 justify-between h-full">
        <ColorSection>
          <For each={props.palette}>
            {(color, i) => {
              const id = `color_${i()}`;

              const changeColor = (e: Event) => {
                const newColor = (e.target as HTMLInputElement).value;
                props.patchColor(newColor, i());
              };

              return (
                <>
                  <ColorItem>
                    <InputColor id={id} value={color} label={formatIdToLabel(id)} onChange={changeColor} hiddenLabel />
                    <IconButton
                      onClick={() => props.removeColor(i())}
                      width={sm}
                      name="minus_circle"
                      class="border-[1px] border-dw-100 rounded-e-md hover:bg-dw-300 w-8 h-8 flex items-center justify-center"
                    />
                  </ColorItem>
                </>
              );
            }}
          </For>
          <ColorItem>
            <InputColor
              id="add_color"
              value={newColor()}
              label="add color"
              hiddenLabel
              onChange={(e) => {
                const newColor = (e.target as HTMLInputElement).value;
                setNewColor(newColor);
              }}
            />
            <IconButton
              onClick={() => {
                props.addColor(newColor());
                setNewColor("");
              }}
              name="plus_circle"
              width={sm}
              class="border-[1px] border-dw-100 rounded-e-md hover:bg-dw-300 w-8 h-8 flex items-center justify-center"
            />
          </ColorItem>
        </ColorSection>
      </div>
    );
  };

  const BackgroundColor = () => {
    return (
      <div class="flex items-center justify-center h-7 w-11 mt-2">
        <InputColor
          id="background_color"
          label="background color"
          value={props.backgroundColor}
          onChange={(e) => props.changeBackgroundColor((e.target as HTMLInputElement).value)}
          class="input-color-rounded-full w-6 h-6"
          hiddenLabel
        />
      </div>
    );
  };

  const DeadVisibility = () => {
    const isVisible = () => props.seeCorpse;

    return (
      <div class="flex flex-col gap-1 h-full w-full min-w-48 mt-3">
        <div class="flex flex-row w-full items-center justify-between">
          <label classList={{ ["text-yellow-400 text-sm "]: isVisible() }}>Colorize</label>
          <IconButton
            onClick={props.toggleCorpse}
            width={md}
            name="skull"
            class="hover:bg-dw-300 p-1 rounded-full"
            classList={{ ["bg-dw-300"]: isVisible() }}
          />
        </div>
      </div>
    );
  };

  const ShapeTooltip = () => {
    const isSquare = () => props.shape === "square";
    const isCircle = () => props.shape === "circle";

    return (
      <div class="flex flex-col gap-1 h-full w-full min-w-48 mt-3">
        <div class="flex flex-row w-full items-center justify-between">
          <span classList={{ ["text-yellow-400 text-sm "]: isSquare() }}>Square</span>
          <IconButton
            onClick={props.setShapeSquare}
            width={md}
            name="square_shape"
            class="hover:bg-dw-300 p-1 rounded-full"
            classList={{ ["bg-dw-300"]: isSquare() }}
          />
        </div>
        <div class="flex flex-row w-full items-center justify-between">
          <span classList={{ ["text-yellow-400 text-sm "]: isCircle() }}>Circle</span>
          <IconButton
            onClick={props.setShapeCircle}
            width={md}
            name="circle_shape"
            class="hover:bg-dw-300 p-1 rounded-full"
            classList={{ ["bg-dw-300"]: isCircle() }}
          />
        </div>
        <SimpleButton class="bg-dw-300 w-full hover:bg-dw-200" handler={props.reset}>
          reset game
        </SimpleButton>
      </div>
    );
  };

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
        <SimpleButton class="bg-dw-300 w-full hover:bg-dw-200" handler={props.reset}>
          reset
        </SimpleButton>
      </div>
    );
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
          tooltip={
            <StandardTooltip
              title={<TooltipTitle title={playPauseText()} keyCmd="spacebar" class="w-fit flex-col" />}
            />
          }
        >
          <PlayPauseIcon />
        </Item>

        <Item
          tooltip={
            <>
              <StandardTooltip title={<TooltipTitle title="reset" keyCmd="key R" />}>
                <p class="min-w-48">reset to a new original fresh random game</p>
                <div class="flex gap-2 mt-2">
                  <SimpleButton class="bg-dw-300 w-full hover:bg-dw-200 whitespace-nowrap" handler={props.resetBlank}>
                    reset blank
                  </SimpleButton>
                  <SimpleButton class="bg-dw-300 w-full hover:bg-dw-200  whitespace-nowrap" handler={props.reset}>
                    reset game
                  </SimpleButton>
                </div>
              </StandardTooltip>
            </>
          }
          onClick={props.reset}
        >
          <Icon width={xl} name="reset" />
        </Item>
        <Item
          tooltip={
            <StandardTooltip title={<TooltipTitle title="randomness" keyCmd="arrow left/right" />}>
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
        <Item
          showTooltipOnClick
          indicator={props.penSize}
          tooltip={
            <StandardTooltip title="painting tools">
              <PaintingTooltip />
            </StandardTooltip>
          }
        >
          <Icon width={xl} name="painting_tools" />
        </Item>
        <Item
          showTooltipOnClick
          tooltip={
            <StandardTooltip title="color palette" class="h-full" innerContentClass="flex flex-col justify-between">
              <p>paint the whole board with an unlimited set of colors : </p>
              <ColorPaletteTooltip />
              <Separator class="w-full h-[1px] my-3" />
              <div class="flex">
                <p>change the board background color : </p>
                <BackgroundColor />
              </div>
              <Separator class="w-full h-[1px] my-3" />
              <p>Toggle colorizing dead cells : </p>
              <DeadVisibility />
              <SimpleButton class="bg-dw-300 mt-4 w-full hover:bg-dw-200" handler={props.applyColors}>
                apply new colors
              </SimpleButton>
            </StandardTooltip>
          }
        >
          <Icon width={xl} name="color_picker" />
        </Item>
        <Item
          tooltip={
            <StandardTooltip title={<TooltipTitle title="shape" />}>
              <p>change the shape of the cells</p>
              <ShapeTooltip />
            </StandardTooltip>
          }
        >
          <Icon width={xl} name="shape_picker" />
        </Item>
      </Group>
      <Separator />
      <Group>
        <Item
          indicator={props.cellSize}
          tooltip={
            <StandardTooltip title={<TooltipTitle title="cell size" keyCmd="key Z/S" />}>
              <p>change the size of the cells</p>
              <CellSizeTooltip />
            </StandardTooltip>
          }
        >
          <Icon width={xl} name="grid_square" />
        </Item>

        <Item
          tooltip={
            <StandardTooltip title={<TooltipTitle title="speed" keyCmd="arrow down/up" />}>
              <p>change the delay between two frames thus affecting fps</p>
              <SpeedTooltip />
            </StandardTooltip>
          }
        >
          <Icon width={xl} name="speed" />
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
