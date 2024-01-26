import { Show, createMemo, createSignal } from "solid-js";
import Wrapper from "./Drawer/Content";
import Header from "./Drawer/Header";
import Group from "./Drawer/Group";
import Item from "./Drawer/Item";
import Separator from "./Drawer/Separator";
import { IconButton } from "./Buttons";
import Icon from "./Icons";
import { ICON_SIZE } from "../data";
import type { Component, VoidComponent } from "solid-js";

let ref: HTMLDivElement;
const title = "Controls";
const subtitle = "monitoring and control";

type DrawerProps = {
  clock: ClockState;
  board: GridStoreState;
};
export default function Drawer(props: DrawerProps) {
  const [isOpen, setIsOpen] = createSignal(true);
  const trigger = () => setIsOpen((p) => !p);
  const hasStarted = createMemo(() => props.board.generation > 0);
  const shuffleText = () => (props.board.generation === 0 ? "Pulse of death" : "Pulse of life");

  const PlayPauseIcon = () => (
    <Show when={props.clock.play} fallback={<Icon width={ICON_SIZE.xl} name="play" />}>
      <Icon width={ICON_SIZE.xl} name="pause" />
    </Show>
  );

  type EvolutionIconProps = {
    increaseType: boolean;
  };

  const EvolutionIcon: Component<EvolutionIconProps> = (props) => (
    <Show
      when={hasStarted() && props.increaseType}
      fallback={hasStarted() && <Icon width={ICON_SIZE.lg} name="arrowDown" />}
    >
      <Icon width={ICON_SIZE.lg} name="arrowUp" />
    </Show>
  );

  const AliveEvolutionIcon = <EvolutionIcon increaseType={props.board.nAliveIncrease} />;
  const DeadEvolutionIcon = <EvolutionIcon increaseType={props.board.nDeadIncrease} />;

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

  const Tooltip = () => <div class="w-20 h-40 border-2 border-red-500 flex place-content-center">I'm a tooltip</div>;

  const { xl } = ICON_SIZE;

  return (
    <Wrapper trigger={trigger} open={isOpen()} ref={ref}>
      <Header></Header>
      <IconButton onClick={trigger} width={xl} name="chevron" classes="hover:bg-dw-300 p-1 rounded-full" />
      <Group>
        <Separator />
        <Item onClick={props.clock.playPause} tooltip={<Tooltip />}>
          <PlayPauseIcon />
        </Item>
        <Item tooltip={<Tooltip />} onClick={props.board.shuffle}>
          <Icon width={xl} name="baby" />
        </Item>
        <Item tooltip={<Tooltip />} onClick={props.board.reset}>
          <Icon width={xl} name="reset" />
        </Item>
      </Group>
      <Separator />
      <Group>
        <Item tooltip={<Tooltip />}>
          <Icon width={xl} name="speed" />
        </Item>
        <Item tooltip={<Tooltip />}>
          <Icon width={xl} name="random" />
        </Item>
      </Group>
      <Separator />
      <Group>
        <Item tooltip={<Tooltip />}>
          <Icon width={xl} name="wave" />
        </Item>
      </Group>
      <Separator />
    </Wrapper>
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
