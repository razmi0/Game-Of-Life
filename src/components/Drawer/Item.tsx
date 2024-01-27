import { type JSX, type Component, Show, createSignal, onMount, createEffect, on, onCleanup } from "solid-js";
import { SHOW_TOOLTIP_DEBUG } from "../../data";
import SvgSafeTriangle from "./SafeTriangle";
import { createStore, unwrap } from "solid-js/store";

type RectType = {
  height: number;
  width: number;
  left: number;
  top: number;
  x: number;
  y: number;
};

type RefType = {
  parent: null | RectType;
  child: null | RectType;
};

type ItemProps = {
  children?: JSX.Element;
  right?: JSX.Element;
  left?: JSX.Element;
  label?: JSX.Element;
  onClick?: () => void;
  classes?: string;
  hover?: boolean;
  onHover?: () => void;
  tooltip?: JSX.Element;
};
const Item: Component<ItemProps> = (props) => {
  const [hovering, setHovering] = createSignal(SHOW_TOOLTIP_DEBUG);
  const [mouse, setMouse] = createStore({ x: 0, y: 0 });
  const [ref, setRef] = createStore<RefType>({ parent: null, child: null });

  const hasLbl = !!props.label;
  const hasLeft = !!props.left;
  const hasRight = !!props.right;
  const hasChildren = !!props.children;
  const hasTooltip = !!props.tooltip;

  let parentRef: HTMLDivElement;
  let childRef: HTMLDivElement;

  const Tooltip = (props: TooltipProps) => {
    const [show, setShow] = createSignal(false);

    createEffect(
      on(
        () => hovering(),
        () => {
          if (!hovering()) return;
          setRef(() => ({
            parent: parentRef.getBoundingClientRect() as RectType,
            child: childRef.getBoundingClientRect() as RectType,
          }));
          console.log(unwrap(ref));
        }
      )
    );

    onCleanup(() => setRef("child", null));

    return (
      <Show when={(hasTooltip && hovering()) || show()}>
        <SvgSafeTriangle
          svgWidth={(ref.child?.x || 0) - mouse.x}
          submenuHeight={ref.child?.height || 0}
          svgHeight={ref.child?.height || 0}
          submenuY={ref.child?.top || 0}
          mouseX={mouse.x}
          mouseY={mouse.y}
        />
        <div
          ref={(el) => (childRef = el!)}
          class="fixed min-w-20 h-fit bg-red-500"
          style={`transform : translate(${(ref.parent?.width || 0) + 20}px, ${0}px)`}
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
          {props.children}
        </div>
      </Show>
    );
  };

  onCleanup(() => setRef("parent", null));

  return (
    <div
      onMouseEnter={(e) => {
        setHovering(true);
      }}
      onMouseMove={(e) => {
        setMouse({ x: e.clientX, y: e.clientY });
      }}
      onMouseLeave={() => {
        setMouse({ x: 0, y: 0 });
        setHovering(false);
      }}
    >
      <Label show={hasLbl}>{props.label}</Label>
      <div
        class={
          "flex items-center justify-center text-sm text-dw-150 w-full cursor-pointer hover:bg-dw-300 hover:text-dw-100 py-2 " +
            props.classes || ""
        }
        onClick={props.onClick}
        ref={(el) => (parentRef = el)}
      >
        <Left show={hasLeft}>{props.left}</Left>
        <Child show={hasChildren}>{props.children}</Child>
        <Right show={hasRight}>{props.right}</Right>

        <Tooltip>{props.tooltip}</Tooltip>
      </div>
    </div>
  );
};
{
  /*  */
}

type TooltipProps = {
  children?: JSX.Element;
};

//#region member
type LabelProps = {
  show?: boolean;
  children: JSX.Element;
};
const Label = (props: LabelProps) => {
  return (
    <Show when={props.show}>
      <label class="text-sm w-full mt-2">{props.children}</label>
    </Show>
  );
};
type RightProps = {
  show?: boolean;
  children: JSX.Element;
};
const Right = (props: RightProps) => {
  return (
    <Show when={props.show}>
      <div class="flex flex-col items-center">{props.children}</div>
    </Show>
  );
};
type LeftProps = {
  show?: boolean;
  children: JSX.Element;
};
const Left = (props: LeftProps) => {
  return (
    <Show when={props.show}>
      <div>{props.children}</div>
    </Show>
  );
};
type ChildProps = {
  show?: boolean;
  children: JSX.Element;
};
const Child = (props: ChildProps) => {
  return (
    <Show when={props.show}>
      <div>{props.children}</div>
    </Show>
  );
};

//#endregion member

export default Item;
