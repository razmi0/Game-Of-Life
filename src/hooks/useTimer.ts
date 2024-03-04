import { createStore } from "solid-js/store";
import { DEFAULT_SPEED, MAX_DELAY, MIN_DELAY, START_CLOCKED, START_IMMEDIATELY } from "../data";

/**
 * Gen playback controls
 * @returns
 */

export default function useTimer(fn: () => void) {
  const [timer, setTimer] = createStore({
    play: START_IMMEDIATELY,
    speed: DEFAULT_SPEED /** ms */,
    maxSpeed: MAX_DELAY,
    minSpeed: MIN_DELAY,
    clocked: START_CLOCKED,
    tick: 0,
    limiter: false,
    queue: 0,
    changeMaxSpeed: (speed: number): void => setTimer("maxSpeed", speed),
    changeMinSpeed: (speed: number): void => setTimer("minSpeed", speed),
    switchPlayPause: () => {
      setTimer("play", !timer.play);
      timer.run();
    },
    work: () => {
      fn();
      setTimer("tick", timer.tick + 1);
      timer.queue > 0 && timer.limiter && setTimer("queue", timer.queue - 1);
    },
    run: () => {
      if (!timer.play) return;
      if (timer.limiter && timer.queue <= 0) {
        setTimer("limiter", false);
        timer.switchPlayPause();
        return;
      }

      timer.work();

      if (timer.clocked) setTimeout(() => requestAnimationFrame(timer.run), timer.speed);
    },
    queueTicks: (ticks: number) => {
      setTimer("queue", ticks + timer.queue);
      setTimer("limiter", true);
      timer.play && timer.switchPlayPause();
    },

    tuneSpeed: (speed: number) => {
      setTimer("speed", speed);
    },

    changeSpeed: (addedSpeed: number) => {
      const newSpeed = timer.speed + addedSpeed;
      if (newSpeed < timer.minSpeed || newSpeed > timer.maxSpeed) return;
      setTimer("speed", newSpeed);
    },

    switchclocked: () => {
      setTimer("clocked", !timer.clocked);
    },
  });

  return timer;
}
