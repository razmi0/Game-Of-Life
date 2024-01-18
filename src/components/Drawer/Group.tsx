import { Component, createSignal, Show } from "solid-js";
import type { JSX } from "solid-js";
import Icon from "../Icons";

type GroupProps = {
  title: string;
  children: JSX.Element;
};
const Group: Component<GroupProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(true);
  const trigger = () => setIsOpen((p) => !p);

  const PlusIcon = () => <Icon width={13} height={13} name={isOpen() ? "minus" : "plus"} />;

  return (
    <div class="my-3 mt-4">
      <GroupHeader icon={<PlusIcon />} onClick={trigger}>
        <h4 class="uppercase monserrat tracking-widest text-xs font-bold">{props.title}</h4>
      </GroupHeader>
      <Show when={isOpen()}>{props.children}</Show>
    </div>
  );
};

type GroupHeaderProps = {
  icon: JSX.Element;
  children: JSX.Element;
  onClick: () => void;
};

const GroupHeader: Component<GroupHeaderProps> = (props) => {
  return (
    <button
      class="p-1 flex flex-row justify-between w-full items-center text-dw-300 hover:text-dw-200 "
      onClick={props.onClick}
    >
      <div>{props.children}</div>
      <div class="pe-1 ">{props.icon}</div>
    </button>
  );
};

export default Group;
