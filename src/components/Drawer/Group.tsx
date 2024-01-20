import { Component, createSignal, Show } from "solid-js";
import type { JSX } from "solid-js";
import Icon from "../Icons";

type GroupProps = {
  title?: string;
  children: JSX.Element;
  left?: JSX.Element;
  classes?: string;
};
const Group: Component<GroupProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(true);
  const trigger = () => setIsOpen((p) => !p);

  const PlusIcon = () => <Icon width={13} height={13} name={isOpen() ? "minus" : "plus"} />;

  return (
    <div class="my-3 mt-4">
      <Show when={!!props.title}>
        <GroupHeader right={<PlusIcon />} left={props.left} onClick={trigger}>
          <h4 class="uppercase monserrat tracking-widest text-xs font-bold">{props.title}</h4>
        </GroupHeader>
      </Show>
      <Show when={isOpen()}>
        <div class={`py-2 flex flex-col gap-2 ps-1 ${props.classes}`}>{props.children}</div>
      </Show>
    </div>
  );
};

type GroupHeaderProps = {
  left?: JSX.Element;
  right?: JSX.Element;
  children: JSX.Element;
  onClick: () => void;
};

const GroupHeader: Component<GroupHeaderProps> = (props) => {
  return (
    <button
      class="gap-2 flex flex-row justify-start w-full items-center text-dw-300 hover:text-dw-200 "
      onClick={props.onClick}
    >
      <div class="ps-1 ">{props.left}</div>
      <div>{props.children}</div>
      <Spacer />
      <div class="pe-1 ">{props.right}</div>
    </button>
  );
};

const Spacer = () => <div class="flex-grow"></div>;

export default Group;
