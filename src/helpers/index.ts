import { INITIAL_ALIVE_RATIO } from "../data";

export const randomChoice = () => (Math.random() + (0.5 - INITIAL_ALIVE_RATIO) > 0.5 ? false : true);

export const randomColor = () => {
  let color = "white";
  const random = Math.random() * 100;
  if (random <= 25) color = "#3B82F6";
  if (random > 25 && random <= 50) color = "#6366F1";
  if (random > 50 && random <= 75) color = "#EC4899";
  if (random > 75) color = "#F59E0B";
  return color;
};

type ScreenChange = "decrease" | "increase" | "no change";
/**
 * Take two numbers, compare them and return :  > 0 "decrease" or < 0 "increase" or "no change"
 */
export const screenChange = (val1: number, val2: number): ScreenChange => {
  if (val1 === val2) return "no change";
  return val1 > val2 ? "decrease" : "increase";
};
