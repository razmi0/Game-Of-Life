import { Component, createSignal, Show } from "solid-js";
import type { ComponentProps, JSX } from "solid-js";
import Icon from "../Icons";

type GroupProps = {
  title: string;
  children: JSX.Element | JSX.Element[];
};
const Group: Component<GroupProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const trigger = () => setIsOpen((p) => !p);
  return (
    <div>
      <GroupHeader title={props.title} btnChild={<Icon width={15} height={15} name="plus" />} onClick={trigger} />
      <Show when={isOpen()}>{props.children}</Show>
    </div>
  );
};

type GroupHeaderProps = {
  title: JSX.Element | JSX.Element[];
  btnChild: JSX.Element | JSX.Element[];
  onClick: () => void;
};

const GroupHeader: Component<GroupHeaderProps> = (props) => {
  return (
    <div class="flex flex-row justify-between">
      <h4>{props.title}</h4>
      <button onClick={props.onClick}>{props.btnChild}</button>
    </div>
  );
};

export default Group;
