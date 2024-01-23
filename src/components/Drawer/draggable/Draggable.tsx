import { type Component, type JSXElement, children, createEffect, onCleanup, onMount } from "solid-js";
import { createStore, produce } from "solid-js/store";

type DraggableProps = {
  children: JSXElement;
  enabled?: undefined | boolean;
  resetOnDragEnd?: boolean;
};

type DragState = {
  start: boolean;
  move: boolean;
  end: boolean;
};

/**
 * TODO
 * replace listener on move with movement() function ( require listener attch to document so try mouse_boundary before)
 */

const MOVE_HZ = 60;
const MOVE_TIMEOUT = Math.floor(1000 / MOVE_HZ); // MOVE_HZ/s
const UNIT = "px";
const MOUSE_BOUNDARY_RADIUS = 10;

/**
 * Make a draggable element
 */
const Draggable: Component<DraggableProps> = (props): JSXElement => {
  const [drag, setDrag] = createStore<DragState>({
    start: false,
    move: false,
    end: true,
  });
  if (!props.children) throw new Error("Draggable component must have children");
  let child: HTMLElement;
  let now = Date.now();
  let initial = { x: 0, y: 0 };
  let diff = { x: 0, y: 0 };
  let permanentlyAdded = { x: 0, y: 0 };
  let rect = { x: 0, y: 0, width: 0, height: 0 };
  const resolved = children(() => props.children);

  const update = (obj1: Record<string, number>, obj2: Record<string, number>) => {
    for (let n in obj1) obj1[n] = obj2[n];
  };

  const setup = () => {
    let list = resolved.toArray();
    if (list.length > 1) throw new Error("Draggable component must have only one child");
    child = list[0] as HTMLElement;
    if (!child) return;

    /** attributes & data */
    child.toggleAttribute("draggable");
    const { left, top, width, height } = child.getBoundingClientRect();
    rect = { x: left, y: top, width, height };
    initial = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };

    listeners();
  };
  onMount(setup);

  const listeners = () => {
    const handleClick = () => (drag.start ? end() : null);
    child.addEventListener("click", handleClick);
    child.addEventListener("mousedown", (e) => handleMouseDown(e as MouseEvent));
    child.addEventListener("mousemove", (e) => handleMouseMove(e as MouseEvent));
    child.addEventListener("mouseup", handleMouseUp);
    child.addEventListener("mouseleave", handleMouseUp);
    onCleanup(() => {
      child.removeEventListener("click", handleClick);
      child.removeEventListener("mousedown", (e) => handleMouseDown(e as MouseEvent));
      child.removeEventListener("mousemove", (e) => handleMouseMove(e as MouseEvent));
      child.removeEventListener("mouseup", handleMouseUp);
      child.removeEventListener("mouseleave", handleMouseUp);
    });
  };

  /** start */

  const start = () => {
    setDrag(
      produce((draft) => {
        draft.start = true;
        draft.move = false;
        draft.end = false;
      })
    );
  };
  const handleMouseDown = (e: MouseEvent) => {
    let enabled = props.enabled ?? true;
    if (!enabled || !drag.end) return;
    e.preventDefault();

    initial.x = e.screenX - permanentlyAdded.x;
    initial.y = e.screenY - permanentlyAdded.y;

    start();
  };

  /** move */

  const handleMouseMove = (e: MouseEvent) => {
    let isReady = Date.now() - now > MOVE_TIMEOUT;
    let enabled = props.enabled ?? true;
    if (!drag.start || !isReady || !enabled) return;
    now = Date.now();

    const mouseX = e.screenX;
    const mouseY = e.screenY;
    diff.x = mouseX - initial.x;
    diff.y = mouseY - initial.y;

    child.style.transform = `translate(${diff.x + UNIT}, ${diff.y + UNIT})`;

    setDrag("move", true);
  };

  /** end */

  const end = () => {
    if (drag.end) return;
    setDrag(
      produce((draft) => {
        draft.start = false;
        draft.move = false;
        draft.end = true;
      })
    );
  };
  const reset = () => {
    child.style.transform = `translate(0px, 0px)`;
    end();
  };
  const handleMouseUp = () => {
    let enabled = props.enabled ?? true;
    if (!enabled) return;

    if (props.resetOnDragEnd) {
      reset();
    } else {
      update(permanentlyAdded, diff);
      end();
    }
  };

  return <>{resolved()}</>;
};

export default Draggable;
