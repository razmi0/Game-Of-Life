# Rules

<ol>
    <li>Any live cell with fewer than two live neighbours dies, as if by underpopulation.</li>
    <li>Any live cell with two or three live neighbours lives on to the next generation.</li>
    <li>Any live cell with more than three live neighbours dies, as if by overpopulation.</li>
    <li>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
</ol>

## Notes

<ul>
    <li>change randomness factor with range input</li>
    <li>change speed with range input</li>
    <li>alive : fixed color ; dead : black or background img with repeat</li>
    <li>implement memo neighbors to countAliveNeighbors for perf opti</li>
</ul>

#### Inputs

On group : // for stats ; ranges
pin => trigger drag
+/- => minimilaze/maximilaze
cross => close

param

- size

range Add to Queue (x) => button to add x to queue

save file ?
paint the grid?
typology open closed wrap
group => remarquable shapes + add it to grid

Cells :
Age => color

#### TODO

- [ ] implement workers
- [x] implement redraw only flipped ?
- [ ] _replace SafeArea Rect with safeArea trapezoid svg (left height === item height ; right height === tooltip height)_
- [ ] CURRENT TASK => paint the grid
- [ ] text to grid
- [ ] img to grid
- [ ] color picker for cells
- [ ] shape picker for draw (common shapes + custom + remarquable shapes)
- [ ] shape picker for cells (circle, square, triangle, hexagon, octogon, star, heart, custom)
- [ ] toroidal grid
- [ ] implement remarquable shapes and add it to grid
- [x] tortue/escargot lapin icon pour speed range
- [ ] reset default params
- [ ] full HTML for SEO presentation (what ? for what ? why ? how ? when ? )
- [ ] space between cells (new branch ) and background off cells grey
- [x] stats => add cell size
- [ ] implement white theme
- [ ] add loader animation
- [ ] tools => zoom on cursor