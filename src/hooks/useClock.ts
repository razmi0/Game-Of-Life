import { type SetStoreFunction, Store, createStore } from "solid-js/store";
import { DEFAULT_SPEED, START_CLOCKED, START_IMMEDIATELY } from "../data";

type ClockQueueTicksMode = "clocked" | "free";
/**
 * Gen playback controls
 * @returns
 */
export default function useClock(fn: () => void) {
  const [clock, setClock] = createStore({
    play: START_IMMEDIATELY,
    speed: DEFAULT_SPEED /** ms */,
    clocked: START_CLOCKED,
    tick: 0,
    limiter: false,
    queue: 0,
    playPause: () => {
      setClock("play", !clock.play);
      clock.run();
    },
    work: () => {
      fn();
      setClock("tick", clock.tick + 1);
      clock.queue > 0 && clock.limiter && setClock("queue", clock.queue - 1);
    },
    run: () => {
      if (!clock.play) return;
      if (clock.limiter && clock.queue <= 0) {
        setClock("limiter", false);
        clock.playPause();
        return;
      }
      clock.work();
      if (clock.clocked) setTimeout(clock.run, clock.speed);
      else clock.run();
    },
    queueTicks: (ticks: number) => {
      setClock("queue", ticks + clock.queue);
      setClock("limiter", true);
      clock.play && clock.playPause();
    },
    changeSpeed: (speed: number) => setClock("speed", speed),
    switchClocked: () => setClock("clocked", !clock.clocked),
    addSpeed: () => setClock("speed", Math.min(Math.max(Math.floor(clock.speed / 2), 0), 100)),
    subSpeed: () => setClock("speed", clock.speed + 100),
  }) as [Store<ClockState>, SetStoreFunction<ClockState>];

  return clock;
}
