import type { JSX, Component } from "solid-js";

type HeaderProps = {
  children?: JSX.Element;
};
const Header: Component<HeaderProps> = (props) => {
  return <div class="flex place-content-center mb-10">{props.children}</div>;
};

export default Header;
