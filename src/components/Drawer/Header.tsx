import { Show } from "solid-js";
import type { JSX, Component } from "solid-js";

type HeaderProps = {
  title: string;
  subtitle: string;
  left?: JSX.Element;
  right?: JSX.Element;
};
const Header: Component<HeaderProps> = (props) => {
  return (
    <div class="flex flex-row justify-start items-center mt-3 mb-10">
      <div class="flex flex-row gap-3 items-center">
        <Show when={props.left}>{props.left}</Show>
        <div class="flex flex-col justify-start">
          <h3 class="text-dw-100 text-lg leading-none">{props.title}</h3>
          <span class="text-dw-150 text-sm">{props.subtitle}</span>
        </div>
      </div>
      <Show when={props.right}>
        <Spacer />
        {props.right}
      </Show>
    </div>
  ); // title subtile left icon right icon
};

const Spacer = () => {
  return <div class="flex-grow"></div>;
};

export default Header;