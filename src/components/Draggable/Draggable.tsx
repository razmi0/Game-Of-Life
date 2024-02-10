import { type JSXElement, children, onCleanup, onMount, createEffect, on } from "solid-js";
import { createStore } from "solid-js/store";

type DraggableProps = {
  children: JSXElement;
  /** Does this element move ? */
  enabled?: boolean;
  /** Do we reset on move's end ? */
  resetOnDragEnd?: boolean;
  onStart?: () => void;
  onDrag?: () => void;
  onEnd?: () => void;
  /** Trigger reset position immediately when value change (strict equality by reference) */
  reset?: unknown;
};

type DragState = {
  start: boolean;
  move: boolean;
  end: boolean;
  setStart: () => void;
  setMove: () => void;
  setEnd: () => void;
};

type CoordType = {
  x: number;
  y: number;
};

type RectType = CoordType & {
  width: number;
  height: number;
};

/**
 * TODO
 * - [ ] Add touch support
 */

const MOVE_HZ = 60;
const MOVE_TIMEOUT = Math.floor(1000 / MOVE_HZ); // MOVE_HZ/s
const UNIT = "px";

/**
 * Make a draggable element
 */
export default function Draggable(props: DraggableProps): JSXElement {
  const [drag, setDrag] = createStore<DragState>({
    start: false,
    move: false,
    end: true,
    setStart: () => {
      setDrag("start", true);
      setDrag("move", false);
      setDrag("end", false);
    },
    setMove: () => setDrag("move", true),
    setEnd: () => {
      setDrag("start", false);
      setDrag("move", false);
      setDrag("end", true);
    },
  });
  if (!props.children) throw new Error("Draggable component must have children");
  let child: HTMLElement;
  let now = Date.now();
  let initial: CoordType = { x: 0, y: 0 };
  let diff: CoordType = { x: 0, y: 0 };
  let permanentlyAdded: CoordType = { x: 0, y: 0 };
  let rect: RectType = { x: 0, y: 0, width: 0, height: 0 };

  const resolved = children(() => props.children);

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

    addListeners();
  };
  const addListeners = () => {
    child.addEventListener("click", handleClick);
    child.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    child.addEventListener("mouseup", handleMouseUp);
  };
  const removeListeners = () => {
    child.removeEventListener("click", handleClick);
    child.removeEventListener("mousedown", handleMouseDown);
    document.removeEventListener("mousemove", handleMouseMove);
    child.removeEventListener("mouseup", handleMouseUp);
  };

  onMount(setup);
  onCleanup(removeListeners);

  /** CLICK */
  const handleClick = () => {
    if (drag.start) drag.setEnd();
  };

  /** START */

  const handleMouseDown = (e: MouseEvent) => {
    let enabled = props.enabled ?? true;
    if (!enabled || !drag.end) return;
    e.preventDefault();

    initial.x = e.screenX - permanentlyAdded.x;
    initial.y = e.screenY - permanentlyAdded.y;

    drag.setStart();
    props.onStart?.();
  };

  /** MOVE is attach to document */

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

    drag.setMove();
    props.onDrag?.();
  };

  /** END */

  const update = () => {
    Object.assign(permanentlyAdded, diff);
  };
  const reset = () => {
    child.style.transform = `translate(0px, 0px)`;
    permanentlyAdded = { x: 0, y: 0 };
  };
  createEffect(on(() => props.reset, reset));
  const handleMouseUp = () => {
    let enabled = props.enabled ?? true;
    if (!enabled || drag.end) return;

    props.resetOnDragEnd ? reset() : update();
    drag.setEnd();
    props.onEnd?.();
  };

  return <>{resolved()}</>;
}
