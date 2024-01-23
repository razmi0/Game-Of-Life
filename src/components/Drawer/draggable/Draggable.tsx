import { type Component, type JSXElement, children, onCleanup, onMount } from "solid-js";
import { createStore, produce } from "solid-js/store";

type DraggableProps = {
  children: JSXElement;
  enabled?: undefined | boolean;
  resetOnDragEnd?: boolean | undefined;
};

type DragState = {
  start: boolean;
  move: boolean;
  end: boolean;
  setStart: () => void;
  setMove: () => void;
  setEnd: () => void;
};

/**
 * TODO
 */

const MOVE_HZ = 60;
const MOVE_TIMEOUT = Math.floor(1000 / MOVE_HZ); // MOVE_HZ/s
const UNIT = "px";
const update = (obj1: Record<string, number>, obj2: Record<string, number>) => {
  for (let n in obj1) obj1[n] = obj2[n];
};
/**
 * Make a draggable element
 */
const Draggable: Component<DraggableProps> = (props): JSXElement => {
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

    /** attributes & data */
    child.toggleAttribute("draggable");
    const { left, top, width, height } = child.getBoundingClientRect();
    rect = { x: left, y: top, width, height };
    initial = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };

    listeners();
  };

  const listeners = () => {
    child.addEventListener("click", handleClick);
    child.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    child.addEventListener("mouseup", handleMouseUp);
  };

  onMount(setup);
  onCleanup(() => {
    child.removeEventListener("click", handleClick);
    child.removeEventListener("mousedown", handleMouseDown);
    document.removeEventListener("mousemove", handleMouseMove);
    child.removeEventListener("mouseup", handleMouseUp);
  });

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
  };

  /** END */

  const handleMouseUp = () => {
    let enabled = props.enabled ?? true;
    if (!enabled) return;

    props.resetOnDragEnd ? (child.style.transform = `translate(0px, 0px)`) : update(permanentlyAdded, diff);
    if (drag.end) return;
    drag.setEnd();
  };

  return <>{resolved()}</>;
};

export default Draggable;
