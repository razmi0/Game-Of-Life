import { createEffect } from "solid-js";
import { SetStoreFunction, Store, StoreSetter, createStore } from "solid-js/store";

type ClockQueueTicksMode = "clocked" | "free";
/**
 * Gen playback controls
 * @returns
 */
export default function useClock(fns: (() => void)[]): [Store<ClockState>, SetStoreFunction<ClockState>] {
  const [clock, setClock] = createStore<ClockState>({
    play: false,
    speed: 500 /** ms */,
    tick: 0,
    clocked: true,
    limiter: false,
    queue: 0,
    playPause: () => {
      setClock("play", !clock.play);
      clock.run();
    },
    work: () => {
      fns.map((fn) => fn());
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
      !clock.play && clock.playPause();
    },
    changeSpeed: (speed: number) => setClock("speed", speed),
    switchClocked: () => setClock("clocked", !clock.clocked),
    addSpeed: () => setClock("speed", Math.min(Math.max(Math.floor(clock.speed / 2), 0), 100)),
    subSpeed: () => setClock("speed", clock.speed + 100),
  }) as [Store<ClockState>, SetStoreFunction<ClockState>];

  return [clock, setClock] as [Store<ClockState>, SetStoreFunction<ClockState>];
}
