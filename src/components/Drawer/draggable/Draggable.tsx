import { Component, JSXElement, children, createEffect, createSignal, onCleanup } from "solid-js";
import { createStore, produce, unwrap } from "solid-js/store";
import { Portal } from "solid-js/web";

//
// const portalNode = document.getElementById("portal-draggable")! as HTMLDivElement;

type DraggableProps = {
  children: JSXElement;
  enabled?: boolean;
  /** reset position on end */
  resetOnDragEnd?: boolean;
};

type DragState = {
  start: boolean;
  move: boolean;
  end: boolean;
};

/**
 * Make a draggable element
 */
const Draggable: Component<DraggableProps> = (props): JSXElement => {
  const [enabled, setEnabled] = createSignal(props.enabled === undefined ? true : props.enabled);
  const [drag, setDrag] = createStore({
    start: false,
    move: false,
    end: true,
  });
  if (!props.children) throw new Error("Draggable component must have children");

  let child: HTMLElement;
  const UNIT = "px";
  let initial = { x: 0, y: 0 };
  let diff = { x: 0, y: 0 };
  let permanentlyAdded = { x: 0, y: 0 };
  let rect = { x: 0, y: 0, width: 0, height: 0 };

  const resolved = children(() => props.children);

  const setup = () => {
    let list = resolved.toArray();
    if (list.length > 1) throw new Error("Draggable component must have only one child");
    child = list[0] as HTMLElement;
    if (!child) return;

    /** attributes */
    child.toggleAttribute("draggable");
    const { left, top, width, height } = child.getBoundingClientRect();
    rect = { x: left, y: top, width, height };
    initial = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };

    /** listeners */
    child.addEventListener("mousedown", (e) => mouseDown(e as MouseEvent), { passive: true });
    child.addEventListener("mousemove", (e) => mouseMove(e as MouseEvent), { passive: true });
    child.addEventListener("mouseup", (e) => mouseUp(e as MouseEvent), { passive: true });
    child.addEventListener("mouseleave", (e) => mouseUp(e as MouseEvent), { passive: true });

    onCleanup(() => {
      child.removeEventListener("mousedown", (e) => mouseDown(e as MouseEvent));
      child.removeEventListener("mousemove", (e) => mouseMove(e as MouseEvent));
      child.removeEventListener("mouseup", (e) => mouseUp(e as MouseEvent));
    });
  };

  const getCoord = () => {
    return child.getBoundingClientRect();
  };

  const fn = (e: MouseEvent) => {
    if (e.type === "click") console.log("click");
  };

  const mouseDown = (e: MouseEvent) => {
    console.log("mousedown");
    if (!enabled() && !drag.end) return;
    e.stopImmediatePropagation();

    initial.x = e.screenX - permanentlyAdded.x;
    initial.y = e.screenY - permanentlyAdded.y;

    console.log(permanentlyAdded);
    console.log("screnn", e.screenX, e.screenY);

    setDrag(
      produce((draft) => {
        draft.start = true;
        draft.move = false;
        draft.end = false;
      })
    );
    console.log("started");
  };

  const mouseMove = (e: MouseEvent) => {
    if (!drag.start) return;
    e.stopImmediatePropagation();

    const mouseX = e.screenX;
    const mouseY = e.screenY;

    diff.x = mouseX - initial.x;
    diff.y = mouseY - initial.y;

    // console.log("initial", initial);
    // console.log("diff", diff);

    child.style.transform = `translate(${diff.x}px, ${diff.y}px)`;

    setDrag("move", true);
    // console.log("moving");
  };

  const mouseUp = (e: MouseEvent) => {
    if (!drag.move) return;
    console.log("ended");
    e.stopImmediatePropagation();
    console.log("before:initial", initial);

    if (props.resetOnDragEnd) child.style.transform = `translate(0px, 0px)`;
    else {
      permanentlyAdded.x = diff.x;
      permanentlyAdded.y = diff.y;
    }

    console.log("after:initial", initial);

    setDrag(
      produce((draft) => {
        draft.start = false;
        draft.move = false;
        draft.end = true;
      })
    );
  };

  createEffect(() => {
    console.log("setup effect");
    setup();
  });

  return <>{resolved()}</>; // Portal mount={portalNode} Portal
};

export default Draggable;
