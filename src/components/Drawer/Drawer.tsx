import type { Accessor, ParentComponent } from "solid-js";
import { For, Show, createEffect, createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import {
  CELL_SIZE_STEP,
  DELAY_STEP,
  ICON_SIZE,
  MAX_ALIVE_RANDOM,
  MAX_CELL_SIZE,
  MAX_DELAY,
  MAX_PEN_SIZE,
  MAX_SPACING,
  MIN_ALIVE_RANDOM,
  MIN_CELL_SIZE,
  MIN_DELAY,
  MIN_PEN_SIZE,
  MIN_SPACING,
  PEN_SIZE_STEP,
  RANDOM_STEP,
  STEP_SPACING,
} from "../../data";
import { fps } from "../../helpers";
import useShorcuts, { type Shortcut } from "../../hooks/useShorcuts";
import { ComposedButton, IconButton, IconComponentButton, SimpleButton } from "../ui/Buttons";
import Icon, { MinusCircleIcon, PlusCircleIcon } from "../ui/Icons";
import { InputColor } from "../ui/Input";
import Output from "../ui/Output";
import Separator from "../ui/Separator";
import Wrapper from "./Content";
import Group from "./Group";
import Header, { TooltipTitle } from "./Headers";
import Item from "./Item";
import SimpleRange from "./Range";
import type { StatsTooltipData } from "./Tooltips";
import StandardTooltip, { StatsTooltip } from "./Tooltips";

type DrawerProps = {
  boardData: ReturnType<typeof import("../../hooks/useBoardData").default>;
  grid: ReturnType<typeof import("../../hooks/useGrid").default>;
  gameLoop: ReturnType<typeof import("../../hooks/useTimer").default>;
  painter: ReturnType<typeof import("../../hooks/usePainter").default>;
  color: ReturnType<typeof import("../../hooks/useColors").default>;
  /** misc */
  reset: () => void;
  applyColors: () => void;
  drawAllHash: () => void;
  hasStarted: boolean;
  navigator: UserAgentInfo;
  gridInfo: { width: number; height: number };
};
const { xs, sm, md, lg, xl } = ICON_SIZE;

export default function Drawer(props: Prettify<DrawerProps>) {
  const [isOpen, setIsOpen] = createSignal(true);
  const trigger = () => setIsOpen((p) => !p);

  const formatIdToLabel = (label: string) => label.replace(/_/g, " ").replace(/color/, "Color");

  const shorcuts: Shortcut[] = [
    {
      key: " ",
      action: () => props.gameLoop.switchPlayPause(),
      // prevented: true,
    },
    {
      key: "r",
      action: () => props.reset(),
    },
    {
      key: "z",
      action: () => props.grid.changeCellSize(CELL_SIZE_STEP),
    },
    {
      key: "s",
      action: () => props.grid.changeCellSize(-CELL_SIZE_STEP),
    },
    {
      key: "ArrowUp",
      action: () => props.gameLoop.changeSpeed(DELAY_STEP),
    },
    {
      key: "ArrowDown",
      action: () => props.gameLoop.changeSpeed(-DELAY_STEP),
    },
    {
      key: "ArrowRight",
      action: () => props.boardData.changeRandom(RANDOM_STEP),
    },
    {
      key: "ArrowLeft",
      action: () => props.boardData.changeRandom(-RANDOM_STEP),
    },
    {
      key: "a",
      action: () => trigger(),
      ctrl: true,
    },
  ];
  useShorcuts(shorcuts);

  const playPauseText = () => (props.gameLoop.play ? "pause" : "play");
  const PlayPauseIcon = () => (
    <Show when={props.gameLoop.play} fallback={<Icon width={ICON_SIZE.xl} name="play" />}>
      <Icon width={ICON_SIZE.xl} name="pause" />
    </Show>
  );

  const PaintingTooltip = () => {
    const [output, setOutput] = createSignal(props.painter.penSize());

    createEffect(() => setOutput(props.painter.penSize()));

    const handleInputOutput = (e: Event) => {
      setOutput((e.target as HTMLInputElement).valueAsNumber);
    };

    const handlePenSizeChange = (e: Event) => {
      const newSize = (e.target as HTMLInputElement).valueAsNumber;
      props.painter.tunePenSize(newSize);
    };

    const handlePenClick = () => {
      if (isPen()) {
        props.painter.unsetTool();
      } else {
        props.painter.setPen();
      }
      togglePainting();
    };

    const togglePainting = () => {
      if ((isPen() || isErase()) && !props.painter.userPaint()) {
        props.painter.switchPainting();
      }
    };

    const handleEraserClick = () => {
      if (isErase()) {
        props.painter.unsetTool();
      } else {
        props.painter.setEraser();
      }
      togglePainting();
    };

    const handlePenColorChange = (e: Event) => {
      const val = (e.target as HTMLInputElement).value;
      props.painter.setPenColor(val);
    };

    const isErase = () => props.painter.tool() === "eraser";
    const isPen = () => props.painter.tool() === "pen";

    return (
      <div class="flex flex-col gap-0 mt-3 min-w-40">
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
              value={props.painter.penColor()}
              onChange={handlePenColorChange}
              class="input-color-rounded-full w-6 h-6"
            />
          </div>
        </div>
        <p class="my-1">brush size : </p>
        <div class="flex gap-0 items-start">
          <IconButton
            width={md}
            name="minus_circle"
            class="mb-5"
            onClick={() => props.painter.changePenSize(-PEN_SIZE_STEP)}
          />
          <SimpleRange
            milestones={[MIN_PEN_SIZE, Math.floor((MIN_PEN_SIZE + MAX_PEN_SIZE) / 2), MAX_PEN_SIZE]}
            onChange={handlePenSizeChange}
            onInput={handleInputOutput}
            value={props.painter.penSize()}
            min={MIN_PEN_SIZE}
            max={MAX_PEN_SIZE}
            aria="pen-size"
            class="w-56"
            step={PEN_SIZE_STEP}
          />
          <IconButton
            width={md}
            name="plus_circle"
            class="mb-5"
            onClick={() => props.painter.changePenSize(PEN_SIZE_STEP)}
          />
          <div class="translate-y-[1px] text-yellow-400 text-sm font-bold h-full w-10 tabular-nums text-right">
            {output()}
          </div>
        </div>
      </div>
    );
  };

  const ColorPaletteTooltip = () => {
    const [newColor, setNewColor] = createSignal("FFFFFF");

    const ColorSection: ParentComponent = (local) => (
      <div class="flex gap-1 w-56 items-center justify-center" id="section_color">
        {local.children}
      </div>
    );
    const ColorItem: ParentComponent = (local) => (
      <div class="flex flex-col items-center rotate-180">{local.children}</div>
    );

    return (
      <div class="flex flex-row gap-3 mt-3 min-w-48 justify-between h-full">
        <ColorSection>
          <For each={props.color.palette()}>
            {(color, i) => {
              const id = () => `color_${i()}`;

              const changeColor = (e: Event) => {
                const newColor = (e.target as HTMLInputElement).value;
                props.color.patchColor(newColor, i());
              };

              return (
                <>
                  <ColorItem>
                    <InputColor
                      class="vanilla"
                      id={id()}
                      value={color ?? "#FFFFFF"}
                      label={formatIdToLabel(id())}
                      onChange={changeColor}
                      hiddenLabel
                    />
                    <IconButton
                      onClick={() => props.color.removeColor(i())}
                      width={sm}
                      name="minus_circle"
                      class="border-[1px] border-dw-100 rounded-b-md hover:bg-dw-300 w-7 h-7 flex items-center justify-center" //
                    />
                  </ColorItem>
                </>
              );
            }}
          </For>
          <div class="h-full flex-grow" />
          <Show when={props.color.palette.length < props.color.maxColors()}>
            <IconButton
              onClick={() => {
                props.color.addColor(newColor());
                setNewColor(newColor());
              }}
              name="plus_circle"
              width={xl}
              class="hover:bg-dw-300 rounded-full flex items-center justify-center"
            />
          </Show>
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
          value={props.color.backgroundColor()}
          onChange={(e) => props.color.setBackgroundColor((e.target as HTMLInputElement).value)}
          class="input-color-rounded-full w-6 h-6"
          hiddenLabel
        />
      </div>
    );
  };

  const DeadVisibility = () => {
    const isVisible = () => props.color.seeCorpse();

    return (
      <div class="flex flex-col gap-1 h-full w-full min-w-48 mt-3">
        <div class="flex flex-row w-full items-center justify-between">
          <label classList={{ ["text-yellow-400 text-sm "]: isVisible() }}>Colorize</label>
          <IconButton
            onClick={props.color.toggleCorpse}
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
    const isSquare = () => props.grid.shape.selectedShape === "square";
    const isCircle = () => props.grid.shape.selectedShape === "circle";

    const switchToSquare = () => {
      props.grid.setSquare();
      props.drawAllHash();
    };

    const switchToCircle = () => {
      props.grid.setCircle();
      props.drawAllHash();
    };

    return (
      <div class="flex flex-col h-full w-full min-w-32">
        <div class="flex flex-row w-full items-center justify-between">
          <span classList={{ ["text-yellow-400 text-sm "]: isSquare() }}>Square</span>
          <IconButton
            onClick={switchToSquare}
            width={md}
            name="square_shape"
            class="hover:bg-dw-300 p-1 rounded-full"
            classList={{ ["bg-dw-300"]: isSquare() }}
          />
        </div>
        <div class="flex flex-row w-full items-center justify-between">
          <span classList={{ ["text-yellow-400 text-sm "]: isCircle() }}>Circle</span>
          <IconButton
            onClick={switchToCircle}
            width={md}
            name="circle_shape"
            class="hover:bg-dw-300 p-1 rounded-full"
            classList={{ ["bg-dw-300"]: isCircle() }}
          />
        </div>
      </div>
    );
  };

  const SizesTooltip = () => {
    const [allowed, setAllowed] = createStore({
      decreaseCellSize: true,
      increaseCellSize: true,
      decreaseGridSpacing: true,
      increaseGridSpacing: true,
    });

    const drawBothCanvas = () => {
      props.drawAllHash();
      props.grid.drawGrid();
    };

    const increaseCellSize = () => {
      props.grid.changeCellSize(CELL_SIZE_STEP);
      drawBothCanvas();
    };

    const decreaseCellSize = () => {
      if (allowed.decreaseCellSize === false) return;
      props.grid.changeCellSize(-CELL_SIZE_STEP);
      drawBothCanvas();
    };

    const toggleVisibility = () => {
      props.grid.toggleVisibility();
      drawBothCanvas();
    };

    const increaseGridSpacing = () => {
      if (allowed.increaseGridSpacing === false) return;
      props.grid.changeSpacing(STEP_SPACING);
      props.grid.drawGrid();
    };

    const decreaseGridSpacing = () => {
      props.grid.changeSpacing(-STEP_SPACING);
      props.grid.drawGrid();
    };

    createEffect(() => {
      const newUpperSpacingBoundary = props.grid.gridSpacing.spacing + STEP_SPACING;
      const newLowerSpacingBoundary = props.grid.gridSpacing.spacing - STEP_SPACING;

      const newUpperCellSizeBoundary = props.grid.board.cellSize + CELL_SIZE_STEP;
      const newLowerCellSizeBoundary = props.grid.board.cellSize - CELL_SIZE_STEP;

      const canIncreaseGridSpacing =
        newUpperSpacingBoundary < props.grid.board.cellSize && newUpperSpacingBoundary <= MAX_SPACING;
      const canDecreaseGridSpacing = newLowerSpacingBoundary >= MIN_SPACING;

      const canDecreaseCellSize =
        newLowerCellSizeBoundary > props.grid.gridSpacing.spacing && newLowerCellSizeBoundary >= MIN_CELL_SIZE;
      const canIncreaseCellSize = newUpperCellSizeBoundary <= MAX_CELL_SIZE;

      setAllowed("increaseGridSpacing", canIncreaseGridSpacing);
      setAllowed("decreaseGridSpacing", canDecreaseGridSpacing);
      setAllowed("decreaseCellSize", canDecreaseCellSize);
      setAllowed("increaseCellSize", canIncreaseCellSize);
    });

    return (
      <div class="flex flex-col justify-center w-full gap-2">
        <p>Cell size : </p>
        <div class="flex items-center ">
          <IconComponentButton onClick={decreaseCellSize}>
            <MinusCircleIcon
              width={xl}
              classList={{ ["cursor-not-allowed"]: !allowed.decreaseCellSize }}
              color={allowed.decreaseCellSize ? undefined : "#FF0000"}
            />
          </IconComponentButton>
          <Output>{props.grid.board.cellSize + " px"}</Output>
          <IconComponentButton onClick={increaseCellSize}>
            <PlusCircleIcon
              width={xl}
              classList={{ ["cursor-not-allowed"]: !allowed.increaseCellSize }}
              color={allowed.increaseCellSize ? undefined : "#FF0000"}
            />
          </IconComponentButton>
        </div>
        <p>Grid spacing : </p>
        <div class="flex items-center ">
          <IconComponentButton onClick={decreaseGridSpacing}>
            <MinusCircleIcon
              width={xl}
              classList={{ ["cursor-not-allowed"]: !allowed.decreaseGridSpacing }}
              color={allowed.decreaseGridSpacing ? undefined : "#FF0000"}
            />
          </IconComponentButton>
          <Output>{props.grid.gridSpacing.spacing + " px"}</Output>
          <IconComponentButton onClick={increaseGridSpacing}>
            <PlusCircleIcon
              width={xl}
              classList={{ ["cursor-not-allowed"]: !allowed.increaseGridSpacing }}
              color={allowed.increaseGridSpacing ? undefined : "#FF0000"}
            />
          </IconComponentButton>
        </div>
        <ComposedButton
          handler={toggleVisibility}
          right={
            <Show when={props.grid.gridSpacing.visibility} fallback={<Icon name="eye_closed" width={lg} />}>
              <Icon name="eye_open" width={lg} />
            </Show>
          }
        >
          <span class="whitespace-nowrap font-bold">
            <Show when={props.grid.gridSpacing.visibility} fallback={"Show grid"}>
              Hide grid
            </Show>
          </span>
        </ComposedButton>
      </div>
    );
  };

  const fpsOutputOptions = { showUnit: true, digits: 2 };
  const SpeedTooltip = () => {
    const [output, setOutput] = createSignal(fps(props.gameLoop.speed, fpsOutputOptions));

    createEffect(() => setOutput(fps(props.gameLoop.speed, fpsOutputOptions)));

    const handleInputOutput = (e: Event) => {
      setOutput(fps((e.target as HTMLInputElement).valueAsNumber, fpsOutputOptions));
    };

    const handleSpeedChange = (e: Event) => {
      const newSpeed = (e.target as HTMLInputElement).valueAsNumber;
      props.gameLoop.tuneSpeed(newSpeed);
    };

    const fpsMilestonesOptions = { showUnit: false };

    return (
      <div class="mt-3 flex items-center min-w-48">
        <IconButton onClick={() => props.gameLoop.changeSpeed(DELAY_STEP)} width={md} name="snail" class="mb-5 me-2" />
        <SimpleRange
          milestones={[
            fps(MAX_DELAY, fpsMilestonesOptions),
            fps(Math.floor((MIN_DELAY + MAX_DELAY) / 2), fpsMilestonesOptions),
            fps(MIN_DELAY, fpsMilestonesOptions),
          ]}
          onChange={handleSpeedChange}
          onInput={handleInputOutput}
          value={props.gameLoop.speed}
          max={MAX_DELAY}
          min={MIN_DELAY}
          class="w-56 rotate-180"
          aria="speed"
          step={DELAY_STEP}
        />
        <IconButton onClick={() => props.gameLoop.changeSpeed(-DELAY_STEP)} width={md} name="hare" class="mb-5 ms-2" />
        <div class="whitespace-nowrap text-yellow-400 text-sm font-bold translate-y-[-9px] h-full w-20 tabular-nums text-right">
          {output()}
        </div>
      </div>
    );
  };

  const RandomTooltip = () => {
    const [output, setOutput] = createSignal<string>(props.boardData.randomness + " %");

    createEffect(() => setOutput(props.boardData.randomness + " %"));

    const handleRandomChange = (e: Event) => {
      const newRandom = (e.target as HTMLInputElement).valueAsNumber;
      props.boardData.tuneRandom(newRandom);
    };

    const handleInputOutput = (e: Event) => {
      const newRandom = (e.target as HTMLInputElement).valueAsNumber + " %";
      setOutput(newRandom);
    };

    return (
      <div class="flex flex-col gap-2 mt-3 min-w-48">
        <div class="flex gap-2 items-start ">
          <IconButton onClick={() => props.boardData.changeRandom(-RANDOM_STEP)} width={md} name="baby" class="mb-5" />
          <SimpleRange
            milestones={[MIN_ALIVE_RANDOM, Math.floor((MIN_ALIVE_RANDOM + MAX_ALIVE_RANDOM) / 2), MAX_ALIVE_RANDOM]}
            onChange={handleRandomChange}
            onInput={handleInputOutput}
            value={props.boardData.randomness}
            min={MIN_ALIVE_RANDOM}
            max={MAX_ALIVE_RANDOM}
            aria="randomness"
            class="w-56"
            step={RANDOM_STEP}
          />
          <IconButton onClick={() => props.boardData.changeRandom(RANDOM_STEP)} width={md} name="skull" class="mb-5" />
          <Output>{output()}</Output>
        </div>
      </div>
    );
  };

  const boardStats: Accessor<StatsTooltipData[]> = createMemo(() => [
    {
      label: "generation",
      value: props.boardData.generation,
    },
    {
      label: "cell size",
      value: props.grid.board.cellSize + "px",
      separator: true,
    },
    {
      label: "delay",
      value: `${props.gameLoop.speed}ms (${fps(props.gameLoop.speed, { showUnit: true, digits: 1 })})`,
    },
    {
      label: "randomness",
      value: props.boardData.randomness + " %",
      separator: true,
    },
    {
      label: "total cells",
      value: props.boardData.nAlive + props.boardData.nDead,
    },
    {
      label: "alive cells",
      value: `${props.boardData.nAlive} (${Math.floor(
        (props.boardData.nAlive / (props.boardData.nAlive + props.boardData.nDead)) * 100
      )}%)`,
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
          onClick={props.gameLoop.switchPlayPause}
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
                <div class="flex w-full justify-center items-center">
                  <p class="min-w-48">reset to a new original fresh random game</p>
                  <SimpleButton class="h-fit" handler={props.reset}>
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
          indicator={props.painter.penSize()}
          tooltip={
            <StandardTooltip title="painting tools">
              <PaintingTooltip />
            </StandardTooltip>
          }
        >
          <Icon width={xl} name="painting_tools" />
        </Item>
        <Item
          tooltip={
            <StandardTooltip title="color palette" class="h-full" innerContentClass="flex flex-col justify-between">
              <p>Cell colors : </p>
              <ColorPaletteTooltip />
              <Separator class="w-full h-[1px] my-3" />
              <div class="flex">
                <p>Board color : </p>
                <BackgroundColor />
              </div>
              <Separator class="w-full h-[1px] my-3" />
              <p>Colorfull dead cells : </p>
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
              <div class="flex flex-col justify-center">
                <p class="h-fit mb-2">Cell shape : </p>
                <ShapeTooltip />
              </div>
            </StandardTooltip>
          }
        >
          <Icon width={xl} name="shape_picker" />
        </Item>
      </Group>
      <Separator />
      <Group>
        <Item
          indicator={props.grid.board.cellSize}
          tooltip={
            <StandardTooltip title={<TooltipTitle title="sizes" />}>
              <SizesTooltip />
            </StandardTooltip>
          }
        >
          <Icon width={xl} name="grid_square" />
        </Item>

        <Item
          tooltip={
            <StandardTooltip title={<TooltipTitle title="speed" keyCmd="arrow down/up" />}>
              <p class="mt-2">change the delay between two frames thus affecting fps : </p>
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
