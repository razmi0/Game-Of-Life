import { createStore } from "solid-js/store";
import { DEFAULT_SPEED, MAX_DELAY, MIN_DELAY, START_IMMEDIATELY } from "../data";

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
    tick: 0,
    /** is there a limiter setup somewhere ? */
    limiter: false,
    /** queue feat is not implemented yet */
    queue: 0,
    changeMaxSpeed: (speed: number): void => setTimer("maxSpeed", speed),
    changeMinSpeed: (speed: number): void => setTimer("minSpeed", speed),
    switchPlayPause: () => {
      setTimer("play", !timer.play);
      timer.run();
    },

    /** wrap given working fn with some effects if needed */
    work: () => {
      fn();
      setTimer("tick", timer.tick + 1);
      timer.queue > 0 && timer.limiter && setTimer("queue", timer.queue - 1);
    },

    /** main feature : recursively call given work fn with given timer usin setTimeout*/

    run: () => {
      if (!timer.play) return;
      if (timer.limiter && timer.queue <= 0) {
        setTimer("limiter", false);
        timer.switchPlayPause();
        return;
      }

      timer.work();

      setTimeout(() => requestAnimationFrame(timer.run), timer.speed);
    },
    /** not implemented yet in project */
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
  });

  return timer;
}
