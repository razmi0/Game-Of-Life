import { createEffect } from "solid-js";
import { SetStoreFunction, Store, StoreSetter, createStore } from "solid-js/store";

/**
 * Gen playback controls
 * @returns
 */
export default function useClock(fns: (() => void)[]): ClockState {
  const [clock, setClock] = createStore<ClockState>({
    play: false,
    speed: 500 /** ms */,
    tick: 0,
    playPause: () => {
      setClock("play", !clock.play);
      clock.play && clock.run();
    },
    run: () => {
      if (!clock.play) return;
      fns.map((fn) => fn());
      clock.addTick();
      clock.play && setTimeout(clock.run, clock.speed);
    },
    addTick: () => setClock("tick", clock.tick + 1),
    changeSpeed: (speed: number) => setClock("speed", speed),
    addSpeed: () => {
      console.log(clock.speed);
      setClock("speed", clock.speed / 2 < 10 ? 10 : clock.speed / 2);
    },
    subSpeed: () => {
      console.log(clock.speed);
      setClock("speed", clock.speed + 100);
    },
  }) as [Store<ClockState>, SetStoreFunction<ClockState>];

  return clock as ClockState;
}
