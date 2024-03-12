import { For, JSXElement, Show, createEffect, createSignal, onMount } from "solid-js";
import Icon, { OpCircleIconProps, type IconProps, IconComponentNames } from "./Icons";
import Separator from "./Separator";
import { createStore, produce } from "solid-js/store";

type IconButtonProps = IconProps & {
  onClick: () => void;
  class?: string;
  classList?: Record<string, boolean>;
  children?: JSXElement;
};

export const IconButton = (props: IconButtonProps) => {
  return (
    <button
      onClick={() => props.onClick()}
      class={"flex gap-2 cursor-pointer" + props.class || ""}
      classList={props.classList || {}}
    >
      <Icon width={props.width} height={props.height} color={props.color} style={props.style} name={props.name} />
      {props.children}
    </button>
  );
};

type SimpleButtonProps = {
  handler: () => void;
  children: JSXElement;
  class?: string;
};
export const SimpleButton = (props: SimpleButtonProps) => {
  const [btnSize, setBtnSize] = createStore<{ width: number; height: number }>({ width: 0, height: 0 });
  const [waves, setWaves] = createStore({
    list: [] as (() => JSXElement)[],
  });

  const clickHandler = () => {
    props.handler();
    setWaves(
      "list",
      produce((waves) => waves.push(() => <Wave />))
    );
    setTimeout(() => {
      setWaves(
        "list",
        produce((waves) => waves.shift())
      );
    }, 2100);
  };

  let btn: HTMLButtonElement;
  createEffect(() => {
    if (btn) {
      setBtnSize("width", btn.offsetWidth);
      setBtnSize("height", btn.offsetHeight);
    }
  });

  const Wave = () => {
    const [active, setActive] = createSignal(false);

    onMount(() => {
      setTimeout(() => setActive(true), 100);
    });

    return (
      <div class="absolute left-0 top-0">
        <div
          classList={{
            ["wave-motion-appear-active"]: active(),
          }}
          class={`conway-wave wave-motion-appear wave-motion rounded-md`}
          style={{ left: "-1px", top: "-1px", width: `${btnSize.width}px`, height: `${btnSize.height}px` }}
        />
      </div>
    );
  };

  return (
    <>
      <button
        onClick={clickHandler}
        class={`relative cursor-pointer py-1 px-3 whitespace-nowrap rounded-md text-sm border-black/30 border-[1px] font-medium transition-colors ease-out shadow-inner-shadow-dark-sm bg-dw-300 hover:bg-dw-400  ${props.class || ""}`} // prettier-ignore
        ref={(el) => (btn = el)}
      >
        <For each={waves.list}>{(wave) => wave()}</For>
        {props.children}
      </button>
    </>
  );
};

type ComposedButtonProps = SimpleButtonProps & {
  left?: JSXElement;
  right?: JSXElement;
};
export const ComposedButton = (props: ComposedButtonProps) => {
  return (
    <SimpleButton
      handler={props.handler}
      class={`flex items-center self-end min-w-36 child:flex-grow child:flex child:justify-center child:items-center  ${
        props.class || ""
      }`}
    >
      <Show when={props.left}>
        <div>{props.left}</div>
      </Show>
      <div>{props.children}</div>
      <Show when={props.right}>
        <div>{props.right}</div>
      </Show>
    </SimpleButton>
  );
};

type IconComponentButton = {
  onClick: () => void;
  btnClass?: string;
  children: JSXElement;
  left?: JSXElement;
  right?: JSXElement;
};
export const IconComponentButton = (props: IconComponentButton) => {
  return (
    <button
      onClick={() => props.onClick()}
      type="button"
      class={`flex flex-row whitespace-nowrap items-center justify-evenly ${props.btnClass || ""}`}
    >
      <Show when={props.left}>{props.left}</Show>
      {props.children}
      <Show when={props.right}>{props.right}</Show>
    </button>
  );
};

export default IconButton;

// position: absolute; left: 0px; top: 0px;
