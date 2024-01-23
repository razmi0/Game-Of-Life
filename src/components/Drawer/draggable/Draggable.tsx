import { Accessor, Component, JSXElement, children, createEffect, createSignal, onCleanup } from "solid-js";
import { createStore, produce, unwrap } from "solid-js/store";
import { Portal } from "solid-js/web";

//
// const portalNode = document.getElementById("portal-draggable")! as HTMLDivElement;

type DraggableProps = {
  children: JSXElement;
  enabled?: undefined | boolean;
  /** reset position on end */
  resetOnDragEnd?: boolean;
};

type DragState = {
  start: boolean;
  move: boolean;
  end: boolean;
};

/**
 * replace listener on move with movement() function
 * @param e
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
  // const [localEnabled, setLocalEnabled] = createSignal(props.enabled ?? true);
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
  createEffect(setup);

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
    if (!props.enabled || !drag.end) return;
    e.preventDefault();
    console.log("mousedown");

    initial.x = e.screenX - permanentlyAdded.x;
    initial.y = e.screenY - permanentlyAdded.y;

    start();
  };

  /** move */

  const handleMouseMove = (e: MouseEvent) => {
    let isReady = Date.now() - now > MOVE_TIMEOUT;
    if (!drag.start || !isReady) return;
    now = Date.now();
    console.log("mousemove");

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
    console.log("handleMouseUp");
    if (!props.enabled) return;
    if (props.resetOnDragEnd) reset();
    else {
      update(permanentlyAdded, diff);
      end();
    }
  };

  return <>{resolved()}</>;
};

export default Draggable;

//   const isInside = (coordinates: { x: number; y: number }) => {
//     const { left, top } = child.getBoundingClientRect();
//     const border = { left: left, top: top };
//     if (coordinates.x > border.left && coordinates.y < border.top) return true;
//   };

// type DragElementDataType = {
//     rect: { x: number; y: number; width: number; height: number };
//     unit: string;
//     child: HTMLElement;
//   }
//   const dragElementData : DragElementDataType = {
//     rect : { x: 0, y: 0, width: 0, height: 0 },
//     unit : "px",
//     child : null
//   }

//   type MoveableDataType = {
//     initial: { x: number; y: number };
//     diff: { x: number; y: number };
//     permanentlyAdded: { x: number; y: number };
//     rect: { x: number; y: number; width: number; height: number };
//   }
//   const moveableData : MoveableDataType = {
//     initial : { x: 0, y: 0 },
//     diff : { x: 0, y: 0 },
//     permanentlyAdded : { x: 0, y: 0 },
//     rect : { x: 0, y: 0, width: 0, height: 0 }
//   }
