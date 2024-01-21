let alivePopTendency: boolean[] = [];
let deadPopTendency: boolean[] = [];

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

type CellNatureType = "alive" | "dead";
export const confirmTendency = (tendency: boolean, state: CellNatureType) => {
  let tendencyMaxLength = 5;
  let leftConsensus = 1;
  let isTendency = false;
  let agree = 0; // 1/5

  let arr = state === "alive" ? alivePopTendency : deadPopTendency;
  const newLength = arr.push(tendency);
  arr.map((t) => (t === tendency ? agree++ : agree--));
  if (agree >= tendencyMaxLength - leftConsensus) isTendency = true;
  if (newLength > tendencyMaxLength) arr.shift();
  state === "alive" ? (alivePopTendency = arr) : (deadPopTendency = arr);
  return isTendency;
};
