import { onMount, type Accessor } from "solid-js";
import { createStore, type Store } from "solid-js/store";
import { confirmTendency, randomColor } from "../helpers";
import { CELL_WIDTH, DEFAULT_RANDOMNESS, SHUFFLE_MAX_CONSECUTIVE_ALIVE, SHUFFLE_MAX_CONSECUTIVE_DEAD } from "../data";

export default function useGameOfLife() {
  const [board, setBoard] = createStore({
    /**
     * Shuffle a bit the grid based on arbitrary value of consecutive nature of cells (alive or dead)
     */
    // shuffle: () => {
    //   console.time("shuffle");
    //   let consecutiveAlive = 0;
    //   let consecutiveDead = 0;
    //   let indexToChange = [] as [number, number, boolean][];
    //   for (let i = 0; i < board.grid.length; i++) {
    //     for (let j = 0; j < board.grid[i].length; j++) {
    //       if (board.grid[i]?.[j]?.isAlive) {
    //         consecutiveAlive++;
    //         consecutiveDead = 0;
    //       } else {
    //         consecutiveDead++;
    //         consecutiveAlive = 0;
    //       }
    //       if (consecutiveAlive > SHUFFLE_MAX_CONSECUTIVE_ALIVE) {
    //         const changeIndex = j - 1 < 0 ? j : j - 1;
    //         indexToChange.push([i, changeIndex, false]);
    //         consecutiveAlive = 0;
    //       }
    //       if (consecutiveDead > SHUFFLE_MAX_CONSECUTIVE_DEAD) {
    //         const changeIndex = j - 5 < 0 ? j : j - 5;
    //         indexToChange.push([i, changeIndex, true]);
    //         consecutiveDead = 0;
    //       }
    //     }
    //   }
    // indexToChange.map(([row, col, newState]) => setBoard("grid", [row], [col], "isAlive", newState));
    // // board.build();
    // // board.draw();
    // console.timeEnd("shuffle");
    // return shuffleGrid;
    // },
  });

  // onMount(() => {
  //   setBoard("grid", board.build());
  // });

  return board;
}
