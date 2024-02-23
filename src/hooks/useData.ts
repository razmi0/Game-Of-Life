import { createStore } from "solid-js/store";
import { DEFAULT_RANDOMNESS, MAX_ALIVE_RANDOM, MIN_ALIVE_RANDOM } from "../data";

export default function useData() {
  const [data, setData] = createStore({
    generation: 0,
    incrementGeneration: () => {
      setData("generation", data.generation + 1);
    },
    resetGeneration: () => {
      setData("generation", 0);
    },

    nAlive: 0,
    setAlive: (value: number) => {
      setData("nAlive", value);
    },

    nDead: 0,
    setDead: (value: number) => {
      setData("nDead", value);
    },

    randomness: DEFAULT_RANDOMNESS,
    randomChoice: () => (Math.random() * 100 - data.randomness + 50 > 50 ? true : false),

    tuneRandom: (value: number /** range 0 - 100 */) => {
      setData("randomness", value);
    },

    changeRandom: (addedRandom: number) => {
      const newRandom = data.randomness + addedRandom;
      if (newRandom < MIN_ALIVE_RANDOM || newRandom > MAX_ALIVE_RANDOM) return;
      setData("randomness", newRandom);
    },
  });

  return data;
}
