import { type SetStoreFunction, Store, createStore } from "solid-js/store";
import { DEFAULT_SPEED, MAX_DELAY, MIN_DELAY, START_CLOCKED, START_IMMEDIATELY } from "../data";

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
    switchPlayPause: () => {
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
        clock.switchPlayPause();
        return;
      }

      clock.work();

      if (clock.clocked) setTimeout(() => requestAnimationFrame(clock.run), clock.speed);
    },
    queueTicks: (ticks: number) => {
      setClock("queue", ticks + clock.queue);
      setClock("limiter", true);
      clock.play && clock.switchPlayPause();
    },

    tuneSpeed: (speed: number) => {
      setClock("speed", speed);
    },

    changeSpeed: (addedSpeed: number) => {
      const newSpeed = clock.speed + addedSpeed;
      if (newSpeed < MIN_DELAY || newSpeed > MAX_DELAY) return;
      setClock("speed", newSpeed);
    },

    switchClocked: () => {
      setClock("clocked", !clock.clocked);
    },
  });

  return clock;
}
