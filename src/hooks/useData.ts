import { createStore } from "solid-js/store";
import { DEFAULT_RANDOMNESS } from "../data";

export default function useData() {
  const [data, setData] = createStore({
    generation: 0,
    incrementGeneration: () => {
      setData("generation", data.generation + 1);
    },

    nAlive: 0,
    setAlive: (value: number) => {
      setData("nAlive", value);
    },

    nAliveIncrease: false,
    switchAliveIncrease: () => {
      setData("nAliveIncrease", !data.nAliveIncrease);
    },

    nDead: 0,
    setDead: (value: number) => {
      setData("nDead", value);
    },

    nDeadIncrease: false,
    switchDeadIncrease: () => {
      setData("nDeadIncrease", !data.nDeadIncrease);
    },

    randomness: DEFAULT_RANDOMNESS,
    randomChoice: () => (Math.random() * 100 - data.randomness + 50 > 50 ? true : false),
    setRandom: (value: number /** range 0 - 100 */) => {
      setData("randomness", value);
    },
  });

  return data;
}
