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

- [ ] (#1) implement workers ( for resize colors too )
- [ ] (#4) Replace resetBlank by a resetDefault feat
- [ ] (#6) text to grid (HOW ?????)
- [ ] (#7) img to grid
- [ ] (#9) shape picker for draw (common shapes + custom + remarquable shapes)
- [ ] (#11) toroidal grid on X (already done on Y)
- [ ] (#12) implement remarquable shapes and add it to grid
- [ ] (#14) full HTML for SEO presentation (what ? for what ? why ? how ? when ? )
- [ ] (#15) space between cells (new branch ) and background off cells grey
- [ ] (#17) implement white theme
- [ ] (#18) add loader animation
- [ ] (#20) Refacto resize so extended on the canva plane (currently resize is just working on the array length so past hash is compacted or extended)
- [ ] (#21) Find a way to implement loader when hash running

#### DONE

- [x] (#2) implement redraw only flipped ?
- [x] (#3) paint the grid / erase the grid (with size)
- [x] (#5) add color picker to paint tools
- [x] (#8) color picker for cells (alive, dead, background)
- [x] (#10) shape picker for cells (circle, square)
- [x] (#13) tortue/escargot lapin icon pour speed range
- [x] (#16) stats => add cell size
- [x] (#19) Refactor if Nparam > 2 => use object
