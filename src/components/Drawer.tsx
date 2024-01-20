import { Portal } from "solid-js/web";
import { Show, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import Wrapper from "./Drawer/Content";
import Header from "./Drawer/Header";
import Body from "./Drawer/Body";
import Group from "./Drawer/Group";
import Item from "./Drawer/Item";
import { IconButton } from "./Buttons";
import type { JSX, VoidComponent } from "solid-js";
import Icon, { IconNames } from "./Icons";
import { ICON_SIZE, MAX_ALIVE_RANDOMNESS, MAX_DELAY, MIN_ALIVE_RANDOMNESS, MIN_DELAY } from "../data";
// import { MAX_DELAY, MIN_DELAY, ICON_SIZE, MIN_ALIVE_RANDOMNESS, MAX_ALIVE_RANDOMNESS } from "../data";

const portalNode = document.getElementById("portal")! as HTMLDivElement;
let ref: HTMLDivElement;
const title = "Controls";
const subtitle = "monitoring and control";

type DrawerProps = {
  clock: ClockState;
  board: GridStoreState;
};
export default function Drawer(props: DrawerProps) {
  const [isOpen, setIsOpen] = createSignal(true);
  const trigger = () => setIsOpen(true);

  const PlayPauseIcon = (
    <Show when={props.clock.play} fallback={<Icon width={ICON_SIZE.sm} height={ICON_SIZE.sm} name="play" />}>
      <Icon width={ICON_SIZE.sm} height={ICON_SIZE.sm} name="pause" />
    </Show>
  );

  const AliveEvolutionIcon = (
    <Show
      when={props.board.nAliveIncrease}
      fallback={<Icon width={ICON_SIZE.sm} height={ICON_SIZE.sm} name="arrowDown" />}
    >
      <Icon width={ICON_SIZE.sm} height={ICON_SIZE.sm} name="arrowUp" />
    </Show>
  );

  const DeadEvolutionIcon = (
    <Show
      when={props.board.nDeadIncrease}
      fallback={<Icon width={ICON_SIZE.sm} height={ICON_SIZE.sm} name="arrowDown" />}
    >
      <Icon width={ICON_SIZE.sm} height={ICON_SIZE.sm} name="arrowUp" />
    </Show>
  );

  const RangeRandomLabel = (
    <div class="flex w-full">
      <span>Alive/dead ratio : </span>
      <Spacer />
      <span>{props.board.randomness + " %"}</span>
    </div>
  );
  const RangeDelayLabel = (
    <div class="flex justify-start w-full">
      <span>Delay : </span>
      <Spacer />
      <span>{props.clock.speed + " ms"}</span>
    </div>
  );

  const handleSpeedChange = (e: Event) => {
    const newTime = (e.target as HTMLInputElement).valueAsNumber;
    props.clock.changeSpeed(newTime);
  };

  const handleRandomChange = (e: Event) => {
    const newRandom = (e.target as HTMLInputElement).valueAsNumber;
    props.board.changeRandomness(newRandom);
  };

  const shuffleText = () => (props.board.generation === 0 ? "Pulse of death" : "Pulse of life");

  onMount(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref && !ref.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    onCleanup(() => document.removeEventListener("mousedown", handleClickOutside));
  });

  return (
    <Portal mount={portalNode}>
      <Wrapper trigger={trigger} open={isOpen()} ref={ref}>
        <Header
          title={title}
          subtitle={subtitle}
          right={
            <IconButton
              onClick={trigger}
              width={ICON_SIZE.lg}
              height={ICON_SIZE.lg}
              name="chevron"
              classes="hover:bg-dw-300 p-1 rounded-full"
            />
          }
        />
        <Body>
          <Group title="Control">
            <Item left={PlayPauseIcon} onClick={props.clock.playPause}>
              <Show when={props.clock.play}>Pause</Show>
              <Show when={!props.clock.play}>Play</Show>
            </Item>
            <Item left={<Icon width={ICON_SIZE.sm} height={ICON_SIZE.sm} name="baby" />} onClick={props.board.shuffle}>
              {shuffleText()}
            </Item>
            <Item left={<Icon width={ICON_SIZE.sm} height={ICON_SIZE.sm} name="reset" />} onClick={props.board.reset}>
              Reset
            </Item>
          </Group>
          <Group title="Settings" left={<Icon width={ICON_SIZE.md} height={ICON_SIZE.md} name="gear" />}>
            <Item
              left={<Icon width={ICON_SIZE.xl} height={ICON_SIZE.xl} name="clock" />}
              label={RangeDelayLabel}
              hover={false}
            >
              <Range onChange={handleSpeedChange} value={props.clock.speed} max={MAX_DELAY} min={MIN_DELAY} />
            </Item>
            <Item
              left={<Icon width={ICON_SIZE.xl} height={ICON_SIZE.xl} name="random" />}
              label={RangeRandomLabel}
              hover={false}
            >
              <Range
                onChange={handleRandomChange}
                value={props.board.randomness}
                min={MIN_ALIVE_RANDOMNESS}
                max={MAX_ALIVE_RANDOMNESS}
              />
            </Item>
          </Group>
          <Group classes="gap-0" title="Stats" left={<Icon width={ICON_SIZE.lg} height={ICON_SIZE.lg} name="wave" />}>
            <Item hover={false} left={"Total cells : "}>
              {props.board.nAlive + props.board.nDead}
            </Item>
            <Item hover={false} left={"Generation : "}>
              {props.board.generation}
            </Item>
            <Item hover={false} left={DeadEvolutionIcon}>
              Deads : {props.board.nDead}
            </Item>
            <Item hover={false} left={AliveEvolutionIcon}>
              Alives : {props.board.nAlive}
            </Item>
          </Group>
        </Body>
      </Wrapper>
    </Portal>
  );
}

type RangeProps = {
  onChange: (e: Event) => void;
  value?: number;
  min?: number;
  max?: number;
};
const Range: VoidComponent<RangeProps> = (props) => {
  const min = props.min === 0 ? 0 : props.min || 10;
  const max = props.max || 1000;
  return (
    <input type="range" class="w-full" onChange={(e) => props.onChange(e)} max={max} min={min} value={props.value} />
  );
};

const Spacer = () => <div class="flex-grow"></div>;
